import { defineField, defineType } from 'sanity';

import { COMMITTEE_OPTIONS } from './foundingMember';

export const MEMBER_POSITION_OPTIONS = [
  { title: 'Analyst', value: 'analyst' },
  { title: 'Associate', value: 'associate' },
] as const;

export const member = defineType({
  name: 'member',
  title: 'Member',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'photo', title: 'Photo & Release' },
    { name: 'social', title: 'Social Links' },
  ],
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      group: 'identity',
      description: 'Optional display title, e.g. "Analyst". Leave blank for general members.',
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      group: 'identity',
      options: {
        list: [...MEMBER_POSITION_OPTIONS],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'analyst',
      validation: (rule) => rule.required(),
      description:
        'Analysts are listed together on the team page. Associates are listed under their committee.',
    }),
    defineField({
      name: 'committee',
      title: 'Committee',
      type: 'string',
      group: 'identity',
      options: {
        list: COMMITTEE_OPTIONS.filter((option) => option.value !== 'president'),
        layout: 'dropdown',
      },
      hidden: ({ document }) => document?.position !== 'associate',
      validation: (rule) =>
        rule.custom((committee, context) => {
          const position = (context.document as { position?: string } | undefined)?.position;
          if (position === 'associate' && !committee) {
            return 'Associates need a committee.';
          }
          return true;
        }),
      description: 'Associates only.',
    }),
    defineField({
      name: 'gradYear',
      title: 'Graduation Year',
      type: 'number',
      group: 'identity',
      validation: (rule) => rule.integer().min(2024).max(2035),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      group: 'identity',
      rows: 4,
      description: 'Short biography paragraph.',
    }),
    defineField({
      name: 'photoReleaseObtained',
      title: 'Photo Release Obtained',
      type: 'boolean',
      group: 'photo',
      initialValue: false,
      validation: (rule) => rule.required(),
      description:
        'Required gate. Headshot will not render publicly unless this is true.',
    }),
    defineField({
      name: 'headshot',
      title: 'Headshot',
      type: 'image',
      group: 'photo',
      options: { hotspot: true },
      description:
        'Optional. Will only display when Photo Release Obtained is true. Otherwise the monogram tile renders.',
    }),
    defineField({
      name: 'monogramOverride',
      title: 'Monogram Override',
      type: 'string',
      group: 'photo',
      description:
        'Optional. 1–3 chars used in the gold-on-navy monogram tile when no headshot is approved. Defaults to first letters of first + last name.',
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'social',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: {
      firstName: 'firstName',
      lastName: 'lastName',
      role: 'role',
      position: 'position',
      committee: 'committee',
      media: 'headshot',
    },
    prepare({ firstName, lastName, role, position, committee, media }) {
      const name = [firstName, lastName].filter(Boolean).join(' ');
      const positionLabel =
        MEMBER_POSITION_OPTIONS.find((option) => option.value === position)?.title ?? 'Analyst';
      const subtitle = [
        role || positionLabel,
        position === 'associate' ? committee : null,
      ]
        .filter(Boolean)
        .join(' · ');
      return { title: name || 'Member', subtitle, media };
    },
  },
});
