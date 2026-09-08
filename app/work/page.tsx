import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageIntro, ProjectCard } from "@/components/content";
import { CTA } from "@/components/site-shell";
import { projects as fallbackProjects } from "@/lib/content";
import { sanityFetch } from "@/sanity/lib/client";
import { COMPLETED_PROJECTS_QUERY, type SanityProject } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Software Projects & Case Studies",
  description:
    "Explore Careomat software consultancy and custom development case studies across public services, infrastructure and membership organisations.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  let sanityProjects: SanityProject[] = [];
  try {
    sanityProjects = await sanityFetch<SanityProject[]>({
      query: COMPLETED_PROJECTS_QUERY,
      tags: ["project"],
    });
  } catch (error) {
    console.error("Failed to fetch projects from Sanity:", error);
  }

  const projectsToRender =
    sanityProjects && sanityProjects.length > 0 ? sanityProjects : fallbackProjects;

  if (!projectsToRender || projectsToRender.length === 0) {
    redirect("/");
  }

  return (
    <>
      <PageIntro
        eyebrow="Selected work"
        title="Delivery evidence, not a gallery of screens."
        description="Each case study explains the operating problem, the decisions made and the change achieved. Names and identifying details are withheld in these illustrative examples."
      />
      <section>
        <div className="page-shell grid gap-8 py-16 md:grid-cols-3">
          {projectsToRender.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <CTA title="Have a similar delivery problem?" />
    </>
  );
}
