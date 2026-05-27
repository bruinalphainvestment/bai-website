import type { CommitteesTeaserSection } from '@/sanity/types/generated';

export const committeesTeaserFallback: CommitteesTeaserSection = {
  _type: 'committeesTeaserSection',
  heading: undefined,
  subheading: undefined,
  ctaLabel: undefined,
};

export type TeaserCommitteeItem = {
  name: string;
  tagline: string;
  slug: string;
};

export const committeesTeaserItemsFallback: TeaserCommitteeItem[] = [];
