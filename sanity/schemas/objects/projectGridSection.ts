import { defineField, defineType } from 'sanity';

export const projectGridSection = defineType({
  name: 'projectGridSection',
  title: 'Project Grid Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'projectFilter',
      title: 'Project Filter — Committee Slug',
      type: 'string',
      description:
        'Optional. Enter the committee slug (e.g. "trading", "wealth-management") to filter projects.',
    }),
    defineField({
      name: 'statusFilter',
      title: 'Project Filter — Status',
      type: 'string',
      options: {
        list: [
          { title: 'Planning', value: 'planning' },
          { title: 'Active', value: 'active' },
          { title: 'Completed', value: 'completed' },
        ],
        layout: 'dropdown',
      },
      description: 'Optional. When set, only projects in this status render.',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      committee: 'projectFilter',
      status: 'statusFilter',
    },
    prepare({ title, committee, status }) {
      const filters = [committee, status].filter(Boolean).join(' • ');
      return {
        title: 'Project Grid',
        subtitle: [title, filters].filter(Boolean).join(' — '),
      };
    },
  },
});
