import type { FoundingTeamSection } from '@/sanity/types/generated';

export const foundingTeamFallback: FoundingTeamSection = {
  _type: 'foundingTeamSection',
  heading: undefined,
  subheading: undefined,
};

export type FoundingTeamMemberItem = {
  monogram: string;
  name: string;
  role: string;
};

export const foundingTeamMembersFallback: FoundingTeamMemberItem[] = [];
