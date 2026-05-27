import type { JoinPageQueryResult } from '@/sanity/types/generated';

export const joinPageFallback = {
  title: null,
  _updatedAt: '1970-01-01T00:00:00Z',
  seo: null,
  hero: null,
  intro: null,
  applicationProcessHeading: null,
  applicationSteps: null,
  timelineHeading: null,
  timeline: null,
  applicationForm: null,
  faqHeading: null,
  faqs: null,
  contactHeading: null,
  contactLinks: null,
  eligibilityHeading: null,
  eligibilityBullets: null,
} as NonNullable<JoinPageQueryResult>;
