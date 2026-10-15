import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Breadcrumbs, JsonLd } from "@/components/content";
import { CustomPortableText } from "@/components/portable-text";
import { CTA } from "@/components/site-shell";
import { sanityFetch } from "@/sanity/lib/client";
import {
  POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  type SanityPost,
} from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const sanityPosts = await sanityFetch<{ slug: string }[]>({
      query: POSTS_QUERY,
    });
    const sanitySlugs = sanityPosts?.map((p) => ({ slug: p.slug })) || [];
    const allSlugs = new Set([...sanitySlugs.map((s) => s.slug)]);
    return Array.from(allSlugs).map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let sanityPost: SanityPost | null = null;
  try {
    sanityPost = await sanityFetch<SanityPost | null>({
      query: POST_BY_SLUG_QUERY,
      params: { slug },
      tags: [`post:${slug}`],
    });
  } catch {
    // fallback
  }

  const title = sanityPost?.seo?.metaTitle || sanityPost?.title;
  const description = sanityPost?.seo?.metaDescription || sanityPost?.excerpt;

  if (!title) return {};

  const shareImageUrl = sanityPost?.seo?.shareImage?.asset?._ref
    ? urlFor(sanityPost.seo.shareImage)
        .width(1200)
        .height(630)
        .fit("crop")
        .url()
    : sanityPost?.coverImage?.asset?._ref
      ? urlFor(sanityPost.coverImage).width(1200).height(630).fit("crop").url()
      : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/resources/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: sanityPost?.publishedAt,
      modifiedTime: sanityPost?.updatedAt,
      images: shareImageUrl ? [{ url: shareImageUrl }] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let sanityPost: SanityPost | null = null;
  try {
    sanityPost = await sanityFetch<SanityPost | null>({
      query: POST_BY_SLUG_QUERY,
      params: { slug },
      tags: [`post:${slug}`],
    });
  } catch (err) {
    console.error("Failed to fetch post from Sanity:", err);
  }

  if (!sanityPost) {
    notFound();
  }

  const title = sanityPost?.title || "";
  const excerpt = sanityPost?.excerpt || "";
  const intro = excerpt;
  const rawDate = sanityPost?.publishedAt;
  const formattedDate = rawDate
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(rawDate))
    : "";

  const categoryTitle =
    typeof sanityPost?.category === "object" && sanityPost?.category
      ? sanityPost.category.title
      : "Resources";

  const categoryColor =
    typeof sanityPost?.category === "object" && sanityPost?.category?.color
      ? sanityPost.category.color
      : "text-primary";

  const readTime = sanityPost?.readingTime
    ? `${sanityPost.readingTime} min read`
    : "5 min read";

  // Table of contents headings
  const tocHeadings: { heading: string; id: string }[] = [];
  if (sanityPost?.body) {
    for (const block of sanityPost.body) {
      if (block._type === "block" && block.style === "h2") {
        const text = block.children?.map((c: any) => c.text).join("") || "";
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        if (text) {
          tocHeadings.push({ heading: text, id });
        }
      }
    }
  }

  const authorsList = sanityPost?.authors || [];
  const primaryAuthor = authorsList[0]?.author?.name || "Careomat";

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: rawDate,
    dateModified: sanityPost?.updatedAt || rawDate,
    author: {
      "@type": "Person",
      name: primaryAuthor,
    },
    publisher: {
      "@type": "Organization",
      name: "Careomat",
      url: "https://www.careomat.co.uk",
    },
    mainEntityOfPage: `https://www.careomat.co.uk/resources/${slug}`,
  };

  const roleLabelMap: Record<string, string> = {
    lead_author: "Lead Author",
    co_author: "Co-author",
    editor: "Editor",
    contributor: "Contributor",
    photographer: "Photographer",
    illustrator: "Illustrator",
    researcher: "Researcher",
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <Breadcrumbs
        items={[{ label: "Resources", href: "/resources" }, { label: title }]}
      />

      <article>
        <header className="border-y bg-muted/10">
          <div className="page-shell flex max-w-4xl flex-col gap-6 py-16">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <span className={categoryColor}>{categoryTitle}</span>
              {formattedDate && (
                <>
                  <span aria-hidden="true">/</span>
                  <time dateTime={rawDate}>{formattedDate}</time>
                </>
              )}
              <span aria-hidden="true">/</span>
              <span>{readTime}</span>
            </div>

            <h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] md:text-6xl text-foreground">
              {title}
            </h1>

            {intro && (
              <p className="max-w-3xl text-xl leading-8 text-muted-foreground">
                {intro}
              </p>
            )}

            {/* Authors */}
            {authorsList.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-6 border-t pt-6">
                {authorsList.map((item, idx) => {
                  const author = item.author;
                  const role = item.articleRole
                    ? roleLabelMap[item.articleRole] || item.articleRole
                    : undefined;
                  const hasAvatar = author?.avatar?.asset?._ref;

                  return (
                    <div
                      key={author?.name || idx}
                      className="flex items-center gap-3"
                    >
                      {hasAvatar ? (
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border">
                          <Image
                            src={urlFor(author.avatar)
                              .width(80)
                              .height(80)
                              .fit("crop")
                              .url()}
                            alt={author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground border">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {author?.name || "Author"}
                        </p>
                        {role && (
                          <p className="text-xs text-muted-foreground">
                            {role}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Cover Image */}
            {sanityPost?.coverImage?.asset?._ref && (
              <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                <Image
                  src={urlFor(sanityPost.coverImage)
                    .width(1200)
                    .height(675)
                    .fit("crop")
                    .url()}
                  alt={sanityPost.coverImage.alt || title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                />
              </div>
            )}
          </div>
        </header>

        <div className="page-shell grid max-w-5xl gap-12 py-16 lg:grid-cols-[.3fr_.7fr]">
          {/* Table of Contents */}
          {tocHeadings.length > 0 ? (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="mb-4 text-sm font-semibold text-foreground">
                  In this article
                </p>
                <ol className="flex flex-col gap-3 text-sm text-muted-foreground">
                  {tocHeadings.map((heading) => (
                    <li key={heading.id}>
                      <a
                        href={`#${heading.id}`}
                        className="hover:text-foreground transition-colors"
                      >
                        {heading.heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          ) : (
            <div className="hidden lg:block" />
          )}

          {/* Article Body */}
          <div className="prose-careomat min-w-0">
            {sanityPost?.body ? (
              <CustomPortableText value={sanityPost.body} />
            ) : null}

            <Link
              href="/resources"
              className="mt-12 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to
              resources
            </Link>
          </div>
        </div>
      </article>

      <CTA />
    </>
  );
}
