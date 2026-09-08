export type Project = {
  slug: string
  title: string
  summary: string
  sector: string
  service: string
  year: string
  outcome: string
  challenge: string
  approach: string[]
  results: string[]
}

export type Article = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  intro: string
  sections: { heading: string; body: string[] }[]
}

export const services = [
  {
    title: "Product & technical consultancy",
    description: "Turn an ambiguous brief into a decision-ready plan. We clarify users, constraints, risks and measurable outcomes before expensive delivery begins.",
    outputs: ["Discovery and service mapping", "Technical strategy and architecture", "Delivery roadmap and cost model"],
  },
  {
    title: "Custom software development",
    description: "Design and build dependable web platforms, internal tools and digital services around the way your organisation actually works.",
    outputs: ["Accessible web applications", "Operational platforms and portals", "API-first product development"],
  },
  {
    title: "Modernisation & integration",
    description: "Reduce the cost and risk of legacy systems without forcing a disruptive rewrite. We modernise in controlled, observable stages.",
    outputs: ["Legacy application assessment", "Cloud and platform modernisation", "Systems and data integration"],
  },
  {
    title: "Delivery assurance",
    description: "Add senior technical judgement to an active programme, giving leaders clearer evidence, healthier delivery and fewer late surprises.",
    outputs: ["Architecture and code review", "Delivery health assessment", "Technical governance"],
  },
]

export const projects: Project[] = [
  {
    slug: "local-services-case-management",
    title: "A clearer case-management service for local teams",
    summary: "Replacing fragmented spreadsheets with a secure workflow that gives practitioners one reliable view of each case.",
    sector: "Public services",
    service: "Custom development",
    year: "2025",
    outcome: "42% less administrative handling",
    challenge: "Front-line teams were coordinating time-sensitive work across spreadsheets, inboxes and a legacy database. Information was duplicated, reporting took days, and managers lacked a current view of demand.",
    approach: ["Mapped the real service journey with practitioners rather than reproducing the existing screens.", "Defined a small, testable first release around intake, allocation and case notes.", "Introduced role-based access, audit history and operational reporting from the start."],
    results: ["42% reduction in routine administrative handling", "Same-day operational reporting instead of a monthly manual return", "A modular platform ready for additional service areas"],
  },
  {
    slug: "field-operations-platform",
    title: "Modernising a field operations platform without stopping work",
    summary: "A staged replacement strategy for a business-critical system used by distributed operational teams.",
    sector: "Infrastructure",
    service: "Modernisation",
    year: "2025",
    outcome: "Zero planned operational downtime",
    challenge: "A decade-old platform had become costly to change, but a big-bang replacement would have put daily operations at risk. The organisation needed a credible route forward and evidence for investment approval.",
    approach: ["Measured system boundaries, failure modes and actual usage before selecting technology.", "Separated high-change workflows behind stable APIs and migrated one operational region at a time.", "Created decision records and service measures so governance remained evidence-led."],
    results: ["Zero planned downtime across staged migration", "Deployment frequency increased from quarterly to fortnightly", "Clear whole-life cost model for the remaining roadmap"],
  },
  {
    slug: "membership-self-service",
    title: "Making membership self-service genuinely self-service",
    summary: "Reframing a portal around member needs, reducing support demand while improving completion rates.",
    sector: "Membership",
    service: "Product consultancy",
    year: "2024",
    outcome: "31% fewer avoidable support requests",
    challenge: "Members could technically complete common tasks online, but unclear journeys and disconnected systems meant many still contacted the service team.",
    approach: ["Combined support-call evidence with user interviews to identify the highest-cost failures.", "Prototyped and tested the core renew, update and payment journeys.", "Integrated existing CRM and payments rather than duplicating sources of truth."],
    results: ["31% reduction in avoidable support requests", "18 percentage-point improvement in task completion", "Reusable design patterns for future services"],
  },
]

export const articles: Article[] = [
  {
    slug: "better-software-tender-briefs",
    title: "How to write a software tender brief that gets better answers",
    excerpt: "A useful brief creates room for supplier expertise while making outcomes, constraints and evaluation evidence unambiguous.",
    category: "Procurement",
    date: "2026-06-18",
    readTime: "8 min read",
    intro: "The strongest software procurements do not prescribe every screen. They make the problem, operating context and test of success unusually clear. That gives capable suppliers enough structure to price risk while leaving room for better solutions.",
    sections: [
      { heading: "Start with the service problem", body: ["Describe who is affected, what they are trying to achieve and where the current service fails. A feature inventory cannot explain priority or help a supplier challenge low-value scope.", "Include evidence where it exists: handling time, failure demand, completion rates, support volumes and the cost of delay."] },
      { heading: "Separate constraints from assumptions", body: ["Constraints are real boundaries such as regulation, fixed integration points or operational deadlines. Assumptions are beliefs that should remain open to testing. Labelling them correctly prevents accidental over-specification."] },
      { heading: "Ask for evidence, not confidence", body: ["Evaluation questions should reveal how a team makes decisions, manages uncertainty and measures quality. Ask bidders to explain a relevant trade-off, the evidence used and what they would do differently now."] },
    ],
  },
  {
    slug: "modernise-without-big-bang-rewrite",
    title: "Modernise legacy software without betting on a big-bang rewrite",
    excerpt: "A practical way to reduce legacy risk while continuing to deliver value to users and operations.",
    category: "Modernisation",
    date: "2026-05-07",
    readTime: "7 min read",
    intro: "Legacy is not defined by age. It is software that is difficult to change safely in response to organisational need. A rewrite can reproduce the same problems behind newer technology unless the migration is designed around risk and learning.",
    sections: [
      { heading: "Measure the constraint first", body: ["Identify what actually slows change: coupling, missing tests, unavailable knowledge, fragile data or governance. Each constraint suggests a different intervention."] },
      { heading: "Create a boundary you can move", body: ["Stable interfaces let one capability change without coordinating the entire estate. Choose a boundary around a meaningful business capability, not simply a technical layer."] },
      { heading: "Fund migration through outcomes", body: ["Tie each migration stage to an operational improvement: reduced handling, faster release, lower failure demand or easier compliance. This keeps modernisation accountable and easier to govern."] },
    ],
  },
  {
    slug: "technical-discovery-decisions",
    title: "What a technical discovery should help you decide",
    excerpt: "Discovery is valuable when it reduces specific uncertainty—not when it produces a large deck of observations.",
    category: "Delivery",
    date: "2026-03-24",
    readTime: "6 min read",
    intro: "A good discovery changes the quality of an investment decision. It should identify the smallest useful next commitment, expose material risks and make clear what still needs to be learned.",
    sections: [
      { heading: "Name the decisions up front", body: ["Before research begins, write down which decisions leaders need to make. This stops discovery becoming open-ended analysis and gives every activity a purpose."] },
      { heading: "Test the riskiest belief", body: ["Teams often test what is easiest to prototype. Instead, identify the assumption that would invalidate the approach—data quality, adoption, integration or operational capacity—and test that first."] },
      { heading: "Leave a usable evidence trail", body: ["Record decisions, options and evidence in forms the delivery team can maintain. A concise service map, risk register and decision log are usually more valuable than a presentation frozen in time."] },
    ],
  },
]

export const getProject = (slug: string) => projects.find((project) => project.slug === slug)
export const getArticle = (slug: string) => articles.find((article) => article.slug === slug)
