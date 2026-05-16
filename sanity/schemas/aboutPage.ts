import { defineArrayMember, defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
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
      initialValue: 'About Page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      group: 'content',
    }),
    defineField({
      name: 'mission',
      title: 'Mission',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 6 }),
      ],
    }),
    defineField({
      name: 'history',
      title: 'History',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 8 }),
      ],
    }),
    defineField({
      name: 'signatureTrip',
      title: 'Signature Trip',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: false },
      description: 'Signature trip / event teaser. Toggle "visible" to surface on page.',
      fields: [
        defineField({ name: 'headline', title: 'Headline', type: 'string' }),
        defineField({ name: 'status', title: 'Status', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 4 }),
        defineField({
          name: 'visible',
          title: 'Visible',
          type: 'boolean',
          initialValue: false,
        }),
      ],
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      group: 'content',
      description: 'Per Metis §1.15: max 7 core values.',
      validation: (rule) => rule.max(7),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'value',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'body' },
          },
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Generic Sections',
      type: 'array',
      group: 'content',
      description: 'Additional generic heading/body sections beyond the named ones above.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 6,
            }),
          ],
          preview: {
            select: { title: 'heading', subtitle: 'body' },
          },
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
      return { title: title ?? 'About Page', subtitle: 'Singleton' };
    },
  },
});
