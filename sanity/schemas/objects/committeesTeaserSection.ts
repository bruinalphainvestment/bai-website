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
    defineField({
      name: 'ctaLabel',
      title: 'Card CTA Label',
      type: 'string',
      description:
        'CTA text shown on each committee card before the arrow icon.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'Committees Teaser', subtitle: title ?? '' };
    },
  },
});
