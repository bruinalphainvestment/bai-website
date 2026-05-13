import { defineField, defineType } from 'sanity';

export const foundingTeamSection = defineType({
  name: 'foundingTeamSection',
  title: 'Founding Team Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'Founding Team', subtitle: title ?? '' };
    },
  },
});
