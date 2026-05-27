import type {
  AllProjectsQueryResult,
  ProjectsPageQueryResult,
} from '@/sanity/types/generated';

export const projectsPageFallback = {
  title: null,
  _updatedAt: '1970-01-01T00:00:00Z',
  seo: null,
  hero: null,
  intro: null,
  emptyState: null,
  statusLegendHeading: null,
  statusLegend: null,
} as NonNullable<ProjectsPageQueryResult>;

export const projectsListFallback: AllProjectsQueryResult = [];
