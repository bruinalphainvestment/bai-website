import { defineField, defineType } from 'sanity';

export const richTextSection = defineType({
  name: 'richTextSection',
  title: 'Rich Text Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'twoColumn',
      title: 'Two-Column Layout',
      type: 'boolean',
      initialValue: false,
      description: 'Render body in a two-column layout on wide viewports.',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: 'Rich Text', subtitle: title ?? '' };
    },
  },
});
