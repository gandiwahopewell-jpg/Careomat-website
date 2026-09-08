import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "cvzj6xvr";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const sanityToken = process.env.SANITY_TOKEN;

// Read-only client (no auth needed for CDN reads)
const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Write client (needs token)
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: sanityToken,
});

const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

/**
 * GET /api/views/[slug]
 * Returns the current view count for the post.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const result = await readClient.fetch<{ viewCount: number } | null>(
      `*[_type == "post" && slug.current == $slug][0]{ viewCount }`,
      { slug }
    );

    const count = result?.viewCount ?? 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error("[views/GET] Sanity fetch failed:", error);
    return NextResponse.json({ count: 0 });
  }
}

/**
 * POST /api/views/[slug]
 * Increments the view count. Checks a cookie first to prevent repeated
 * counting from the same browser within 24 hours.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // --- Cookie guard ---
  const cookieName = `viewed_post_${slug}`;
  const alreadyViewed = req.cookies.get(cookieName);
  if (alreadyViewed) {
    // Return the current count without incrementing
    try {
      const result = await readClient.fetch<{ viewCount: number } | null>(
        `*[_type == "post" && slug.current == $slug][0]{ viewCount }`,
        { slug }
      );
      return NextResponse.json(
        { count: result?.viewCount ?? 0, alreadyCounted: true },
        { status: 200 }
      );
    } catch {
      return NextResponse.json({ count: 0, alreadyCounted: true });
    }
  }

  // --- Find the document id ---
  let docId: string | null = null;
  try {
    const doc = await readClient.fetch<{ _id: string } | null>(
      `*[_type == "post" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    docId = doc?._id ?? null;
  } catch (error) {
    console.error("[views/POST] Failed to fetch doc id:", error);
    return NextResponse.json(
      { error: "Document not found" },
      { status: 404 }
    );
  }

  if (!docId) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  if (!sanityToken) {
    console.warn("[views/POST] SANITY_TOKEN not set – skipping write.");
    return NextResponse.json({ count: 0, skipped: true });
  }

  // --- Increment via Sanity patch ---
  let newCount = 0;
  try {
    const updated = await writeClient
      .patch(docId)
      .setIfMissing({ viewCount: 0 })
      .inc({ viewCount: 1 })
      .commit<{ viewCount: number }>();
    newCount = updated.viewCount ?? 0;
  } catch (error) {
    console.error("[views/POST] Sanity patch failed:", error);
    return NextResponse.json({ error: "Write failed" }, { status: 500 });
  }

  // --- Set cookie so this browser won't increment again for 24 h ---
  const response = NextResponse.json({ count: newCount });
  response.cookies.set(cookieName, "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
  return response;
}
