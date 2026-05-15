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
  { monogram: 'MW', name: 'Matt Walker', role: 'President & Wealth Management Director' },
  { monogram: 'BR', name: 'Ben Robinson', role: 'Accounting & Consulting Co-Director' },
  { monogram: 'MP', name: 'Michael Prosser', role: 'Accounting & Consulting Co-Director' },
  { monogram: 'MH', name: 'Mack Haymond', role: 'Founder & Trading Co-Director' },
  { monogram: 'KH', name: 'Kai Hata', role: 'Trading Co-Director' },
  { monogram: 'SJ', name: 'Samuel Jiang', role: 'Trading Co-Director' },
  { monogram: 'MX', name: 'Max Helmer', role: 'Investment Banking Co-Director' },
  { monogram: 'RA', name: 'Rhett Adkins', role: 'Investment Banking Co-Director' },
];
