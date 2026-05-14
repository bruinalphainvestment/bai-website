import { defineField, defineType } from 'sanity';

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
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
      name: 'location',
      title: 'Location',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
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
          { title: 'Fair', value: 'fair' },
        ],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'external_url',
      title: 'External URL',
      type: 'url',
      description:
        'Optional. Use for CME, IMC Prosperity, or other external event pages.',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  orderings: [
    {
      title: 'Date (newest first)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Date (oldest first)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'type', date: 'date' },
    prepare({ title, subtitle, date }) {
      const when =
        typeof date === 'string' ? new Date(date).toLocaleDateString() : '';
      return {
        title: title ?? 'Event',
        subtitle: [subtitle, when].filter(Boolean).join(' • '),
      };
    },
  },
});
