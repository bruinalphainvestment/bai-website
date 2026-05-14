import { defineArrayMember, defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'About Page',
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
      name: 'mission',
      title: 'Mission',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 6 }),
      ],
    }),
    defineField({
      name: 'history',
      title: 'History',
      type: 'object',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({ name: 'body', title: 'Body', type: 'text', rows: 8 }),
      ],
    }),
    defineField({
      name: 'signatureTrip',
      title: 'Signature Trip',
      type: 'object',
      description:
        'Per plan D7: signature trip / event teaser. Toggle "visible" to surface on page.',
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
      description: 'Per Metis §1.15: 7 core values.',
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
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'About Page', subtitle: 'Singleton' };
    },
  },
});
