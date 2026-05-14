import { defineArrayMember, defineField, defineType } from 'sanity';

export const numberedListSection = defineType({
  name: 'numberedListSection',
  title: 'Numbered List Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'numberedItem',
          fields: [
            defineField({
              name: 'number',
              title: 'Number',
              type: 'string',
              description: 'Display label, e.g. "01", "02".',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: { number: 'number', title: 'title' },
            prepare({ number, title }) {
              return {
                title: title ?? 'Item',
                subtitle: number ?? '',
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'Numbered List', subtitle: title ?? '' };
    },
  },
});
