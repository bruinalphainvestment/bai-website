import { defineArrayMember, defineField, defineType } from 'sanity';

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Projects Page',
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
      initialValue: 'Projects Page',
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
      name: 'emptyState',
      title: 'Empty-State Copy',
      type: 'string',
      group: 'content',
      description:
        'Shown when there are no projects. Projects themselves are queried from the `project` document schema.',
    }),
    defineField({
      name: 'statusLegend',
      title: 'Status Legend',
      type: 'array',
      group: 'content',
      description:
        '3 entries (planning, active, completed) explaining the project-status indicator system.',
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statusLegendEntry',
          fields: [
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  { title: 'Planning', value: 'planning' },
                  { title: 'Active', value: 'active' },
                  { title: 'Completed', value: 'completed' },
                ],
                layout: 'radio',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'status', subtitle: 'description' },
          },
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
      return { title: title ?? 'Projects Page', subtitle: 'Singleton' };
    },
  },
});
