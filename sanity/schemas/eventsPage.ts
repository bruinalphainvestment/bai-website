import { defineField, defineType } from 'sanity';

export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Events Page',
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
      name: 'upcomingEmptyState',
      title: 'Upcoming Empty-State Copy',
      type: 'string',
      description:
        'Shown when there are no upcoming/ongoing events. Events themselves are queried from the `event` document schema.',
    }),
    defineField({
      name: 'pastEmptyState',
      title: 'Past Empty-State Copy',
      type: 'string',
      description: 'Shown when there are no past events.',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Events Page', subtitle: 'Singleton' };
    },
  },
});
