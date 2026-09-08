import type { Metadata } from "next"
import { ArticleCard, PageIntro } from "@/components/content"
import { CTA } from "@/components/site-shell"
import { articles } from "@/lib/content"

export const metadata: Metadata = { title: "Software Delivery Resources", description: "Practical guidance from Careomat on software procurement, custom development, technical discovery and legacy modernisation in the UK.", alternates: { canonical: "/resources" } }

export default function ResourcesPage() { return <><PageIntro eyebrow="Resources" title="Useful thinking for better software decisions." description="Clear, practical guidance for people buying, governing and improving software—written to be used, not merely shared."/><section><div className="page-shell grid gap-5 py-16 md:grid-cols-3">{articles.map((article)=><ArticleCard key={article.slug} article={article}/>)}</div></section><CTA title="Need to apply this thinking to a live decision?"/></> }
