import type { AboutPageQueryResult } from '@/sanity/types/generated';

/**
 * Hardcoded fallback for `/about` when NEXT_PUBLIC_USE_SANITY !== 'true' or the
 * Sanity fetch fails. Shape matches `aboutPageQuery` so the same render branch
 * works whether data came from Sanity or this module. Values reproduce what
 * `main` currently ships so flag-off rendering is byte-identical to production.
 */
export const aboutPageFallback: NonNullable<AboutPageQueryResult> = {
  title: 'About Page',
  seo: {
    title: 'About — Bruin Alpha Investment at UCLA',
    description:
      'Bruin Alpha Investment was founded in Spring 2026 to provide blanket coverage across finance disciplines through specialized committees and real project work.',
  },
  hero: {
    heading: 'Our Story',
    subheading:
      "Founded in Spring 2026, Bruin Alpha Investment was built to bridge the gap in UCLA's finance club landscape by combining broad accessibility with deep, specialized training.",
  },
  mission: null,
  history: {
    heading: 'Origin',
    body: [
      'The vision for Bruin Alpha Investment began in the Spring of 2026. Mack Haymond and four co-founders recognized a clear gap in the existing financial organization landscape at UCLA. While other organizations focused heavily on single disciplines or maintained extremely narrow funnels for entry, there was a profound need for a community that offered both an inclusive starting point and a pathway to highly specialized expertise.',
      "We realized that true financial education doesn't happen in silos. It happens when students are exposed to the full spectrum of the industry—from investment banking and wealth management to trading and accounting—before they are forced to specialize.",
      'By establishing our multi-committee structure, we ensure that every member receives blanket coverage of the financial world during their rotational period, followed by rigorous, hands-on development within their chosen focus area. Our goal is not just to teach finance, but to execute real, meaningful projects that deliver tangible value to our members and the broader community.',
    ].join('\n\n'),
  },
  signatureTrip: {
    headline: 'Signature Trip',
    status: 'In Development',
    body: undefined,
    visible: true,
  },
  values: [
    {
      _key: 'value-blanket-coverage',
      _type: 'value',
      title: 'Blanket Coverage',
      body: "We don't limit our focus to just one area of finance. Our structure is designed to expose members to the entire landscape, ensuring a well-rounded understanding of the markets before deep specialization.",
    },
    {
      _key: 'value-real-projects',
      _type: 'value',
      title: 'Real Projects',
      body: 'Theory only goes so far. Our committees operate through hands-on, deliverable-driven initiatives rather than passive lectures, ensuring every member builds a tangible track record.',
    },
    {
      _key: 'value-rotational-program',
      _type: 'value',
      title: 'Rotational Program',
      body: 'Our unique onboarding pipeline allows new analysts to experience every committee over a 10-week period, guaranteeing that their final placement aligns perfectly with their skills and interests.',
    },
  ],
  sections: null,
};

/**
 * Quote pull-out rendered in the About page JSX between the history body and
 * the "What Sets Us Apart" values list. The current About schema has no field
 * for an editorial quote, so this is structural copy kept stable across the
 * USE_SANITY flag (matches Phase 0 schema scope — not extending here).
 */
export const aboutQuoteFallback = {
  body: 'We are starting it, we are building it, so we can decide what direction it wants to go.',
  attribution: 'Mack Haymond, Spring 2026',
} as const;
