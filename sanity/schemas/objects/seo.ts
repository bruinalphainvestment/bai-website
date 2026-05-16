import { defineField, defineType } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: 'string',
      validation: (rule) =>
        rule.max(65).warning('May be truncated in search results.'),
      description: 'Overrides page title in <title> + Open Graph if set.',
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning('May be truncated in search results.'),
      description: 'Falls back to siteSettings.defaultMetaDescription if blank.',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Falls back to siteSettings.defaultOgImage if blank.',
    }),
  ],
});
