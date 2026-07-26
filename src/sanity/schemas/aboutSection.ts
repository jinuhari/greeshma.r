import { defineType, defineField } from "sanity";

export const aboutSection = defineType({
  name: "aboutSection",
  title: "About Section",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "I started as an artist — then everything else followed.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "imageCaption",
      title: "Image Caption",
      type: "string",
    }),
  ],
});
