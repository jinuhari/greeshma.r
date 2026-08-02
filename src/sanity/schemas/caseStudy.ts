import { defineType, defineField } from "sanity";

export const caseStudy = defineType({
  name: "caseStudy",
  title: "Case Study",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "number",
      title: "Display Number",
      type: "number",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "kicker",
      title: "Kicker",
      type: "string",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      description:
        "Use one or more categories to group this case study on the home page (for example UI/UX, Graphic Design, Visual Design, UX Research, Branding, Illustration, or Motion).",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "outcomes",
      title: "Outcomes",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "value", title: "Value", type: "string" },
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "tone",
      title: "Tone Color",
      type: "string",
      options: {
        list: [
          { title: "Terracotta", value: "terracotta" },
          { title: "Coral", value: "coral" },
          { title: "Forest", value: "forest" },
          { title: "Indigo", value: "indigo" },
        ],
      },
    }),
    defineField({
      name: "client",
      title: "Client",
      type: "string",
    }),
    defineField({
      name: "timeline",
      title: "Timeline",
      type: "string",
    }),
    defineField({
      name: "tools",
      title: "Tools",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "liveUrl",
      title: "Live URL",
      type: "url",
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number",
      hidden: true,
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "textSection",
          title: "Text Section",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "content", title: "Content", type: "text", rows: 5 },
          ],
          preview: { select: { title: "title" } },
        },
        {
          type: "object",
          name: "imageSection",
          title: "Image Section",
          fields: [
            { name: "image", title: "Image", type: "image" },
            { name: "caption", title: "Caption", type: "string" },
            { name: "fullBleed", title: "Full Bleed", type: "boolean", initialValue: false },
          ],
          preview: { select: { title: "caption" } },
        },
        {
          type: "object",
          name: "imageTextSection",
          title: "Image + Text Section",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "content", title: "Content", type: "text", rows: 4 },
            { name: "image", title: "Image", type: "image" },
            {
              name: "imagePosition",
              title: "Image Position",
              type: "string",
              options: { list: ["left", "right"], layout: "radio" },
              initialValue: "left",
            },
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Manual Order",
      name: "orderRank",
      by: [{ field: "orderRank", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "year", media: "coverImage" },
  },
});
