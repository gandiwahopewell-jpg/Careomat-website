import type { Metadata } from "next"
import { PageIntro, ProjectCard } from "@/components/content"
import { CTA } from "@/components/site-shell"
import { projects } from "@/lib/content"

export const metadata: Metadata = { title: "Software Projects & Case Studies", description: "Explore Careomat software consultancy and custom development case studies across public services, infrastructure and membership organisations.", alternates: { canonical: "/work" } }

export default function WorkPage() {
  return <><PageIntro eyebrow="Selected work" title="Delivery evidence, not a gallery of screens." description="Each case study explains the operating problem, the decisions made and the change achieved. Names and identifying details are withheld in these illustrative examples."/><section><div className="page-shell grid gap-8 py-16 md:grid-cols-3">{projects.map((project)=><ProjectCard key={project.slug} project={project}/>)}</div></section><CTA title="Have a similar delivery problem?"/></>
}
