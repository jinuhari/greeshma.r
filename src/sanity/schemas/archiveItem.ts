import { defineType, defineField } from "sanity";

export const archiveItem = defineType({
  name: "archiveItem",
  title: "Archive Item",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "medium",
      title: "Medium",
      type: "string",
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          { title: "Portrait (3:4)", value: "aspect-[3/4]" },
          { title: "Square (1:1)", value: "aspect-[1/1]" },
        ],
      },
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
    }),
    defineField({
      name: "video",
      title: "Video",
      description: "Optional video shown in place of the image.",
      type: "file",
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
    select: { title: "label", subtitle: "category", media: "image" },
  },
});
