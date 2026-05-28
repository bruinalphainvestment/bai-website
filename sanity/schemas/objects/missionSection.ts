import { defineField, defineType } from 'sanity';

export const missionSection = defineType({
  name: 'missionSection',
  title: 'Mission Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'groupPhoto',
      title: 'Group Photo',
      type: 'image',
      description:
        'Optional vertical group photo rendered to the right of the mission statement on large screens and stacked below it on small screens.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'Short accessible description of the group photo.',
          validation: (rule) => rule.required().warning(),
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'Mission', subtitle: title ?? '' };
    },
  },
});
