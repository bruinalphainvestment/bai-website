import type { FoundingTeamSection } from '@/sanity/types/generated';

export const foundingTeamFallback: FoundingTeamSection = {
  _type: 'foundingTeamSection',
  heading: 'The Founding Class — Built in Spring 2026',
  subheading: undefined,
};

export type FoundingTeamMemberItem = {
  monogram: string;
  name: string;
  role: string;
};

export const foundingTeamMembersFallback: FoundingTeamMemberItem[] = [
  { monogram: 'MH', name: 'Mack Haymond', role: 'President' },
  { monogram: 'MX', name: 'Max', role: 'Trading Director' },
  { monogram: 'SM', name: 'Sam', role: 'Operations' },
  { monogram: 'KX', name: 'Kai', role: 'Trading Co-Director' },
  { monogram: 'HM', name: 'Helmer', role: 'Accounting & Consulting Director' },
];
