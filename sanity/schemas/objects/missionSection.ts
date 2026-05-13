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
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'Mission', subtitle: title ?? '' };
    },
  },
});
