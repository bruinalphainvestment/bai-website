import { defineField, defineType } from 'sanity';

export const teamPage = defineType({
  name: 'teamPage',
  title: 'Team Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Team Page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'ogImage',
          title: 'OG Image',
          type: 'image',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'subheading',
          title: 'Subheading',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'foundingClassHeading',
      title: 'Founding Class Heading',
      type: 'string',
      description: 'Per Metis §1.18: founding-class section heading.',
    }),
    defineField({
      name: 'membersHeading',
      title: 'Members Heading',
      type: 'string',
    }),
    defineField({
      name: 'membersPlaceholder',
      title: 'Members Placeholder',
      type: 'string',
      description:
        'Per plan D8: empty-state copy when there are no general members to display yet.',
    }),
    defineField({
      name: 'alumniHeading',
      title: 'Alumni Heading',
      type: 'string',
    }),
    defineField({
      name: 'alumniPlaceholder',
      title: 'Alumni Placeholder',
      type: 'string',
      description: 'Empty-state copy when there are no alumni to display yet.',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Team Page', subtitle: 'Singleton' };
    },
  },
});
