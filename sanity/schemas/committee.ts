import { defineArrayMember, defineField, defineType } from 'sanity';

export const committee = defineType({
  name: 'committee',
  title: 'Committee',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'director',
      title: 'Director',
      type: 'reference',
      to: [{ type: 'foundingMember' }],
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'curriculum',
      title: 'Curriculum',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'Full curriculum outline (portable text). Rendered on the committee subpage.',
    }),
    defineField({
      name: 'signature_projects',
      title: 'Signature Projects',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'project' }],
        }),
      ],
      description: 'Projects affiliated with this committee.',
    }),
    defineField({
      name: 'comp_calendar',
      title: 'Competition Calendar',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'compCalendarEntry',
          fields: [
            defineField({
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'date',
              title: 'Date',
              type: 'datetime',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (rule) =>
                rule.uri({ scheme: ['http', 'https'] }),
            }),
            defineField({
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Recruitment', value: 'recruitment' },
                  { title: 'Competition', value: 'comp' },
                  { title: 'Social', value: 'social' },
                  { title: 'Speaker', value: 'speaker' },
                ],
                layout: 'dropdown',
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'type', date: 'date' },
            prepare({ title, subtitle, date }) {
              const when =
                typeof date === 'string'
                  ? new Date(date).toLocaleDateString()
                  : '';
              return {
                title: title ?? 'Entry',
                subtitle: [subtitle, when].filter(Boolean).join(' • '),
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'director_quote',
      title: 'Director Quote',
      type: 'text',
      rows: 3,
      description: 'Short pull-quote from the committee director.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order on Committees page (lower = earlier).',
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent Color',
      type: 'string',
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
