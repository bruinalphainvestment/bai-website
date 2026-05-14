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
      description: 'One-paragraph elevator pitch for grid cards.',
    }),
    defineField({
      name: 'narrative',
      title: 'Narrative',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Long-form portable text shown on the project detail view.',
    }),
    defineField({
      name: 'committee',
      title: 'Committee',
      type: 'reference',
      to: [{ type: 'committee' }],
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
    }),
    defineField({
      name: 'hero_image',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      status: 'status',
      committee: 'committee.name',
      media: 'hero_image',
    },
    prepare({ title, status, committee, media }) {
      const subtitle = [committee, status].filter(Boolean).join(' • ');
      return { title: title ?? 'Project', subtitle, media };
    },
  },
});
