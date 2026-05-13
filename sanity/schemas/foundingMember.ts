import { defineField, defineType } from 'sanity';

const COMMITTEE_OPTIONS = [
  { title: 'Wealth Management', value: 'wealth-management' },
  { title: 'Trading', value: 'trading' },
  { title: 'Accounting & Consulting', value: 'accounting-consulting' },
  { title: 'Investment Banking', value: 'investment-banking' },
  { title: 'Operations', value: 'operations' },
  { title: 'President', value: 'president' },
] as const;

export const foundingMember = defineType({
  name: 'foundingMember',
  title: 'Founding Member',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Display title, e.g. "President", "Trading Co-Director".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'committee',
      title: 'Committee',
      type: 'string',
      options: {
        list: [...COMMITTEE_OPTIONS],
        layout: 'dropdown',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gradYear',
      title: 'Graduation Year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(2024).max(2035),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'photoReleaseObtained',
      title: 'Photo Release Obtained',
      type: 'boolean',
      initialValue: false,
      validation: (rule) => rule.required(),
      description:
        'Required gate. Headshot will not render publicly unless this is true.',
    }),
    defineField({
      name: 'headshot',
      title: 'Headshot',
      type: 'image',
      options: { hotspot: true },
      description:
        'Optional. Will only display when Photo Release Obtained is true. Otherwise the monogram tile renders.',
    }),
    defineField({
      name: 'monogramOverride',
      title: 'Monogram Override',
      type: 'string',
      description:
        'Optional. 1–3 chars used in the gold-on-navy monogram tile when no headshot is approved. Defaults to first letters of first + last name.',
      validation: (rule) => rule.max(3),
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'role',
      media: 'headshot',
    },
    prepare({ firstName, lastName, role, media }) {
      const name = [firstName, lastName].filter(Boolean).join(' ');
      return { title: name || 'Founding Member', subtitle: role ?? '', media };
    },
  },
});
