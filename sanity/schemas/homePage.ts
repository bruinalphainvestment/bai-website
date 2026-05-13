import { defineArrayMember, defineField, defineType } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Home Page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
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
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return { title: title ?? 'Home Page', subtitle: 'Singleton' };
    },
  },
});
