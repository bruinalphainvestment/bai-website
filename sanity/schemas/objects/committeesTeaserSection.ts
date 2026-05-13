import { defineField, defineType } from 'sanity';

export const committeesTeaserSection = defineType({
  name: 'committeesTeaserSection',
  title: 'Committees Teaser Section',
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
      return { title: 'Committees Teaser', subtitle: title ?? '' };
    },
  },
});
