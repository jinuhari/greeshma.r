import { defineType, defineField } from "sanity";

export const marqueeSection = defineType({
  name: "marqueeSection",
  title: "Marquee Section",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "items",
      title: "Marquee Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [{ name: "text", title: "Text", type: "string" }],
          preview: { select: { title: "text" } },
        },
      ],
    }),
  ],
});
