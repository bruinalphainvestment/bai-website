import type {
  AllProjectsQueryResult,
  ProjectsPageQueryResult,
} from '@/sanity/types/generated';

export const projectsPageFallback: NonNullable<ProjectsPageQueryResult> = {
  title: 'Projects Page',
  _updatedAt: '2026-05-15T00:00:00Z',
  seo: {
    _type: 'seo' as const,
    title: 'Projects & Research — Bruin Alpha Investment at UCLA',
    description:
      'Explore the hands-on initiatives, research, and engagements led by our specialized committees.',
  },
  hero: {
    _type: 'pageHero' as const,
    heading: 'What We Build',
    subheading:
      'At Bruin Alpha Investment, theory is immediately put into practice. Our committees drive independent research and structured deliverables.',
  },
  intro: null,
  emptyState: 'Projects are being scoped — check back soon.',
  statusLegend: [
    {
      _key: 'legend-planning',
      _type: 'statusLegendEntry',
      status: 'planning',
      description: 'Scope and deliverables are currently being finalized.',
    },
    {
      _key: 'legend-active',
      _type: 'statusLegendEntry',
      status: 'active',
      description: 'Project is currently in execution phase.',
    },
    {
      _key: 'legend-completed',
      _type: 'statusLegendEntry',
      status: 'completed',
      description: 'Final deliverable has been published.',
    },
  ],
};

export const projectsListFallback: AllProjectsQueryResult = [
  {
    _id: 'fallback-project-event-contract',
    name: 'Event-Contract Modeling Research',
    slug: null,
    summary:
      'A quantitative initiative focused on pricing and analyzing probability-based event contracts. Analysts will build predictive models to evaluate mispricings in event-driven markets.',
    status: 'planning',
    tags: null,
    committee: {
      _id: 'fallback-committee-trading',
      name: 'Trading',
      slug: 'trading',
    },
  },
  {
    _id: 'fallback-project-audit',
    name: 'UCLA Club Audit Initiative',
    slug: null,
    summary:
      'Pro-bono financial reviews for other campus organizations. Members will assess cash flow, budget allocations, and operational efficiency, culminating in a formalized advisory report.',
    status: 'planning',
    tags: null,
    committee: {
      _id: 'fallback-committee-accounting',
      name: 'Accounting & Consulting',
      slug: 'accounting-consulting',
    },
  },
  {
    _id: 'fallback-project-stock-pitch',
    name: 'Spring Stock Pitch',
    slug: null,
    summary:
      'Our capstone event where analysts across all committees form teams to deliver comprehensive investment pitches, emphasizing rigorous valuation, market sizing, and strategic rationale.',
    status: 'planning',
    tags: null,
    committee: {
      _id: 'fallback-committee-ib',
      name: 'Investment Banking (All-Club)',
      slug: 'investment-banking',
    },
  },
  {
    _id: 'fallback-project-wealth-mock',
    name: 'Wealth Advisory Mock Engagement',
    slug: null,
    summary:
      'Simulated client engagements requiring analysts to construct diversified portfolios based on specific risk profiles, tax considerations, and long-term financial objectives.',
    status: 'planning',
    tags: null,
    committee: {
      _id: 'fallback-committee-wealth',
      name: 'Wealth Management',
      slug: 'wealth-management',
    },
  },
  {
    _id: 'fallback-project-uclawide-trading',
    name: 'UCLA-Wide Stock Trading Competition',
    slug: null,
    summary:
      'A campus-wide initiative currently in the planning phase. The goal is to democratize market access and test trading strategies in a competitive, simulated environment.',
    status: 'planning',
    tags: null,
    committee: {
      _id: 'fallback-committee-trading-aspirational',
      name: 'Trading (Aspirational)',
      slug: 'trading',
    },
  },
];
