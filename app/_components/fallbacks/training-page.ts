import type { TrainingPageQueryResult } from '@/sanity/types/generated';

export const trainingPageFallback: NonNullable<TrainingPageQueryResult> = {
  title: 'Training Page',
  _updatedAt: '2026-05-15T00:00:00Z',
  seo: {
    _type: 'seo' as const,
    title: 'Training & Rotational Program — Bruin Alpha Investment at UCLA',
    description:
      'Our 10-week rotational program exposes analysts to Wealth Management, Trading, Accounting & Consulting, and Investment Banking before specialization.',
  },
  hero: {
    _type: 'pageHero' as const,
    heading: 'The Rotational Program',
    subheading:
      'A rigorous 10-week pipeline designed to build comprehensive financial acumen. Analysts rotate through every discipline before committing to a specialized committee.',
  },
  intro: null,
  curriculumHeading: 'How It Works',
  curriculum: [
    {
      _key: 'curriculum-wk-1-2',
      _type: 'curriculumEntry',
      week: 'Wk 1-2',
      topic: 'Wealth Management',
      body: 'Personal finance fundamentals, portfolio allocation strategies, and risk assessment.',
    },
    {
      _key: 'curriculum-wk-3-4',
      _type: 'curriculumEntry',
      week: 'Wk 3-4',
      topic: 'Trading',
      body: 'Market mechanics, quantitative analysis, and event-contract modeling.',
    },
    {
      _key: 'curriculum-wk-5-6',
      _type: 'curriculumEntry',
      week: 'Wk 5-6',
      topic: 'Accounting & Consulting',
      body: 'Financial statement analysis, corporate strategy, and operational auditing.',
    },
    {
      _key: 'curriculum-wk-7-8',
      _type: 'curriculumEntry',
      week: 'Wk 7-8',
      topic: 'Investment Banking',
      body: 'Valuation methodologies, financial modeling, and strategic advisory.',
    },
    {
      _key: 'curriculum-wk-9-10',
      _type: 'curriculumEntry',
      week: 'Wk 9-10',
      topic: 'Selection & Commit',
      body: 'Final placement matching based on analyst preference and demonstrated aptitude.',
    },
  ],
  classHierarchy: {
    heading: 'Class Hierarchy',
    tiers: [
      {
        _key: 'class-executive-board',
        _type: 'classHierarchyTier',
        title: 'Executive Board',
        subtitle: 'Leadership',
      },
      {
        _key: 'class-director',
        _type: 'classHierarchyTier',
        title: 'Director',
        subtitle: 'Committee Lead',
      },
      {
        _key: 'class-associate',
        _type: 'classHierarchyTier',
        title: 'Associate',
        subtitle: 'Year 2',
      },
      {
        _key: 'class-analyst',
        _type: 'classHierarchyTier',
        title: 'Analyst',
        subtitle: 'Year 1',
      },
    ],
  },
  sampleWeek: {
    heading: 'Sample Week',
    items: [
      {
        _key: 'sample-committee-meeting',
        _type: 'sampleWeekItem',
        duration: '1 hr',
        title: 'Committee Meeting',
        body: 'Synchronous instruction, project alignment, and progress reviews.',
      },
      {
        _key: 'sample-asynchronous-work',
        _type: 'sampleWeekItem',
        duration: '2 hr',
        title: 'Asynchronous Work',
        body: 'Independent research, modeling, and deliverable preparation.',
      },
    ],
  },
  assessment: {
    heading: 'Assessment',
    body: 'Members complete a 30-page consolidated study guide prior to recruiting interviews, ensuring technical readiness across all major financial disciplines.',
  },
  quarterlyProject: {
    heading: 'Quarterly All-Club Project',
    body: 'Beyond committee work, the entire organization unites once per quarter for a comprehensive, cross-disciplinary project. This ensures continued collaboration between groups and reinforces the interconnected nature of the financial ecosystem.',
  },
  programs: null,
  signatureCertifications: null,
};
