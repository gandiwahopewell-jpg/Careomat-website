import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Breadcrumbs, JsonLd } from "@/components/content";
import { CTA } from "@/components/site-shell";
import { getProject, projects as fallbackProjects } from "@/lib/content";
import { sanityFetch } from "@/sanity/lib/client";
import { COMPLETED_PROJECTS_QUERY, PROJECT_BY_SLUG_QUERY, type SanityProject } from "@/sanity/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const sanityProjects = await sanityFetch<{ slug: string }[]>({
      query: COMPLETED_PROJECTS_QUERY,
    });
    const sSlugs = sanityProjects?.map((p) => ({ slug: p.slug })) || [];
    const fSlugs = fallbackProjects.map(({ slug }) => ({ slug }));
    const all = new Set([...sSlugs.map((s) => s.slug), ...fSlugs.map((s) => s.slug)]);
    return Array.from(all).map((slug) => ({ slug }));
  } catch {
    return fallbackProjects.map(({ slug }) => ({ slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let sanityProject: SanityProject | null = null;
  try {
    sanityProject = await sanityFetch<SanityProject | null>({
      query: PROJECT_BY_SLUG_QUERY,
      params: { slug },
      tags: [`project:${slug}`],
    });
  } catch {
    // fallback
  }

  const fallback = getProject(slug);
  const project = sanityProject || fallback;

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let sanityProject: SanityProject | null = null;
  try {
    sanityProject = await sanityFetch<SanityProject | null>({
      query: PROJECT_BY_SLUG_QUERY,
      params: { slug },
      tags: [`project:${slug}`],
    });
  } catch {
    // fallback
  }

  const fallback = getProject(slug);
  const project = sanityProject || fallback;

  if (!project) notFound();

  const data = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    creator: { "@type": "Organization", name: "Careomat" },
    url: `https://www.careomat.co.uk/work/${slug}`,
  };

  return (
    <>
      <JsonLd data={data} />
      <Breadcrumbs items={[{ label: "Work", href: "/work" }, { label: project.title }]} />
      <article>
        <header className="border-y">
          <div className="page-shell grid gap-10 py-16 lg:grid-cols-[1fr_.35fr]">
            <div className="flex flex-col gap-6">
              {(project.sector || project.service) && (
                <p className="eyebrow">
                  {[project.sector, project.service].filter(Boolean).join(" / ")}
                </p>
              )}
              <h1 className="max-w-4xl text-balance text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                {project.title}
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{project.summary}</p>
            </div>
            {(project.year || project.outcome) && (
              <dl className="grid grid-cols-2 gap-6 border-t pt-6 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8">
                {project.year && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">Year</dt>
                    <dd className="mt-2 font-semibold">{project.year}</dd>
                  </div>
                )}
                {project.outcome && (
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                      Headline outcome
                    </dt>
                    <dd className="mt-2 font-semibold text-primary">{project.outcome}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </header>

        {project.challenge && (
          <div className="page-shell grid gap-14 py-20 lg:grid-cols-[.4fr_.6fr]">
            <h2 className="text-2xl font-semibold">The challenge</h2>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">{project.challenge}</p>
          </div>
        )}

        {project.approach && project.approach.length > 0 && (
          <section className="bg-muted">
            <div className="page-shell grid gap-14 py-20 lg:grid-cols-[.4fr_.6fr]">
              <h2 className="text-2xl font-semibold">Our approach</h2>
              <ol className="flex flex-col gap-8">
                {project.approach.map((item, index) => (
                  <li key={item} className="flex gap-5 border-b pb-7">
                    <span className="font-mono text-sm text-primary">0{index + 1}</span>
                    <p className="leading-7">{item}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}

        {project.results && project.results.length > 0 && (
          <section className="page-shell grid gap-14 py-20 lg:grid-cols-[.4fr_.6fr]">
            <h2 className="text-2xl font-semibold">What changed</h2>
            <ul className="flex flex-col gap-5">
              {project.results.map((result) => (
                <li key={result} className="flex gap-4 rounded-lg border p-5">
                  <Check className="text-primary h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="font-medium">{result}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
      <CTA />
    </>
  );
}
