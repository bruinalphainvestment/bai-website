import { defineArrayMember, defineField, defineType } from 'sanity';

export const valuesSection = defineType({
  name: 'valuesSection',
  title: 'Values Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'values',
      title: 'Values',
      type: 'array',
      description:
        'The first value is featured more prominently on the homepage; reorder intentionally.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'value',
          fields: [
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
              rows: 2,
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'Values', subtitle: title ?? '' };
    },
  },
});
