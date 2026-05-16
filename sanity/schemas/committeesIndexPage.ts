import { defineArrayMember, defineField, defineType } from 'sanity';

export const committeesIndexPage = defineType({
  name: 'committeesIndexPage',
  title: 'Committees Index Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      group: 'content',
      initialValue: 'Committees Index Page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      group: 'content',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      group: 'content',
      rows: 4,
    }),
    defineField({
      name: 'connectedByDesign',
      title: 'Connected by Design',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: false },
      description:
        'The "Connected by Design" callout — explains how the rotational program and cross-committee projects tie disciplines together.',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 4,
          description: 'Short lead/summary paragraph.',
        }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphs',
          type: 'array',
          description: 'Additional body paragraphs in order.',
          of: [defineArrayMember({ type: 'text' })],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return {
        title: title ?? 'Committees Index Page',
        subtitle: 'Singleton',
      };
    },
  },
});
