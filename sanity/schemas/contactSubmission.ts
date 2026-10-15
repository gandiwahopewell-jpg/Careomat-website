import { defineField, defineType } from "sanity";

export const contactSubmissionSchema = defineType({
  name: "contactSubmission",
  title: "Contact Submission",
  type: "document",
  // Submissions come via /api/contact — not created manually in the Studio.
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "organisation",
      title: "Organisation",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "enquiry",
      title: "How can we help?",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "budget",
      title: "Indicative budget",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "message",
      title: "What are you trying to change?",
      type: "text",
      readOnly: true,
    }),
    defineField({
      name: "privacyAgreed",
      title: "Privacy consent given",
      type: "boolean",
      readOnly: true,
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Reviewed", value: "reviewed" },
          { title: "Replied", value: "replied" },
          { title: "Archived", value: "archived" },
        ],
        layout: "radio",
      },
      initialValue: "new",
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "name",
      organisation: "organisation",
      enquiry: "enquiry",
      status: "status",
      submittedAt: "submittedAt",
    },
    prepare({ name, organisation, enquiry, status, submittedAt }) {
      const date = submittedAt
        ? new Intl.DateTimeFormat("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }).format(new Date(submittedAt))
        : "Unknown date";

      const statusEmoji: Record<string, string> = {
        new: "🆕",
        reviewed: "👀",
        replied: "✅",
        archived: "📁",
      };

      return {
        title: `${name ?? "Unknown"} — ${organisation ?? ""}`,
        subtitle: `${statusEmoji[status] ?? ""} ${date} · ${enquiry ?? ""}`,
      };
    },
  },
});
