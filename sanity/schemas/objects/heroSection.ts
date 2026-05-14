import { defineField, defineType } from 'sanity';

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow / Kicker',
      type: 'string',
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary CTA URL',
      type: 'string',
      description:
        'Optional. Internal route (e.g. "/about") or external URL. When blank, home-hero uses the locked apply URL from Site Settings.',
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary CTA URL',
      type: 'string',
      description: 'Optional. Same rules as primary.',
    }),
    defineField({
      name: 'accentDark',
      title: 'Dark Accent Treatment',
      type: 'boolean',
      initialValue: true,
      description:
        'When true, the hero renders the deep-navy kinetic treatment. When false, the cream editorial treatment is used (recommended for content pages).',
    }),
  ],
  preview: {
    select: { title: 'headline', subtitle: 'eyebrow' },
    prepare({ title, subtitle }) {
      return { title: 'Hero', subtitle: title ?? subtitle ?? '(no headline)' };
    },
  },
});
