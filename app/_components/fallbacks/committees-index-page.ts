import type {
  AllCommitteesIndexQueryResult,
  CommitteesIndexPageQueryResult,
} from '@/sanity/types/generated';

export const committeesIndexPageFallback = {
  title: null,
  _updatedAt: '1970-01-01T00:00:00Z',
  seo: null,
  hero: null,
  intro: null,
  connectedByDesign: null,
  cardLearnHeading: null,
  cardCtaLabel: null,
} as NonNullable<CommitteesIndexPageQueryResult>;

export const committeesIndexListFallback: AllCommitteesIndexQueryResult = [];
