import Link from "next/link";
import { ArrowRight, Check, CircleCheck, Gauge, Layers3 } from "lucide-react";
import { ArticleCard, ProjectCard, SectionHeading } from "@/components/content";
import { CTA } from "@/components/site-shell";
import { articles as fallbackArticles, projects as fallbackProjects, services } from "@/lib/content";
import { sanityFetch } from "@/sanity/lib/client";
import { POSTS_QUERY, COMPLETED_PROJECTS_QUERY, type SanityPost, type SanityProject } from "@/sanity/lib/queries";

export const revalidate = 60;

export default async function HomePage() {
  let sanityPosts: SanityPost[] = [];
  let sanityProjects: SanityProject[] = [];

  try {
    const [posts, projects] = await Promise.all([
      sanityFetch<SanityPost[]>({ query: POSTS_QUERY, tags: ["post"] }).catch(() => []),
      sanityFetch<SanityProject[]>({ query: COMPLETED_PROJECTS_QUERY, tags: ["project"] }).catch(() => []),
    ]);
    sanityPosts = posts || [];
    sanityProjects = projects || [];
  } catch (err) {
    console.error("Error loading home page content:", err);
  }

  const postsToRender = sanityPosts.length > 0 ? sanityPosts.slice(0, 3) : fallbackArticles.slice(0, 3);
  const projectsToRender = sanityProjects.length > 0 ? sanityProjects.slice(0, 3) : fallbackProjects.slice(0, 3);

  return (
    <>
      <section className="border-b">
        <div className="page-shell grid gap-12 py-20 md:py-28 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
          <div className="flex flex-col gap-7">
            <p className="eyebrow">UK software consultancy</p>
            <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.055em] md:text-7xl">
              Software decisions that stand up to delivery.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Careomat helps organisations understand the right problem, build dependable custom software and modernise important services without unnecessary risk.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Discuss a project <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center rounded-md border px-5 py-3 font-semibold hover:bg-muted"
              >
                See our work
              </Link>
            </div>
          </div>
          <div className="border-l-2 border-accent pl-6">
            <p className="mb-4 text-sm font-semibold">A sound starting point</p>
            <p className="leading-7 text-muted-foreground">
              We do not begin with a preferred technology or a list of features. We begin with the service, the evidence and the decision your organisation needs to make.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="page-shell grid gap-12 py-20 lg:grid-cols-[.7fr_1.3fr]">
          <SectionHeading
            eyebrow="Capabilities"
            title="The judgement to shape it. The engineering to deliver it."
            body="One accountable team from early uncertainty through to working software and measurable improvement."
          />
          <div className="grid sm:grid-cols-2">
            {services.map((service, index) => (
              <article key={service.title} className="flex flex-col gap-5 border-t p-6 sm:odd:border-r">
                <span className="font-mono text-xs text-primary">0{index + 1}</span>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">{service.description}</p>
                <Link href="/services" className="mt-auto inline-flex items-center gap-2 text-sm font-semibold hover:text-primary">
                  Explore capability <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted">
        <div className="page-shell py-20">
          <SectionHeading
            eyebrow="How we work"
            title="Reduce uncertainty before increasing commitment."
            body="Responsible delivery is not slower. It prevents teams from moving quickly in the wrong direction."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3">
            {[
              [Gauge, "Frame the decision", "Agree outcomes, constraints and the evidence needed to commit."],
              [Layers3, "Deliver in useful slices", "Put working capability in front of users and operations early."],
              [CircleCheck, "Prove the improvement", "Measure service outcomes, quality and whole-life cost—not output alone."],
            ].map(([Icon, title, body]) => {
              const I = Icon as typeof Gauge;
              return (
                <article key={title as string} className="flex flex-col gap-5 bg-background p-7">
                  <I className="text-primary h-6 w-6" aria-hidden="true" />
                  <h3 className="text-lg font-semibold">{title as string}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{body as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {projectsToRender.length > 0 && (
        <section>
          <div className="page-shell py-20">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
              <SectionHeading eyebrow="Selected work" title="Evidence from real delivery problems." />
              <Link href="/work" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                View all work <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {projectsToRender.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-secondary text-secondary-foreground">
        <div className="page-shell grid gap-12 py-20 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <p className="eyebrow text-accent">Procurement-ready delivery</p>
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              A credible tender answer starts with credible service capability.
            </h2>
            <p className="leading-7 text-secondary-foreground/70">
              Tendering is not a separate service. It is where our approach to discovery, engineering, risk and evidence is tested. We make delivery assumptions explicit and connect every commitment to a practical method.
            </p>
            <Link href="/resources/better-software-tender-briefs" className="inline-flex items-center gap-2 font-semibold hover:text-accent">
              Read our procurement guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <ul className="flex flex-col gap-4">
            {[
              "Clear scope boundaries and assumptions",
              "Relevant delivery evidence, not generic claims",
              "Transparent risk, governance and quality measures",
              "Accessible, secure and maintainable by design",
            ].map((item) => (
              <li key={item} className="flex gap-3 border-b border-secondary-foreground/15 pb-4">
                <Check className="text-accent h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="page-shell py-20">
          <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="Resources"
              title="Practical thinking for people responsible for software."
              body="Guides for better procurement, technical decisions and sustainable delivery."
            />
            <Link href="/resources" className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
              View all resources <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {postsToRender.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
