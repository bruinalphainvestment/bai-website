import { defineArrayMember, defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      group: 'content',
      initialValue: 'Home Page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'missionSection' }),
        defineArrayMember({ type: 'valuesSection' }),
        defineArrayMember({ type: 'committeesTeaserSection' }),
        defineArrayMember({ type: 'foundingTeamSection' }),
        defineArrayMember({ type: 'marqueeSection' }),
        defineArrayMember({ type: 'statsSection' }),
        defineArrayMember({ type: 'ctaSection' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo',
      group: 'seo',
      description:
        'Meta title, description, and Open Graph image for the homepage. Falls back to Site Settings defaults when blank.',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Home Page', subtitle: 'Singleton' };
    },
  },
});
