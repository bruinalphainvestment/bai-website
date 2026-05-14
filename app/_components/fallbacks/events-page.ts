import type {
  AllEventsQueryResult,
  EventsPageQueryResult,
} from '@/sanity/types/generated';

export const eventsPageFallback: NonNullable<EventsPageQueryResult> = {
  title: 'Events Page',
  seo: {
    title: 'Events — Bruin Alpha Investment at UCLA',
    description:
      'Find Bruin Alpha Investment at campus events, competitions, and speaker series.',
  },
  hero: {
    heading: 'Where to Find Us',
    subheading:
      'Connect with us across campus and track our participation in premier collegiate competitions.',
  },
  intro: null,
  upcomingEmptyState: 'No upcoming events scheduled. Check back soon.',
  pastEmptyState: 'No past events to display yet.',
};

export const eventsListFallback: AllEventsQueryResult = [
  {
    _id: 'fallback-event-eaf',
    name: 'Enormous Activities Fair (EAF)',
    date: null,
    endDate: null,
    location: 'TBD',
    description:
      'Bruin Alpha Investment will be tabling at the annual UCLA Enormous Activities Fair. Come meet our founding class, learn about the rotational program, and ask questions about our four verticals before applications close.',
    type: 'fair',
    status: 'tbd',
    externalUrl: null,
    committee: null,
  },
  {
    _id: 'fallback-event-speakers',
    name: 'Speakers & Workshops',
    date: null,
    endDate: null,
    location: 'UCLA Campus',
    description:
      'Coming soon — speaker series in development. We are actively coordinating with industry professionals across trading, investment banking, and consulting.',
    type: 'speaker',
    status: 'tbd',
    externalUrl: null,
    committee: null,
  },
  {
    _id: 'fallback-event-cme',
    name: 'CME Trading Challenge',
    date: null,
    endDate: null,
    location: null,
    description:
      "Participation in the premier electronic trading competition utilizing CME Group's real-time professional trading platform.",
    type: 'comp',
    status: 'tbd',
    externalUrl: null,
    committee: {
      _id: 'fallback-committee-trading',
      name: 'Trading Committee',
      slug: 'trading',
    },
  },
  {
    _id: 'fallback-event-imc',
    name: 'IMC Prosperity',
    date: null,
    endDate: null,
    location: null,
    description:
      'Global trading challenge combining algorithmic trading, market making, and quantitative finance.',
    type: 'comp',
    status: 'tbd',
    externalUrl: null,
    committee: {
      _id: 'fallback-committee-trading',
      name: 'Trading Committee',
      slug: 'trading',
    },
  },
  {
    _id: 'fallback-event-cases',
    name: 'Case Competitions',
    date: null,
    endDate: null,
    location: null,
    description:
      'Targeted participation in regional and national accounting and investment banking case competitions.',
    type: 'comp',
    status: 'tbd',
    externalUrl: null,
    committee: {
      _id: 'fallback-committee-accounting-ib',
      name: 'Accounting & IB',
      slug: 'accounting-consulting',
    },
  },
  {
    _id: 'fallback-event-spring-pitch',
    name: 'Spring Stock Pitch',
    date: null,
    endDate: null,
    location: null,
    description:
      'Internal cross-committee competition synthesizing market research, financial modeling, and strategic presentation.',
    type: 'comp',
    status: 'scheduled',
    externalUrl: null,
    committee: {
      _id: 'fallback-committee-all',
      name: 'All Committees',
      slug: null,
    },
  },
];
