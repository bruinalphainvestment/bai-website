import { defineField, defineType } from 'sanity';

export const marqueeSection = defineType({
  name: 'marqueeSection',
  title: 'Marquee Section',
  type: 'object',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Marquee' };
    },
  },
});
