import { defineArrayMember, defineField, defineType } from 'sanity';

export const joinPage = defineType({
  name: 'joinPage',
  title: 'Join Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Join Page',
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
      name: 'timeline',
      title: 'Recruitment Timeline',
      type: 'array',
      description: 'Per Metis §1.12: 4-step recruitment timeline.',
      validation: (rule) => rule.max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'timelineStep',
          fields: [
            defineField({
              name: 'stepNumber',
              title: 'Step Number',
              type: 'number',
              validation: (rule) => rule.required().integer().min(1),
            }),
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
            select: { title: 'title', stepNumber: 'stepNumber' },
            prepare({ title, stepNumber }) {
              return {
                title: title ?? 'Timeline Step',
                subtitle:
                  typeof stepNumber === 'number'
                    ? `Step ${stepNumber}`
                    : undefined,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'applicationForm',
      title: 'Application Form',
      type: 'object',
      description: 'Per plan D20: external application form (Tally embed/link).',
      fields: [
        defineField({ name: 'heading', title: 'Heading', type: 'string' }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'formUrl',
          title: 'Form URL',
          type: 'string',
          description:
            'External application URL (e.g. Tally form). String not url type so placeholders like "#" are allowed during off-cycle.',
        }),
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description:
        'Per plan D11: inline FAQs on /join (separate from any shared FAQ document collection).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faq',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
          },
        }),
      ],
    }),
    defineField({
      name: 'eligibilityHeading',
      title: 'Eligibility Heading',
      type: 'string',
    }),
    defineField({
      name: 'eligibilityBullets',
      title: 'Eligibility Bullets',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Join Page', subtitle: 'Singleton' };
    },
  },
});
