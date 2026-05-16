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
  groups: [
    { name: 'brand', title: 'Brand', default: true },
    { name: 'contact', title: 'Contact & Social' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'seo', title: 'SEO & Metadata' },
    { name: 'errors', title: 'Error Copy' },
    { name: 'legal', title: 'Legal & Locked' },
    { name: 'admin', title: 'Admin' },
  ],
  fields: [
    defineField({
      name: 'brandName',
      title: 'Brand Name',
      type: 'string',
      group: 'brand',
      initialValue: 'Bruin Alpha Investment',
    }),
    defineField({
      name: 'slogan',
      title: 'Club Slogan',
      type: 'string',
      group: 'brand',
      initialValue: 'Have Passion, Believe in Legacy, Believe in BAI',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'foundedYear',
      title: 'Founded Year',
      type: 'number',
      group: 'brand',
      validation: (rule) => rule.required().integer().min(2020).max(2030),
      description: 'Numeric founded year (used in copyright).',
    }),
    defineField({
      name: 'foundedTerm',
      title: 'Founded Term',
      type: 'string',
      group: 'brand',
      description: 'Textual founded term (e.g. "Spring 2026").',
    }),

    defineField({
      name: 'applyUrl',
      title: 'Application URL (Tally)',
      type: 'url',
      group: 'contact',
      initialValue: 'https://tally.so/r/placeholder',
      validation: (rule) => rule.required().uri({ scheme: ['http', 'https'] }),
      description: 'Replace with real Tally form URL once created.',
    }),
    defineField({
      name: 'clubEmail',
      title: 'Club Email',
      type: 'string',
      group: 'contact',
      initialValue: 'bruinalphainvestment26@gmail.com',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram URL',
      type: 'url',
      group: 'contact',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'contact',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'slackInviteUrl',
      title: 'Slack Invite URL',
      type: 'url',
      group: 'contact',
      validation: (rule) => rule.uri({ scheme: ['http', 'https'] }),
    }),

    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      group: 'navigation',
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
      name: 'titleSuffix',
      title: 'Title Suffix',
      type: 'string',
      group: 'seo',
      initialValue: ' — Bruin Alpha Investment at UCLA',
      description:
        'Appended to each page <title> tag. Default " — Bruin Alpha Investment at UCLA".',
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (rule) =>
        rule.max(160).warning('May be truncated in search results.'),
      description: 'Fallback <meta name="description"> when a page omits its own.',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OG Image',
      type: 'image',
      group: 'seo',
      options: { hotspot: true },
      description: 'Fallback Open Graph image when a page omits its own.',
    }),
    defineField({
      name: 'organizationDescription',
      title: 'Organization Description',
      type: 'text',
      group: 'seo',
      description:
        'Used in <Organization> structured data for Google Knowledge Graph.',
    }),
    defineField({
      name: 'sameAs',
      title: 'Same As (Structured Data sameAs[])',
      type: 'array',
      group: 'seo',
      of: [{ type: 'url' }],
      description:
        'External profile URLs (Instagram, LinkedIn, etc.) emitted as Organization sameAs[] in JSON-LD.',
    }),

    defineField({
      name: 'errorCopy',
      title: 'Error / Loading Copy',
      type: 'object',
      group: 'errors',
      description: 'Copy for not-found, error, and loading screens.',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({ name: 'notFoundHeading', title: '404 Heading', type: 'string' }),
        defineField({ name: 'notFoundBody', title: '404 Body', type: 'text' }),
        defineField({ name: 'errorHeading', title: '500 Heading', type: 'string' }),
        defineField({ name: 'errorBody', title: '500 Body', type: 'text' }),
        defineField({ name: 'loadingLabel', title: 'Loading Label', type: 'string' }),
      ],
    }),

    defineField({
      name: 'uclaCompliantName',
      title: 'UCLA-Compliant Club Name',
      type: 'string',
      group: 'legal',
      initialValue: 'Bruin Alpha Investment at UCLA',
      validation: (rule) => rule.required(),
      description:
        'Locked: use "Bruin Alpha Investment at UCLA" — NEVER "UCLA Bruin Alpha Investment".',
    }),
    defineField({
      name: 'missionStatement',
      title: 'Mission Statement',
      type: 'array',
      group: 'legal',
      of: [{ type: 'block' }],
      validation: (rule) => rule.required().min(1),
      initialValue: LOCKED_MISSION,
      description:
        'UCLA-approved verbatim mission statement (portable text). Edits require leadership review for regulatory and brand compliance.',
    }),
    defineField({
      name: 'disclaimerText',
      title: 'Site-Wide Disclaimer',
      type: 'text',
      group: 'legal',
      rows: 5,
      initialValue: LOCKED_DISCLAIMER,
      validation: (rule) => rule.required(),
      description:
        'LOCKED Metis-mandated copy. Do not edit without legal review.',
    }),

    defineField({
      name: 'domainRenewalDate',
      title: 'Domain Renewal Date',
      type: 'date',
      group: 'admin',
      description: 'Track renewal so handoffs flag it before lapse.',
    }),
  ],
  preview: {
    select: { title: 'uclaCompliantName' },
    prepare({ title }) {
      return {
        title: (title as string | undefined) ?? 'Site Settings',
        subtitle: 'Singleton',
      };
    },
  },
});
