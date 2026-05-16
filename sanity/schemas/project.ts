import { defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
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
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'One-paragraph elevator pitch shown on Projects grid cards.',
    }),
    defineField({
      name: 'committee',
      title: 'Committee',
      type: 'reference',
      to: [{ type: 'committee' }],
      options: { disableNew: true },
      description:
        'Optional. Leave blank for club-wide projects not tied to a single committee.',
    }),
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
      initialValue: 'planning',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Searchable tags for categorizing the project.',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      status: 'status',
      committee: 'committee.name',
    },
    prepare({ title, status, committee }) {
      const subtitle = [committee, status].filter(Boolean).join(' • ');
      return { title: title ?? 'Project', subtitle };
    },
  },
});
