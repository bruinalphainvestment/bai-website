import { defineArrayMember, defineField, defineType } from 'sanity';

export const trainingPage = defineType({
  name: 'trainingPage',
  title: 'Training Page',
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
      initialValue: 'Training Page',
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
      name: 'curriculum',
      title: 'Curriculum',
      type: 'array',
      group: 'content',
      description: 'Rotational program week-by-week curriculum entries.',
      validation: (rule) => rule.max(20),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'curriculumEntry',
          fields: [
            defineField({
              name: 'week',
              title: 'Week',
              type: 'string',
              description: 'e.g. "Wk 1-2"',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'topic',
              title: 'Topic',
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
            select: { title: 'topic', subtitle: 'week' },
          },
        }),
      ],
    }),
    defineField({
      name: 'programs',
      title: 'Programs',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.max(10),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'program',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
            defineField({ name: 'format', title: 'Format', type: 'string' }),
            defineField({
              name: 'duration',
              title: 'Duration',
              type: 'string',
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'format' },
          },
        }),
      ],
    }),
    defineField({
      name: 'signatureCertifications',
      title: 'Signature Certifications',
      type: 'array',
      group: 'content',
      validation: (rule) => rule.max(10),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'certification',
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
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Training Page', subtitle: 'Singleton' };
    },
  },
});
