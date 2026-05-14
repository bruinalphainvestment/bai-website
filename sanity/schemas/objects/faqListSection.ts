import { defineArrayMember, defineField, defineType } from 'sanity';

export const faqListSection = defineType({
  name: 'faqListSection',
  title: 'FAQ List Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'faq' }],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'FAQ List', subtitle: title ?? '' };
    },
  },
});
