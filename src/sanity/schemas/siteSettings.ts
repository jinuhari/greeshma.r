import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      initialValue: "Greeshma R — Product Designer, Visual Designer & Illustrator",
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      initialValue: "Greeshma R",
    }),
    defineField({
      name: "ogTitle",
      title: "OG Title",
      type: "string",
    }),
    defineField({
      name: "ogDescription",
      title: "OG Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "ogImage",
      title: "OG Image",
      type: "image",
    }),
    defineField({
      name: "favicon",
      title: "Favicon",
      type: "image",
    }),
    defineField({
      name: "footerCopyright",
      title: "Footer Copyright",
      type: "string",
    }),
    defineField({
      name: "footerTagline",
      title: "Footer Tagline",
      type: "string",
    }),
  ],
});
