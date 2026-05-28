import type {
  AllFoundingMembersQueryResult,
  TeamPageQueryResult,
} from '@/sanity/types/generated';

export const teamPageFallback = {
  title: null,
  _updatedAt: '1970-01-01T00:00:00Z',
  seo: null,
  hero: null,
  intro: null,
  foundingClassHeading: null,
  membersHeading: null,
  membersPlaceholder: null,
  alumniHeading: null,
  alumniPlaceholder: null,
} as NonNullable<TeamPageQueryResult>;

export const foundingMembersFallback: AllFoundingMembersQueryResult = [];
