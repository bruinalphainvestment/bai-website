import type { TrainingPageQueryResult } from '@/sanity/types/generated';

export const trainingPageFallback = {
  title: null,
  _updatedAt: '1970-01-01T00:00:00Z',
  seo: null,
  hero: null,
  intro: null,
  curriculumHeading: null,
  curriculum: null,
  classHierarchy: null,
  sampleWeek: null,
  assessment: null,
  quarterlyProject: null,
  programs: null,
  signatureCertifications: null,
} as NonNullable<TrainingPageQueryResult>;
