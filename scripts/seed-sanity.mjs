import { createClient } from "next-sanity";
import fs from "node:fs";

if (fs.existsSync(".env")) {
  const content = fs.readFileSync(".env", "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "cvzj6xvr";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_TOKEN;

if (!token) {
  console.error("❌ SANITY_TOKEN is required in .env to seed data into Sanity.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

async function seed() {
  console.log(`🚀 Seeding Sanity dataset "${dataset}" in project "${projectId}"...`);

  // 1. Categories
  const categories = [
    {
      _id: "category-procurement",
      _type: "category",
      title: "Procurement",
      slug: { _type: "slug", current: "procurement" },
      description: "Guidance on software procurement, tenders and supplier assessment.",
      color: "text-blue-600",
    },
    {
      _id: "category-modernisation",
      _type: "category",
      title: "Modernisation",
      slug: { _type: "slug", current: "modernisation" },
      description: "Strategies for safely modernising legacy software and architectures.",
      color: "text-emerald-600",
    },
    {
      _id: "category-delivery",
      _type: "category",
      title: "Delivery",
      slug: { _type: "slug", current: "delivery" },
      description: "Proven delivery methods, technical discovery and governance.",
      color: "text-purple-600",
    },
  ];

  for (const cat of categories) {
    await client.createOrReplace(cat);
    console.log(`✅ Category seeded: ${cat.title}`);
  }

  // 2. Author
  const author = {
    _id: "author-careomat-team",
    _type: "author",
    name: "Careomat Engineering",
    slug: { _type: "slug", current: "careomat-engineering" },
    bio: "Senior technical and product practitioners helping UK organisations deliver dependable software.",
  };
  await client.createOrReplace(author);
  console.log(`✅ Author seeded: ${author.name}`);

  // 3. Posts with STL Table Block
  const stlComparisonTable = `[header]
| Decision Factor | Big-Bang Rewrite | Staged Modernisation | Recommended Evidence |
[body]
| Business Risk | High (all-or-nothing cutover) | Low (incremental value release) | Service error rate & latency |
| Delivery Timeline | 18–36 months before first use | 6–12 weeks to first slice | Deployment frequency |
| Operational Continuity | Significant downtime risk | Zero planned operational downtime | Rollback & canary logs |
| Architecture Control | Monolithic lock-in risk | Modular bounded contexts | API contract tests |
[footer]
| Summary | Discouraged for core services | Recommended delivery approach | Whole-life cost model |`;

  const posts = [
    {
      _id: "post-better-software-tender-briefs",
      _type: "post",
      title: "How to write a software tender brief that gets better answers",
      slug: { _type: "slug", current: "better-software-tender-briefs" },
      excerpt: "A useful brief creates room for supplier expertise while making outcomes, constraints and evaluation evidence unambiguous.",
      category: { _type: "reference", _ref: "category-procurement" },
      readingTime: 8,
      publishedAt: "2026-06-18T10:00:00Z",
      authors: [
        {
          _key: "author-1",
          _type: "articleAuthor",
          author: { _type: "reference", _ref: "author-careomat-team" },
          articleRole: "lead_author",
        },
      ],
      seo: {
        _type: "seo",
        metaTitle: "Writing Better Software Tender Briefs | Careomat",
        metaDescription: "Practical guide to software procurement briefs that evaluate evidence, not sales claims.",
      },
      body: [
        {
          _key: "b1",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c1",
              _type: "span",
              text: "The strongest software procurements do not prescribe every screen. They make the problem, operating context and test of success unusually clear. That gives capable suppliers enough structure to price risk while leaving room for better solutions.",
            },
          ],
        },
        {
          _key: "b2",
          _type: "block",
          style: "h2",
          children: [
            {
              _key: "c2",
              _type: "span",
              text: "Start with the service problem",
            },
          ],
        },
        {
          _key: "b3",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c3",
              _type: "span",
              text: "Describe who is affected, what they are trying to achieve and where the current service fails. A feature inventory cannot explain priority or help a supplier challenge low-value scope. Include evidence where it exists: handling time, failure demand, completion rates, support volumes and the cost of delay.",
            },
          ],
        },
        {
          _key: "b4",
          _type: "block",
          style: "h2",
          children: [
            {
              _key: "c4",
              _type: "span",
              text: "Separate constraints from assumptions",
            },
          ],
        },
        {
          _key: "b5",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c5",
              _type: "span",
              text: "Constraints are real boundaries such as regulation, fixed integration points or operational deadlines. Assumptions are beliefs that should remain open to testing. Labelling them correctly prevents accidental over-specification.",
            },
          ],
        },
        {
          _key: "b6",
          _type: "block",
          style: "h2",
          children: [
            {
              _key: "c6",
              _type: "span",
              text: "Evaluation matrix comparison",
            },
          ],
        },
        {
          _key: "table-1",
          _type: "stlTableBlock",
          caption: "Delivery Approach Evaluation Matrix (Rendered with STL Table)",
          stlString: stlComparisonTable,
        },
        {
          _key: "b7",
          _type: "block",
          style: "h2",
          children: [
            {
              _key: "c7",
              _type: "span",
              text: "Ask for evidence, not confidence",
            },
          ],
        },
        {
          _key: "b8",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c8",
              _type: "span",
              text: "Evaluation questions should reveal how a team makes decisions, manages uncertainty and measures quality. Ask bidders to explain a relevant trade-off, the evidence used and what they would do differently now.",
            },
          ],
        },
      ],
    },
    {
      _id: "post-modernise-without-big-bang-rewrite",
      _type: "post",
      title: "Modernise legacy software without betting on a big-bang rewrite",
      slug: { _type: "slug", current: "modernise-without-big-bang-rewrite" },
      excerpt: "A practical way to reduce legacy risk while continuing to deliver value to users and operations.",
      category: { _type: "reference", _ref: "category-modernisation" },
      readingTime: 7,
      publishedAt: "2026-05-07T10:00:00Z",
      authors: [
        {
          _key: "author-2",
          _type: "articleAuthor",
          author: { _type: "reference", _ref: "author-careomat-team" },
          articleRole: "lead_author",
        },
      ],
      seo: {
        _type: "seo",
        metaTitle: "Modernise Legacy Software Safely | Careomat",
        metaDescription: "How to de-risk legacy software modernisation through bounded contexts and incremental cutovers.",
      },
      body: [
        {
          _key: "b1",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c1",
              _type: "span",
              text: "Legacy is not defined by age. It is software that is difficult to change safely in response to organisational need. A rewrite can reproduce the same problems behind newer technology unless the migration is designed around risk and learning.",
            },
          ],
        },
        {
          _key: "b2",
          _type: "block",
          style: "h2",
          children: [
            {
              _key: "c2",
              _type: "span",
              text: "Measure the constraint first",
            },
          ],
        },
        {
          _key: "b3",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c3",
              _type: "span",
              text: "Identify what actually slows change: coupling, missing tests, unavailable knowledge, fragile data or governance. Each constraint suggests a different intervention.",
            },
          ],
        },
        {
          _key: "b4",
          _type: "block",
          style: "h2",
          children: [
            {
              _key: "c4",
              _type: "span",
              text: "Create a boundary you can move",
            },
          ],
        },
        {
          _key: "b5",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c5",
              _type: "span",
              text: "Stable interfaces let one capability change without coordinating the entire estate. Choose a boundary around a meaningful business capability, not simply a technical layer.",
            },
          ],
        },
      ],
    },
    {
      _id: "post-technical-discovery-decisions",
      _type: "post",
      title: "What a technical discovery should help you decide",
      slug: { _type: "slug", current: "technical-discovery-decisions" },
      excerpt: "Discovery is valuable when it reduces specific uncertainty—not when it produces a large deck of observations.",
      category: { _type: "reference", _ref: "category-delivery" },
      readingTime: 6,
      publishedAt: "2026-03-24T10:00:00Z",
      authors: [
        {
          _key: "author-3",
          _type: "articleAuthor",
          author: { _type: "reference", _ref: "author-careomat-team" },
          articleRole: "editor",
        },
      ],
      seo: {
        _type: "seo",
        metaTitle: "What a Technical Discovery Must Decide | Careomat",
        metaDescription: "Make high-certainty software investments through decision-focused discovery phases.",
      },
      body: [
        {
          _key: "b1",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c1",
              _type: "span",
              text: "A good discovery changes the quality of an investment decision. It should identify the smallest useful next commitment, expose material risks and make clear what still needs to be learned.",
            },
          ],
        },
        {
          _key: "b2",
          _type: "block",
          style: "h2",
          children: [
            {
              _key: "c2",
              _type: "span",
              text: "Name the decisions up front",
            },
          ],
        },
        {
          _key: "b3",
          _type: "block",
          style: "normal",
          children: [
            {
              _key: "c3",
              _type: "span",
              text: "Before research begins, write down which decisions leaders need to make. This stops discovery becoming open-ended analysis and gives every activity a purpose.",
            },
          ],
        },
      ],
    },
  ];

  for (const post of posts) {
    await client.createOrReplace(post);
    console.log(`✅ Post seeded: ${post.title}`);
  }

  console.log("🎉 Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
