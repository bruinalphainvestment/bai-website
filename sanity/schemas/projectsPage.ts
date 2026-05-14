import { defineArrayMember, defineField, defineType } from 'sanity';

export const projectsPage = defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Projects Page',
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
      name: 'emptyState',
      title: 'Empty-State Copy',
      type: 'string',
      description:
        'Shown when there are no projects. Projects themselves are queried from the `project` document schema.',
    }),
    defineField({
      name: 'statusLegend',
      title: 'Status Legend',
      type: 'array',
      description:
        'Per plan D9: 3 entries (planning, active, completed) explaining the project-status indicator system.',
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
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Projects Page', subtitle: 'Singleton' };
    },
  },
});
