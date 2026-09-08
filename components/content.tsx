import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import type { Article, Project } from "@/lib/content"
import type { SanityPost, SanityProject } from "@/sanity/lib/queries"
import { urlFor } from "@/sanity/lib/image"

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="border-b"><div className="page-shell flex max-w-4xl flex-col gap-5 py-16 md:py-24"><p className="eyebrow">{eyebrow}</p><h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{title}</h1><p className="max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p></div></section>
}

export function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return <div className="flex max-w-2xl flex-col gap-4"><p className="eyebrow">{eyebrow}</p><h2 className="text-balance text-3xl font-semibold tracking-[-0.03em] md:text-4xl">{title}</h2>{body && <p className="leading-7 text-muted-foreground">{body}</p>}</div>
}

export function ProjectCard({ project }: { project: Project | SanityProject }) {
  return (
    <Link href={`/work/${project.slug}`} className="group flex min-h-80 flex-col justify-between border-t py-7 hover:border-primary">
      <div className="flex items-start justify-between gap-5">
        <div className="flex gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <span>{project.sector || "Client delivery"}</span>
          {project.year && (
            <>
              <span aria-hidden="true">/</span>
              <span>{project.year}</span>
            </>
          )}
        </div>
        <ArrowRight className="text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-4">
        {project.outcome && <p className="text-sm font-medium text-primary">{project.outcome}</p>}
        <h3 className="text-balance text-2xl font-semibold tracking-tight">{project.title}</h3>
        <p className="leading-7 text-muted-foreground">{project.summary}</p>
      </div>
    </Link>
  )
}

export function ArticleCard({ article }: { article: Article | SanityPost }) {
  const categoryTitle = typeof article.category === "object" && article.category ? article.category.title : (article.category as string) || "Guide";
  const categoryColor = typeof article.category === "object" && article.category?.color ? article.category.color : "";
  const readingTimeText = "readingTime" in article && article.readingTime ? `${article.readingTime} min read` : ("readTime" in article && article.readTime ? article.readTime : "5 min read");
  const hasCoverImage = "coverImage" in article && article.coverImage?.asset?._ref;

  return (
    <article className="flex h-full flex-col justify-between gap-6 overflow-hidden rounded-lg border bg-card p-6 transition-colors hover:border-primary/50">
      {hasCoverImage && (
        <div className="relative -mx-6 -mt-6 mb-2 aspect-video overflow-hidden border-b bg-muted">
          <Image
            src={urlFor(article.coverImage).width(600).height(338).fit("crop").url()}
            alt={article.coverImage?.alt || article.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className={categoryColor}>{categoryTitle}</span>
        <span>{readingTimeText}</span>
      </div>
      <div className="flex flex-col gap-4">
        <h3 className="text-balance text-xl font-semibold tracking-tight">
          <Link href={`/resources/${article.slug}`} className="hover:text-primary">
            {article.title}
          </Link>
        </h3>
        {article.excerpt && <p className="text-sm leading-6 text-muted-foreground line-clamp-3">{article.excerpt}</p>}
        <Link href={`/resources/${article.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary mt-2">
          Read the article <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return <nav className="page-shell py-5 text-sm text-muted-foreground" aria-label="Breadcrumb"><ol className="flex flex-wrap items-center gap-2">{items.map((item, index) => <li key={item.label} className="flex items-center gap-2">{index > 0 && <span aria-hidden="true">/</span>}{item.href ? <Link href={item.href} className="hover:text-foreground">{item.label}</Link> : <span aria-current="page">{item.label}</span>}</li>)}</ol></nav>
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}
