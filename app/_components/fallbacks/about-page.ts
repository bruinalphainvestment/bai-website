import type { AboutPageQueryResult } from '@/sanity/types/generated';

export const aboutPageFallback = {
  title: null,
  _updatedAt: '1970-01-01T00:00:00Z',
  seo: null,
  hero: null,
  mission: null,
  history: null,
  founderQuote: null,
  signatureTrip: null,
  valuesHeading: null,
  values: null,
  sections: null,
} as NonNullable<AboutPageQueryResult>;
