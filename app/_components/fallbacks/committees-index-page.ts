import type {
  AllCommitteesIndexQueryResult,
  CommitteesIndexPageQueryResult,
} from '@/sanity/types/generated';

export const committeesIndexPageFallback: NonNullable<CommitteesIndexPageQueryResult> = {
  title: 'Committees Index Page',
  seo: {
    _type: 'seo' as const,
    title: 'Committees — Bruin Alpha Investment at UCLA',
    description:
      'Explore our four core committees: Wealth Management, Trading, Accounting & Consulting, and Investment Banking.',
  },
  hero: {
    _type: 'pageHero' as const,
    heading: 'Four Committees. One Club.',
    subheading:
      'Bruin Alpha Investment is structured around four core committees. While each has a distinct focus, they work together to provide a comprehensive financial education through our rotational program.',
  },
  intro: null,
  connectedByDesign: {
    heading: 'Connected by Design',
    body: undefined,
    paragraphs: [
      "We don't believe in silos. Our unique rotational program ensures that every member gains exposure to all four disciplines during their early tenure. You might specialize in Wealth Management, but you'll understand how a trader sizes positions, how a consultant audits operations, and how an investment banker builds a DCF.",
      'This cross-pollination comes to life in our unified all-club projects, where members from different committees collaborate to tackle complex, multi-faceted financial challenges. We build well-rounded professionals who understand the entire financial ecosystem.',
    ],
  },
};

export const committeesIndexListFallback: AllCommitteesIndexQueryResult = [
  {
    _id: 'fallback-committee-wealth-management',
    name: 'Wealth Management',
    slug: 'wealth-management',
    tagline:
      'Learn the fundamentals of relationship building, sales, and advisory services. Develop the skills required to one day build a book of business and guide clients through complex financial decisions.',
    learn: [
      'Relationship building & networking',
      'Sales fundamentals & rejection resistance',
      'SIE exam awareness and prep methodologies',
    ],
    accentColor: 'gold',
    order: 0,
    directorPlaceholder: null,
    director: {
      firstName: 'Mack',
      lastName: 'Haymond',
      role: 'President',
    },
  },
  {
    _id: 'fallback-committee-trading',
    name: 'Trading',
    slug: 'trading',
    tagline:
      'Dive into the mechanics of markets. From chart reading and volatility analysis to systematic strategy basics, build a foundation in both discretionary and quantitative trading.',
    learn: [
      'Chart reading & technical analysis',
      'Position sizing & risk management',
      'Hedge fund interview preparation',
    ],
    accentColor: 'gold',
    order: 1,
    directorPlaceholder: null,
    director: {
      firstName: 'Max',
      lastName: null,
      role: 'Trading Director',
    },
  },
  {
    _id: 'fallback-committee-accounting-consulting',
    name: 'Accounting & Consulting',
    slug: 'accounting-consulting',
    tagline:
      'Master the intersection of financial reporting and strategic advisory. Build a dual skillset that opens doors to Big Four accounting, management consulting, and beyond.',
    learn: [
      '3-statement modeling & DCF basics',
      'Audit fundamentals & operational analysis',
      'Industry case competition frameworks',
    ],
    accentColor: 'gold',
    order: 2,
    directorPlaceholder: null,
    director: {
      firstName: 'Helmer',
      lastName: null,
      role: 'Accounting & Consulting Director',
    },
  },
  {
    _id: 'fallback-committee-investment-banking',
    name: 'Investment Banking',
    slug: 'investment-banking',
    tagline:
      'Prepare for the rigorous world of investment banking. Master core valuation techniques, deal mechanics, and the technical knowledge required to ace superdays.',
    learn: [
      'Core valuation methodologies (DCF, Comps)',
      'M&A modeling fundamentals',
      'Technical interview preparation',
    ],
    accentColor: 'gold',
    order: 3,
    directorPlaceholder: 'Announcement Coming Soon',
    director: null,
  },
];
