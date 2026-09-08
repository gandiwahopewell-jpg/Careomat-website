import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Breadcrumbs, JsonLd } from "@/components/content"
import { CTA } from "@/components/site-shell"
import { articles, getArticle } from "@/lib/content"

export function generateStaticParams() { return articles.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const article=getArticle(slug); if(!article) return {}; return { title:article.title, description:article.excerpt, alternates:{canonical:`/resources/${slug}`}, openGraph:{type:"article",title:article.title,description:article.excerpt,publishedTime:article.date} } }

export default async function ArticlePage({ params }: { params: Promise<{ slug:string }> }) {
  const { slug } = await params; const article=getArticle(slug); if(!article) notFound(); const formatted=new Intl.DateTimeFormat("en-GB",{day:"numeric",month:"long",year:"numeric"}).format(new Date(article.date));
  const data={"@context":"https://schema.org","@type":"Article",headline:article.title,description:article.excerpt,datePublished:article.date,author:{"@type":"Organization",name:"Careomat"},publisher:{"@type":"Organization",name:"Careomat"},mainEntityOfPage:`https://www.careomat.co.uk/resources/${slug}`}
  return <><JsonLd data={data}/><Breadcrumbs items={[{label:"Resources",href:"/resources"},{label:article.title}]}/><article><header className="border-y"><div className="page-shell flex max-w-4xl flex-col gap-6 py-16"><div className="flex gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><span>{article.category}</span><span aria-hidden="true">/</span><time dateTime={article.date}>{formatted}</time><span aria-hidden="true">/</span><span>{article.readTime}</span></div><h1 className="text-balance text-4xl font-semibold tracking-[-0.04em] md:text-6xl">{article.title}</h1><p className="max-w-3xl text-xl leading-8 text-muted-foreground">{article.intro}</p></div></header><div className="page-shell grid max-w-5xl gap-12 py-16 lg:grid-cols-[.3fr_.7fr]"><aside><p className="mb-4 text-sm font-semibold">In this article</p><ol className="flex flex-col gap-3 text-sm text-muted-foreground">{article.sections.map((section,index)=><li key={section.heading}><a href={`#section-${index+1}`} className="hover:text-foreground">{section.heading}</a></li>)}</ol></aside><div className="prose-careomat">{article.sections.map((section,index)=><section key={section.heading} id={`section-${index+1}`}><h2>{section.heading}</h2>{section.body.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}</section>)}<Link href="/resources" className="mt-12 inline-flex items-center gap-2 font-semibold text-primary"><ArrowLeft aria-hidden="true"/> Back to resources</Link></div></div></article><CTA/></>
}
