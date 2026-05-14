import { defineArrayMember, defineField, defineType } from 'sanity';

export const teamGridSection = defineType({
  name: 'teamGridSection',
  title: 'Team Grid Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'member_filter',
      title: 'Member Filter',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'foundingMember' }],
        }),
      ],
      description:
        'Empty = render all founding members. Otherwise the grid is limited to the chosen members.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'Team Grid', subtitle: title ?? '' };
    },
  },
});
