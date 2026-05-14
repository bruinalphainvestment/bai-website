import { defineField, defineType } from 'sanity';

export const imageCalloutSection = defineType({
  name: 'imageCalloutSection',
  title: 'Image Callout Section',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'side',
      title: 'Side',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
          { title: 'Full Width', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { caption: 'caption', side: 'side', media: 'image' },
    prepare({ caption, side, media }) {
      return {
        title: 'Image Callout',
        subtitle: [side, caption].filter(Boolean).join(' • '),
        media,
      };
    },
  },
});
