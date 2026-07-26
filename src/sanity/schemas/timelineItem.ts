import { defineType, defineField } from "sanity";

export const timelineItem = defineType({
  name: "timelineItem",
  title: "Timeline Item",
  type: "document",
  fields: [
    defineField({
      name: "year",
      title: "Year",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "where",
      title: "Description / Where",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "orderRank",
      title: "Order",
      type: "number",
      hidden: true,
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
    select: { title: "title", subtitle: "year" },
  },
});
