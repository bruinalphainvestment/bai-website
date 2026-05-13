import { defineField, defineType } from 'sanity';

const LOCKED_DISCLAIMER =
  'Bruin Alpha Investment is a registered student organization at UCLA. Content on this site is educational only and does not constitute investment advice. BAI is not a registered investment adviser, broker-dealer, or financial advisor. This organization acts independently of UCLA and does not represent the University.';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'ucla_compliant_name',
      title: 'UCLA-Compliant Club Name',
      type: 'string',
      initialValue: 'Bruin Alpha Investment at UCLA',
      validation: (rule) => rule.required(),
      description:
        'Locked: use "Bruin Alpha Investment at UCLA" — NEVER "UCLA Bruin Alpha Investment".',
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
      title: 'Mission Statement',
      type: 'array',
      of: [{ type: 'block' }],
      description:
        'UCLA-approved verbatim mission statement (portable text). Edits require leadership review for regulatory and brand compliance.',
      validation: (rule) => rule.required().min(1),
      initialValue: [
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
      ],
    }),
    defineField({
      name: 'disclaimer_text',
      title: 'Site-Wide Disclaimer',
      type: 'text',
      rows: 5,
      initialValue: LOCKED_DISCLAIMER,
      validation: (rule) => rule.required(),
      description: 'LOCKED Metis-mandated copy. Do not edit without legal review.',
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
      title: 'Domain Renewal Date',
      type: 'date',
      description: 'Track renewal so handoffs flag it before lapse.',
    }),
  ],
  preview: {
    select: { title: 'ucla_compliant_name' },
    prepare({ title }) {
      return { title: title ?? 'Site Settings', subtitle: 'Singleton' };
    },
  },
});
