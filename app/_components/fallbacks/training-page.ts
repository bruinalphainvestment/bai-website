import type { TrainingPageQueryResult } from '@/sanity/types/generated';

export const trainingPageFallback: NonNullable<TrainingPageQueryResult> = {
  title: 'Training Page',
  seo: {
    title: 'Training & Rotational Program — Bruin Alpha Investment at UCLA',
    description:
      'Our 10-week rotational program exposes analysts to Wealth Management, Trading, Accounting & Consulting, and Investment Banking before specialization.',
  },
  hero: {
    heading: 'The Rotational Program',
    subheading:
      'A rigorous 10-week pipeline designed to build comprehensive financial acumen. Analysts rotate through every discipline before committing to a specialized committee.',
  },
  intro: null,
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
  programs: null,
  signatureCertifications: null,
};
