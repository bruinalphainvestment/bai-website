import { defineField, defineType } from 'sanity';

export const spacerSection = defineType({
  name: 'spacerSection',
  title: 'Spacer Section',
  type: 'object',
  fields: [
    defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
          { title: 'Section', value: 'section' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { size: 'size' },
    prepare({ size }) {
      return { title: 'Spacer', subtitle: size ?? '' };
    },
  },
});
