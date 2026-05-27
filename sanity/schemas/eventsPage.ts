import { defineField, defineType } from 'sanity';

export const eventsPage = defineType({
  name: 'eventsPage',
  title: 'Events Page',
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
      initialValue: 'Events Page',
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
      name: 'upcomingHeading',
      title: 'Upcoming Section Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'competitionsHeading',
      title: 'Competitions Section Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'externalCtaLabel',
      title: 'External Event CTA Label',
      type: 'string',
      group: 'content',
      description: 'Visible link label for events with an External URL.',
    }),
    defineField({
      name: 'upcomingEmptyState',
      title: 'Upcoming Empty-State Copy',
      type: 'string',
      group: 'content',
      description: 'Shown when there are no upcoming/ongoing events.',
    }),
    defineField({
      name: 'pastEmptyState',
      title: 'Past Empty-State Copy',
      type: 'string',
      group: 'content',
      description: 'Shown when there are no past events.',
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
      return { title: title ?? 'Events Page', subtitle: 'Singleton' };
    },
  },
});
