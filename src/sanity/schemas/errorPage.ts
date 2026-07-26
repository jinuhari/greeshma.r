import { defineType, defineField } from "sanity";

export const errorPage = defineType({
  name: "errorPage",
  title: "Error Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "notFoundEyebrow",
      title: "404 Eyebrow",
      type: "string",
      initialValue: "Not found",
    }),
    defineField({
      name: "notFoundHeading",
      title: "404 Heading",
      type: "string",
      initialValue: "404",
    }),
    defineField({
      name: "notFoundMessage",
      title: "404 Message",
      type: "string",
      initialValue: "This page has quietly stepped out of the exhibition.",
    }),
    defineField({
      name: "notFoundCta",
      title: "404 CTA Text",
      type: "string",
      initialValue: "Return to the gallery",
    }),
    defineField({
      name: "errorEyebrow",
      title: "Error Eyebrow",
      type: "string",
      initialValue: "Something interrupted the exhibit",
    }),
    defineField({
      name: "errorHeading",
      title: "Error Heading",
      type: "string",
      initialValue: "Please try again",
    }),
    defineField({
      name: "errorCta",
      title: "Error CTA Text",
      type: "string",
      initialValue: "Reload",
    }),
  ],
});
