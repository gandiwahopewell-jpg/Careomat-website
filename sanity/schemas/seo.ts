import { defineField, defineType } from "sanity";

export const seoSchema = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta Title",
      type: "string",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "shareImage",
      title: "Share Image",
      type: "image",
    }),
  ],
});
