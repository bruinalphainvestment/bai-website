import type { CommitteeBySlugQueryResult } from '@/sanity/types/generated';

type CommitteeDetail = NonNullable<CommitteeBySlugQueryResult>;

function block(text: string, key: string): NonNullable<CommitteeDetail['description']>[number] {
  return {
    _key: key,
    _type: 'block',
    style: 'normal',
    children: [{ _key: `${key}-span`, _type: 'span', text, marks: [] }],
    markDefs: [],
  };
}

export const committeeDetailFallback: Record<string, CommitteeDetail> = {
  'wealth-management': {
    _id: 'fallback-committee-wealth-management',
    name: 'Wealth Management',
    slug: 'wealth-management',
    tagline:
      'Soft skills, sales fundamentals, and the discipline behind a book of business.',
    description: null,
    curriculum: null,
    learn: [
      'Rejection-resistance and emotional intelligence',
      'Relationship building and long-term client management',
      'SIE/Series exam awareness and preparation',
      'Wealth advisor career path fundamentals',
    ],
    differentiator:
      'The only finance club at UCLA emphasizing the wealth advisory career path with hands-on practice.',
    director_quote:
      '"Wealth management is the long game — built on conviction, rejection-handling, and the relationships you cultivate quarter after quarter." — Mack Haymond',
    redirectsFrom: null,
    accentColor: 'gold',
    order: 0,
    directorPlaceholder: null,
    director: {
      _id: 'fallback-member-haymond',
      firstName: 'Mack',
      lastName: 'Haymond',
      role: 'President',
      committee: 'president',
      headshot: null,
      photoReleaseObtained: null,
      monogramOverride: 'MH',
    },
    projects: [
      {
        _id: 'fallback-project-wealth-mock',
        name: 'Wealth Advisory Mock Engagement',
        slug: null,
        summary:
          'Simulate a realistic client scenario from initial prospecting to portfolio recommendation.',
        status: 'planning',
      },
      {
        _id: 'fallback-project-sie-pod',
        name: 'SIE Study Pod',
        slug: null,
        summary:
          'Collaborative curriculum preparing members for the core Securities Industry Essentials exam.',
        status: 'planning',
      },
    ],
  },
  trading: {
    _id: 'fallback-committee-trading',
    name: 'Trading',
    slug: 'trading',
    tagline:
      'Markets, mechanics, and the systematic edge — from chart reading to hedge fund recruiting.',
    description: null,
    curriculum: null,
    learn: [
      'Chart reading, price action, and order flow',
      'Volatility analysis and position sizing',
      'Systematic strategy basics and risk management',
      'Technical interview prep for trading roles and hedge fund coffee chats',
    ],
    differentiator:
      'A unique focus on hands-on quant and market structure across alternative asset classes.',
    director_quote:
      '"The market is an incredible teacher. We focus on removing emotion and finding repeatable edge through systematic analysis." — Max',
    redirectsFrom: null,
    accentColor: 'gold',
    order: 1,
    directorPlaceholder: null,
    director: {
      _id: 'fallback-member-max',
      firstName: 'Max',
      lastName: null,
      role: 'Trading Director',
      committee: 'trading',
      headshot: null,
      photoReleaseObtained: null,
      monogramOverride: 'MX',
    },
    projects: [
      {
        _id: 'fallback-project-event-contract',
        name: 'Event-Contract Modeling Research',
        slug: null,
        summary:
          'Systematic identification and modeling of mispriced binary event contracts across various domains.',
        status: 'planning',
      },
      {
        _id: 'fallback-project-internal-trading',
        name: 'Internal Trading Competition',
        slug: null,
        summary: 'A CME-style simulation testing execution under pressure.',
        status: 'planning',
      },
      {
        _id: 'fallback-project-external-comps',
        name: 'External Competitions',
        slug: null,
        summary:
          'Preparation for and participation in the CME Trading Challenge (Fall) and IMC Prosperity (Spring).',
        status: 'planning',
      },
    ],
  },
  'accounting-consulting': {
    _id: 'fallback-committee-accounting-consulting',
    name: 'Accounting & Consulting',
    slug: 'accounting-consulting',
    tagline:
      'Where the numbers and the strategy meet — modeling, audit, and advisory thinking under one roof.',
    description: null,
    curriculum: null,
    learn: [
      '3-statement modeling and financial statement analysis',
      'Discounted Cash Flow (DCF) and LBO basics',
      'Audit fundamentals and operational review',
      'Case frameworks and structured advisory thinking',
    ],
    differentiator:
      'Why Both? We explain the accounting-consulting overlap and why a unified committee best prepares you for both career paths.',
    director_quote:
      '"Understanding both the underlying accounting and the overarching strategy makes you significantly more dangerous in any advisory room." — Helmer',
    redirectsFrom: null,
    accentColor: 'gold',
    order: 2,
    directorPlaceholder: null,
    director: {
      _id: 'fallback-member-helmer',
      firstName: 'Helmer',
      lastName: null,
      role: 'Accounting & Consulting Director',
      committee: 'accounting-consulting',
      headshot: null,
      photoReleaseObtained: null,
      monogramOverride: 'HM',
    },
    projects: [
      {
        _id: 'fallback-project-club-audit',
        name: 'UCLA Club Audit / Advisory',
        slug: null,
        summary:
          "Analyze a peer club's operations and financial structures, providing actionable recommendations for improvement.",
        status: 'planning',
      },
      {
        _id: 'fallback-project-case-comps',
        name: 'Industry Case Competitions',
        slug: null,
        summary:
          'Tackle real-world business strategy problems in timed, team-based formats.',
        status: 'planning',
      },
    ],
  },
  'investment-banking': {
    _id: 'fallback-committee-investment-banking',
    name: 'Investment Banking',
    slug: 'investment-banking',
    tagline:
      'Modeling, networking, and the mental models behind every deal.',
    description: null,
    curriculum: null,
    learn: [
      'Advanced 3-statement modeling and DCF valuation',
      'M&A models, LBO mechanics, and accretion/dilution analysis',
      'Strategic networking, cold emailing, and coffee chat mastery',
      'Technical interview prep for top-tier banking groups',
    ],
    differentiator:
      'A rotational program first approach, transitioning to specialized IB prep with tight cohort camaraderie and access to a smaller community.',
    director_quote:
      '"Success in banking isn\'t just about building the model perfectly—it\'s about understanding the "why" behind the transaction and clearly communicating that narrative." — Director',
    redirectsFrom: null,
    accentColor: 'gold',
    order: 3,
    directorPlaceholder: 'TBD — announcement coming soon',
    director: null,
    projects: [
      {
        _id: 'fallback-project-deal-teardown',
        name: 'Live Deal Tear-Down',
        slug: null,
        summary:
          'Analyze a recent M&A deal, present the strategic rationale, and propose alternative theses.',
        status: 'planning',
      },
      {
        _id: 'fallback-project-spring-pitch',
        name: 'Spring Stock Pitch',
        slug: null,
        summary:
          'An all-club capstone where members synthesize their financial modeling and presentation skills.',
        status: 'planning',
      },
    ],
  },
};

export const committeeDetailFallbackCurriculum: NonNullable<CommitteeDetail['curriculum']> = [
  block('Week 1 — Introduction & Core Concepts', 'curriculum-week-1'),
  block('Week 2 — Industry Overview & Terminology', 'curriculum-week-2'),
  block('Week 3 — Foundational Models & Tools', 'curriculum-week-3'),
  block('Week 4 — Advanced Case Studies', 'curriculum-week-4'),
  block('Week 5 — Midterm Project Review', 'curriculum-week-5'),
  block('Week 6 — Networking & Interview Strategies', 'curriculum-week-6'),
  block('Week 7 — Deep Dive: Specialized Topics', 'curriculum-week-7'),
  block('Week 8 — Final Presentations', 'curriculum-week-8'),
];
