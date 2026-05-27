import { defineArrayMember, defineField, defineType } from 'sanity';

export const joinPage = defineType({
  name: 'joinPage',
  title: 'Join Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'timeline', title: 'Timeline & Form' },
    { name: 'faqs', title: 'FAQs & Eligibility' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      group: 'content',
      initialValue: 'Join Page',
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
      name: 'applicationProcessHeading',
      title: 'Application Process Heading',
      type: 'string',
      group: 'timeline',
    }),
    defineField({
      name: 'applicationSteps',
      title: 'Application Process Steps',
      type: 'array',
      group: 'timeline',
      validation: (rule) => rule.max(8),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'applicationStep',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label' },
            prepare({ title }) {
              return { title: title ?? 'Application Step' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'timelineHeading',
      title: 'Timeline Heading',
      type: 'string',
      group: 'timeline',
    }),
    defineField({
      name: 'timeline',
      title: 'Recruitment Timeline',
      type: 'array',
      group: 'timeline',
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
            select: { title: 'title', stepNumber: 'stepNumber', body: 'body' },
            prepare({ title, stepNumber, body }) {
              return {
                title: title ?? 'Timeline Step',
                subtitle:
                  typeof stepNumber === 'number'
                    ? `Step ${stepNumber}${body ? ` — ${String(body).slice(0, 60)}` : ''}`
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
      group: 'timeline',
      options: { collapsible: true, collapsed: false },
      description: 'External application form (Tally embed/link).',
      fields: [
        defineField({
          name: 'heading',
          title: 'Heading',
          type: 'string',
          description: 'Heading displayed above the form embed.',
        }),
        defineField({
          name: 'body',
          title: 'Body',
          type: 'text',
          rows: 3,
          description: 'Introductory text above the form.',
        }),
        defineField({
          name: 'formUrl',
          title: 'Form URL',
          type: 'string',
          description:
            'External application URL. Leave blank while applications are closed; when set, use a full http(s) URL.',
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              try {
                const parsed = new URL(value);
                return parsed.protocol === 'http:' || parsed.protocol === 'https:'
                  ? true
                  : 'Use a full http(s) URL.';
              } catch {
                return 'Use a full http(s) URL or leave blank while applications are closed.';
              }
            }),
        }),
        defineField({
          name: 'linkLabel',
          title: 'Link Label',
          type: 'string',
          description:
            'Visible label for the outbound application link when Form URL is set.',
        }),
      ],
    }),
    defineField({
      name: 'faqHeading',
      title: 'FAQ Heading',
      type: 'string',
      group: 'faqs',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'faqs',
      description: 'Inline FAQs on /join.',
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
            prepare({ title, subtitle }) {
              return {
                title: title ?? 'FAQ',
                subtitle: subtitle ? String(subtitle).slice(0, 80) : undefined,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'contactHeading',
      title: 'Contact Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'contactLinks',
      title: 'Contact Link Display Copy',
      type: 'object',
      group: 'content',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'emailLabel', title: 'Email Label', type: 'string' }),
        defineField({
          name: 'emailFallbackLabel',
          title: 'Email Fallback Label',
          type: 'string',
          description: 'Shown when no club email is configured.',
        }),
        defineField({
          name: 'instagramLabel',
          title: 'Instagram Label',
          type: 'string',
        }),
        defineField({
          name: 'instagramDisplayText',
          title: 'Instagram Display Text',
          type: 'string',
        }),
        defineField({ name: 'linkedinLabel', title: 'LinkedIn Label', type: 'string' }),
        defineField({
          name: 'linkedinDisplayText',
          title: 'LinkedIn Display Text',
          type: 'string',
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
      return { title: title ?? 'Join Page', subtitle: 'Singleton' };
    },
  },
});
