import { defineField, defineType } from 'sanity';

export const teamPage = defineType({
  name: 'teamPage',
  title: 'Team Page',
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
      initialValue: 'Team Page',
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
      name: 'foundingClassHeading',
      title: 'Founding Class Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'membersHeading',
      title: 'Members Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'membersPlaceholder',
      title: 'Members Placeholder',
      type: 'string',
      group: 'content',
      description: 'Empty-state copy when there are no general members yet.',
    }),
    defineField({
      name: 'alumniHeading',
      title: 'Alumni Heading',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'alumniPlaceholder',
      title: 'Alumni Placeholder',
      type: 'string',
      group: 'content',
      description: 'Empty-state copy when there are no alumni yet.',
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
      return { title: title ?? 'Team Page', subtitle: 'Singleton' };
    },
  },
});
