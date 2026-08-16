import { defineType, defineField } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      initialValue: "Design practice 2013 - present",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue:
        "Product interfaces shaped with an illustrator's eye and a research-led process.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "string",
      initialValue: "View selected work",
    }),
    defineField({
      name: "ctaHref",
      title: "CTA Button Href",
      type: "string",
      initialValue: "#work",
    }),
    defineField({
      name: "resumeUrl",
      title: "Resume URL",
      type: "url",
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "value", title: "Value", type: "string" },
            { name: "label", title: "Label", type: "string" },
          ],
          preview: {
            select: { title: "value", subtitle: "label" },
          },
        },
      ],
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
    }),
    defineField({
      name: "portraitImage",
      title: "Hero Image",
      type: "image",
    }),
  ],
});
