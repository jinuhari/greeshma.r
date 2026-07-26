import { defineType, defineField } from "sanity";

export const skillsSection = defineType({
  name: "skillsSection",
  title: "Skills Section",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Tools of the trade.",
    }),
    defineField({
      name: "groups",
      title: "Skill Groups",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "name", title: "Group Name", type: "string" },
            {
              name: "skills",
              title: "Skills",
              type: "array",
              of: [{ type: "string" }],
            },
          ],
          preview: {
            select: { title: "name" },
          },
        },
      ],
    }),
  ],
});
