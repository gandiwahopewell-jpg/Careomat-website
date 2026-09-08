import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";

export const projectSchema = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      validation: (r) => r.required(),
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "string",
      description: "e.g. Public services, Infrastructure, Membership",
    }),
    defineField({
      name: "service",
      title: "Service",
      type: "string",
      description:
        "e.g. Custom development, Modernisation, Product consultancy",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "outcome",
      title: "Headline Outcome",
      type: "string",
      description: "e.g. 42% less administrative handling",
    }),
    defineField({
      name: "challenge",
      title: "The Challenge",
      type: "text",
    }),
    defineField({
      name: "approach",
      title: "Our Approach",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "results",
      title: "What Changed / Results",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "isCompleted",
      title: "Completed Project",
      type: "boolean",
      description:
        "Whether this project is completed and should appear on the completed projects page",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "sector",
    },
  },
});
