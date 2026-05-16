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
      name: 'endDate',
      title: 'End Date',
      type: 'datetime',
      description: 'Optional. Set for multi-hour or multi-day events.',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Venue name or address.',
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
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'TBD', value: 'tbd' },
          { title: 'Scheduled', value: 'scheduled' },
          { title: 'Past', value: 'past' },
        ],
        layout: 'radio',
      },
      initialValue: 'tbd',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description:
        'Optional. Use for CME, IMC Prosperity, or other external event pages.',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'committee',
      title: 'Committee',
      type: 'reference',
      to: [{ type: 'committee' }],
      options: { disableNew: true },
      description:
        'Optional. Link this event to a committee (e.g. Quant Bootcamp social).',
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
    select: { title: 'name', subtitle: 'type', date: 'date', location: 'location' },
    prepare({ title, subtitle, date, location }) {
      const when =
        typeof date === 'string' ? new Date(date).toLocaleDateString() : '';
      return {
        title: title ?? 'Event',
        subtitle: [subtitle, when, location].filter(Boolean).join(' • '),
      };
    },
  },
});
