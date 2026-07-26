import { defineType, defineField } from "sanity";

export const contactSection = defineType({
  name: "contactSection",
  title: "Contact Section",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Let's make something worth keeping.",
    }),
    defineField({
      name: "items",
      title: "Contact Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "label", title: "Label", type: "string" },
            { name: "value", title: "Value", type: "string" },
            { name: "url", title: "URL", type: "url" },
            { name: "type", title: "Type", type: "string", options: { list: ["email", "social", "resume"] } },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),
  ],
});
