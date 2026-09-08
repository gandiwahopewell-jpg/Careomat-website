import type { Metadata } from "next";
import { ArticleCard, PageIntro } from "@/components/content";
import { CTA } from "@/components/site-shell";
import { articles as fallbackArticles } from "@/lib/content";
import { sanityFetch } from "@/sanity/lib/client";
import { POSTS_QUERY, type SanityPost } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Software Delivery Resources",
  description:
    "Practical guidance from Careomat on software procurement, custom development, technical discovery and legacy modernisation in the UK.",
  alternates: { canonical: "/resources" },
};

export default async function ResourcesPage() {
  let sanityPosts: SanityPost[] = [];
  try {
    sanityPosts = await sanityFetch<SanityPost[]>({
      query: POSTS_QUERY,
      tags: ["post"],
    });
  } catch (error) {
    console.error("Failed to fetch posts from Sanity:", error);
  }

  const postsToRender = sanityPosts && sanityPosts.length > 0 ? sanityPosts : fallbackArticles;

  return (
    <>
      <PageIntro
        eyebrow="Resources"
        title="Useful thinking for better software decisions."
        description="Clear, practical guidance for people buying, governing and improving software—written to be used, not merely shared."
      />
      <section>
        <div className="page-shell grid gap-6 py-16 md:grid-cols-3">
          {postsToRender.map((post) => (
            <ArticleCard key={post.slug} article={post} />
          ))}
        </div>
      </section>
      <CTA title="Need to apply this thinking to a live decision?" />
    </>
  );
}
