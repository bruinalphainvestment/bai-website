import { defineField, defineType } from 'sanity';

export const pageHero = defineType({
  name: 'pageHero',
  title: 'Page Hero',
  type: 'object',
  options: { collapsible: true, collapsed: false },
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
});
