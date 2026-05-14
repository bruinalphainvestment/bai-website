import type { CommitteesTeaserSection } from '@/sanity/types/generated';

export const committeesTeaserFallback: CommitteesTeaserSection = {
  _type: 'committeesTeaserSection',
  heading: 'Committees',
  subheading: undefined,
};

export type TeaserCommitteeItem = {
  name: string;
  tagline: string;
  slug: string;
};

export const committeesTeaserItemsFallback: TeaserCommitteeItem[] = [
  {
    name: 'Wealth Management',
    tagline: 'Soft skills, relationship building, and SIE/Series exam readiness.',
    slug: 'wealth-management',
  },
  {
    name: 'Trading',
    tagline: 'Volatility, systematic strategies, and event-contract modeling research.',
    slug: 'trading',
  },
  {
    name: 'Accounting & Consulting',
    tagline: '3-statement modeling, DCF, and audit fundamentals.',
    slug: 'accounting-consulting',
  },
  {
    name: 'Investment Banking',
    tagline: 'Modeling, networking, and technical interview prep.',
    slug: 'investment-banking',
  },
];
