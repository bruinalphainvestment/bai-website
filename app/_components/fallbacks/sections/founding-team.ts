import type { FoundingTeamSection } from '@/sanity/types/generated';

export const foundingTeamFallback: FoundingTeamSection = {
  _type: 'foundingTeamSection',
  heading: undefined,
  subheading: undefined,
};

export type FoundingTeamMemberItem = {
  committeeLabel?: string;
  gradYearLabel?: string;
  linkedinHref?: string | null;
  monogram: string;
  name: string;
  role: string;
};

export const foundingTeamMembersFallback: FoundingTeamMemberItem[] = [];
