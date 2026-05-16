import { defineArrayMember, defineField, defineType } from 'sanity';

export const committee = defineType({
  name: 'committee',
  title: 'Committee',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'leadership', title: 'Leadership' },
    { name: 'projects', title: 'Projects' },
    { name: 'display', title: 'Display & SEO' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'content',
      description: 'Short tagline shown on Committees teaser cards.',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'curriculum',
      title: 'Curriculum',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }],
      description:
        'Full curriculum outline (portable text). Rendered on the committee subpage.',
    }),
    defineField({
      name: 'learn',
      title: "What You'll Learn (bullets, max 4)",
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      validation: (rule) => rule.max(4),
      description: 'Bullet points displayed on the committee subpage.',
    }),
    defineField({
      name: 'differentiator',
      title: 'Differentiator Pitch',
      type: 'text',
      group: 'content',
      rows: 3,
      description: 'Short pitch explaining what sets this committee apart.',
    }),
    defineField({
      name: 'director',
      title: 'Director',
      type: 'reference',
      group: 'leadership',
      to: [{ type: 'foundingMember' }],
      options: { disableNew: true },
      description:
        'Optional. Pick a Founding Member already in the database (use Team Page → Founding Members to add new people).',
    }),
    defineField({
      name: 'directorPlaceholder',
      title: 'Director Placeholder',
      type: 'string',
      group: 'leadership',
      description:
        'Shown when no director is selected, e.g. "TBD — announcement coming soon".',
    }),
    defineField({
      name: 'directorQuote',
      title: 'Director Quote',
      type: 'text',
      group: 'leadership',
      rows: 3,
      description: 'Short pull-quote from the committee director.',
    }),
    defineField({
      name: 'signatureProjects',
      title: 'Signature Projects',
      type: 'array',
      group: 'projects',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
          options: { disableNew: true },
        }),
      ],
      description:
        'Projects affiliated with this committee. Add new projects under Projects Page → All Projects first.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'display',
      description: 'Display order on Committees page (lower = earlier).',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
      group: 'display',
      options: {
        list: [
          { title: 'Gold', value: 'gold' },
          { title: 'Navy', value: 'navy' },
        ],
        layout: 'radio',
      },
      initialValue: 'gold',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'redirectsFrom',
      title: 'Redirects From',
      type: 'array',
      group: 'display',
      of: [{ type: 'string' }],
      description: 'Old slugs that 301 to current slug.',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'tagline' },
  },
});
