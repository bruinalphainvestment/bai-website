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
      name: 'project_filter',
      title: 'Project Filter — Committee Slug',
      type: 'string',
      description:
        'Optional. When set, only projects linked to this committee slug are rendered.',
    }),
    defineField({
      name: 'status_filter',
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
      committee: 'project_filter',
      status: 'status_filter',
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
