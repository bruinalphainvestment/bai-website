import { defineArrayMember, defineField, defineType } from 'sanity';

export const statsRowSection = defineType({
  name: 'statsRowSection',
  title: 'Stats Row Section',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'statItem',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description:
                'Use a string so we can display "100%", "Est. 2026", "12+", etc.',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'isYear',
              title: 'Is Year',
              type: 'boolean',
              initialValue: false,
              description:
                'When true, the value renders with the "Est." treatment for founding year stats.',
            }),
          ],
          preview: {
            select: { value: 'value', label: 'label' },
            prepare({ value, label }) {
              return { title: value ?? 'Stat', subtitle: label ?? '' };
            },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Stats Row' };
    },
  },
});
