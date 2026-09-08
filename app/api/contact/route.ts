import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "cvzj6xvr";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";
const sanityToken = process.env.SANITY_TOKEN;

const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: sanityToken,
});

interface ContactPayload {
  name: string;
  email: string;
  organisation: string;
  enquiry?: string;
  budget?: string;
  message: string;
  privacyAgreed: boolean;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: ContactPayload;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // --- Server-side validation ---
  const { name, email, organisation, enquiry, budget, message, privacyAgreed } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 422 });
  }
  if (!isValidEmail(email ?? "")) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 422 });
  }
  if (!organisation?.trim()) {
    return NextResponse.json({ error: "Organisation is required." }, { status: 422 });
  }
  if (!message?.trim() || message.trim().length < 20) {
    return NextResponse.json(
      { error: "Please provide a message of at least 20 characters." },
      { status: 422 }
    );
  }
  if (!privacyAgreed) {
    return NextResponse.json(
      { error: "Privacy consent is required." },
      { status: 422 }
    );
  }

  // --- Write to Sanity ---
  if (!sanityToken) {
    console.error("[contact/POST] SANITY_TOKEN is not set.");
    return NextResponse.json(
      { error: "Server configuration error. Please email us directly." },
      { status: 500 }
    );
  }

  try {
    await writeClient.create({
      _type: "contactSubmission",
      name: name.trim(),
      email: email.trim().toLowerCase(),
      organisation: organisation.trim(),
      enquiry: enquiry?.trim() || undefined,
      budget: budget?.trim() || undefined,
      message: message.trim(),
      privacyAgreed: true,
      submittedAt: new Date().toISOString(),
      status: "new",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[contact/POST] Sanity write failed:", error);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try again or email us directly." },
      { status: 500 }
    );
  }
}
