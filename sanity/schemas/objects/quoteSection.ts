import { defineField, defineType } from 'sanity';

export const quoteSection = defineType({
  name: 'quoteSection',
  title: 'Quote Section',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'attribution_name',
      title: 'Attribution — Name',
      type: 'string',
    }),
    defineField({
      name: 'attribution_role',
      title: 'Attribution — Role',
      type: 'string',
    }),
  ],
  preview: {
    select: { quote: 'quote', name: 'attribution_name' },
    prepare({ quote, name }) {
      const snippet =
        typeof quote === 'string'
          ? quote.slice(0, 64) + (quote.length > 64 ? '…' : '')
          : '';
      return {
        title: 'Quote',
        subtitle: [name, snippet].filter(Boolean).join(' — '),
      };
    },
  },
});
