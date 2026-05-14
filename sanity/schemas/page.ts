import { defineArrayMember, defineField, defineType } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'seo_title',
      title: 'SEO Title (override)',
      type: 'string',
      description:
        'Optional. When blank, the page title is used as the SEO title.',
    }),
    defineField({
      name: 'seo_description',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(320),
      description:
        'Meta description used for search results and social embeds. Aim for 140–160 chars.',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'richTextSection' }),
        defineArrayMember({ type: 'imageCalloutSection' }),
        defineArrayMember({ type: 'numberedListSection' }),
        defineArrayMember({ type: 'statsRowSection' }),
        defineArrayMember({ type: 'quoteSection' }),
        defineArrayMember({ type: 'faqListSection' }),
        defineArrayMember({ type: 'projectGridSection' }),
        defineArrayMember({ type: 'teamGridSection' }),
        defineArrayMember({ type: 'marqueeSection' }),
        defineArrayMember({ type: 'gallerySection' }),
        defineArrayMember({ type: 'spacerSection' }),
        defineArrayMember({ type: 'committeesTeaserSection' }),
        defineArrayMember({ type: 'ctaSection' }),
      ],
      description:
        'Compose the page from polymorphic section blocks. Order is rendered top-to-bottom.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return {
        title: title ?? 'Page',
        subtitle: subtitle ? `/${subtitle}` : '',
      };
    },
  },
});
