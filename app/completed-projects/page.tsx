import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageIntro, ProjectCard } from "@/components/content";
import { CTA } from "@/components/site-shell";
import { sanityFetch } from "@/sanity/lib/client";
import { COMPLETED_PROJECTS_QUERY, type SanityProject } from "@/sanity/lib/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Completed Projects",
  description:
    "Explore completed software delivery projects and case studies from Careomat across public services, infrastructure and membership organisations.",
  alternates: { canonical: "/completed-projects" },
};

export default async function CompletedProjectsPage() {
  let projects: SanityProject[] = [];
  try {
    projects = await sanityFetch<SanityProject[]>({
      query: COMPLETED_PROJECTS_QUERY,
      tags: ["project"],
    });
  } catch (error) {
    console.error("Failed to fetch completed projects from Sanity:", error);
  }

  // When there is no project yet, redirect to the home page
  if (!projects || projects.length === 0) {
    redirect("/");
  }

  return (
    <>
      <PageIntro
        eyebrow="Completed projects"
        title="Delivery evidence from completed programmes."
        description="Explore how Careomat helps organisations deliver dependable custom software, service modernisations and mission-critical digital systems."
      />
      <section>
        <div className="page-shell grid gap-8 py-16 md:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </section>
      <CTA title="Have a similar delivery problem to solve?" />
    </>
  );
}
