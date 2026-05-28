import type {
  AllEventsQueryResult,
  EventsPageQueryResult,
} from '@/sanity/types/generated';

export const eventsPageFallback = {
  title: null,
  _updatedAt: '1970-01-01T00:00:00Z',
  seo: null,
  hero: null,
  intro: null,
  upcomingHeading: null,
  competitionsHeading: null,
  externalCtaLabel: null,
  upcomingEmptyState: null,
  pastEmptyState: null,
} as NonNullable<EventsPageQueryResult>;

export const eventsListFallback: AllEventsQueryResult = [];
