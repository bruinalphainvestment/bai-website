import { defineField, defineType } from 'sanity';

const LOCKED_DISCLAIMER =
  'Bruin Alpha Investment is a registered student organization at UCLA. Content on this site is educational only and does not constitute investment advice. BAI is not a registered investment adviser, broker-dealer, or financial advisor. This organization acts independently of UCLA and does not represent the University.';

const LOCKED_MISSION = [
  {
    _type: 'block',
    _key: 'mission-1',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: 'mission-1-span',
        text: 'Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application. The club brings together students interested in asset and wealth management, financial analysis, sales & trading, prediction markets, and those engaged in active investing across equities, options, futures, and cryptocurrency markets. Beyond discussion, members actively participate in real trading environments, applying arbitrage strategies and other advanced techniques to live markets. The organization emphasizes practical execution, disciplined risk management, and a deep understanding of market structure. Through a collaborative and performance-driven community, Bruin Alpha Investment equips members with the technical skills, strategic thinking, and real experience needed to succeed in competitive finance careers.',
        marks: [],
      },
    ],
  },
];

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    // ---- Existing fields (snake_case ones marked Deprecated; kept for migration safety) ----
    defineField({
      name: 'ucla_compliant_name',
      title: 'UCLA-Compliant Club Name (Deprecated)',
      type: 'string',
      initialValue: 'Bruin Alpha Investment at UCLA',
      validation: (rule) => rule.required(),
      readOnly: true,
      description:
        'Locked: use "Bruin Alpha Investment at UCLA" — NEVER "UCLA Bruin Alpha Investment". Deprecated — use the camelCase field; will be removed after migration.',
    }),
    defineField({
      name: 'slogan',
      title: 'Club Slogan',
      type: 'string',
      initialValue: 'Have Passion, Believe in Legacy, Believe in BAI',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mission_statement',
      title: 'Mission Statement (Deprecated)',
      type: 'array',
      of: [{ type: 'block' }],
      readOnly: true,
      description:
        'UCLA-approved verbatim mission statement (portable text). Edits require leadership review for regulatory and brand compliance. Deprecated — use the camelCase field; will be removed after migration.',
      validation: (rule) => rule.required().min(1),
      initialValue: LOCKED_MISSION,
    }),
    defineField({
      name: 'disclaimer_text',
      title: 'Site-Wide Disclaimer (Deprecated)',
      type: 'text',
      rows: 5,
      initialValue: LOCKED_DISCLAIMER,
      validation: (rule) => rule.required(),
      readOnly: true,
      description:
        'LOCKED Metis-mandated copy. Do not edit without legal review. Deprecated — use the camelCase field; will be removed after migration.',
    }),
    defineField({
      name: 'applyUrl',
      title: 'Application URL (Tally)',
      type: 'url',
      initialValue: 'https://tally.so/r/placeholder',
      validation: (rule) =>
        rule.required().uri({ scheme: ['http', 'https'] }),
      description: 'Replace with real Tally form URL once created.',
    }),
    defineField({
      name: 'clubEmail',
      title: 'Club Email',
      type: 'string',
      initialValue: 'bruinalphainvestment26@gmail.com',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'slackInviteUrl',
      title: 'Slack Invite URL',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'domain_renewal_date',
      title: 'Domain Renewal Date (Deprecated)',
      type: 'date',
      readOnly: true,
      description:
        'Track renewal so handoffs flag it before lapse. Deprecated — use the camelCase field; will be removed after migration.',
    }),

    // ---- New fields (D1, D2, D5, D9, D10, D13, D14, D18 from plan) ----
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      initialValue: 'Bruin Alpha Investment',
    }),
    defineField({
      name: 'titleSuffix',
      title: 'Title Suffix',
      type: 'string',
      initialValue: ' — Bruin Alpha Investment at UCLA',
      description:
        'Appended to each page <title> tag. Per D2: default " — Bruin Alpha Investment at UCLA".',
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 3,
      description: 'Fallback <meta name="description"> when a page omits its own.',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OG Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Fallback Open Graph image when a page omits its own (per D3).',
    }),
    defineField({
      name: 'foundedYear',
      title: 'Founded Year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(2020).max(2030),
      description: 'Numeric founded year (used in copyright).',
    }),
    defineField({
      name: 'foundedTerm',
      title: 'Founded Term',
      type: 'string',
      description: 'Textual founded term (e.g. "Spring 2026").',
    }),
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      validation: (rule) => rule.required().min(1).max(8),
      of: [
        {
          type: 'object',
          name: 'navLink',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
          },
        },
      ],
    }),
    defineField({
      name: 'organizationDescription',
      title: 'Organization Description',
      type: 'text',
      description:
        'Used in <Organization> structured data for Google Knowledge Graph',
    }),
    defineField({
      name: 'sameAs',
      title: 'Same As (Structured Data sameAs[])',
      type: 'array',
      of: [{ type: 'url' }],
      description:
        'External profile URLs (Instagram, LinkedIn, etc.) emitted as Organization sameAs[] in JSON-LD.',
    }),
    defineField({
      name: 'errorCopy',
      title: 'Error / Loading Copy',
      type: 'object',
      description: 'Copy for not-found, error, and loading screens (D14).',
      fields: [
        defineField({
          name: 'notFoundHeading',
          title: '404 Heading',
          type: 'string',
        }),
        defineField({
          name: 'notFoundBody',
          title: '404 Body',
          type: 'text',
        }),
        defineField({
          name: 'errorHeading',
          title: '500 Heading',
          type: 'string',
        }),
        defineField({
          name: 'errorBody',
          title: '500 Body',
          type: 'text',
        }),
        defineField({
          name: 'loadingLabel',
          title: 'Loading Label',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'disclaimerText',
      title: 'Site-Wide Disclaimer',
      type: 'text',
      rows: 5,
      initialValue: LOCKED_DISCLAIMER,
      validation: (rule) => rule.required(),
      description:
        'LOCKED Metis-mandated copy. Do not edit without legal review.',
    }),
    defineField({
      name: 'uclaCompliantName',
      title: 'UCLA-Compliant Club Name',
      type: 'string',
      initialValue: 'Bruin Alpha Investment at UCLA',
      validation: (rule) => rule.required(),
      description:
        'Locked: use "Bruin Alpha Investment at UCLA" — NEVER "UCLA Bruin Alpha Investment".',
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'UCLA-approved verbatim mission statement (portable text). Edits require leadership review for regulatory and brand compliance.',
      validation: (rule) => rule.required().min(1),
      initialValue: LOCKED_MISSION,
    }),
    defineField({
      name: 'domainRenewalDate',
      title: 'Domain Renewal Date',
      type: 'date',
      description: 'Track renewal so handoffs flag it before lapse.',
    }),
  ],
  preview: {
    select: { title: 'uclaCompliantName', legacyTitle: 'ucla_compliant_name' },
    prepare({ title, legacyTitle }) {
      return {
        title: (title as string | undefined) ?? (legacyTitle as string | undefined) ?? 'Site Settings',
        subtitle: 'Singleton',
      };
    },
  },
});
