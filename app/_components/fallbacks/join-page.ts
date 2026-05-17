import type { JoinPageQueryResult } from '@/sanity/types/generated';

export const joinPageFallback: NonNullable<JoinPageQueryResult> = {
  title: 'Join Page',
  _updatedAt: '2026-05-15T00:00:00Z',
  seo: {
    _type: 'seo' as const,
    title: 'Join — Bruin Alpha Investment at UCLA',
    description:
      'Apply to Bruin Alpha Investment. Learn about our recruitment timeline, application process, and FAQ.',
  },
  hero: {
    _type: 'pageHero' as const,
    heading: 'Join the Cohort',
    subheading:
      'Four disciplines. One structured rotational program. Build your foundation in finance without locking into a single track on day one.',
  },
  intro: null,
  timeline: [
    {
      _key: 'timeline-step-1',
      _type: 'timelineStep',
      stepNumber: 1,
      title: 'Fall 2026',
      body: 'Priority Application Deadline',
    },
    {
      _key: 'timeline-step-2',
      _type: 'timelineStep',
      stepNumber: 2,
      title: 'Through Week 5',
      body: 'Rolling Applications & Coffee Chats',
    },
    {
      _key: 'timeline-step-3',
      _type: 'timelineStep',
      stepNumber: 3,
      title: 'Weeks 5-6',
      body: 'Interview Process (1x Technical + 1x Behavioral)',
    },
    {
      _key: 'timeline-step-4',
      _type: 'timelineStep',
      stepNumber: 4,
      title: 'Week 6',
      body: 'Final Decisions Released',
    },
  ],
  applicationForm: {
    heading: 'Application Form',
    body: 'Application opens Fall 2026',
    formUrl: '#',
  },
  faqs: [
    {
      _key: 'faq-experience',
      _type: 'faq',
      question: 'Do I need finance experience?',
      answer:
        'No prior experience required for first-year applicants. We provide a structured rotational program covering all 4 verticals.',
    },
    {
      _key: 'faq-year',
      _type: 'faq',
      question: 'What year can I apply?',
      answer:
        'All current and incoming UCLA undergraduates are welcome to apply. First-years are encouraged.',
    },
    {
      _key: 'faq-different',
      _type: 'faq',
      question: 'How is BAI different from other UCLA finance clubs?',
      answer:
        'BAI combines blanket coverage of finance verticals with specialized committees and a rotational program — without requiring you to pick a single track on day one.',
    },
    {
      _key: 'faq-commitment',
      _type: 'faq',
      question: "What's the time commitment?",
      answer: '~3-5 hours per week during quarters, plus optional project work.',
    },
    {
      _key: 'faq-fee',
      _type: 'faq',
      question: 'Is there a fee?',
      answer: 'No dues for general membership.',
    },
    {
      _key: 'faq-accepted',
      _type: 'faq',
      question: "What happens after I'm accepted?",
      answer:
        'You join the rotational program in Fall, cycle through all 4 committees over 8 weeks, then commit to one for the rest of the year.',
    },
  ],
  eligibilityHeading: null,
  eligibilityBullets: null,
};
