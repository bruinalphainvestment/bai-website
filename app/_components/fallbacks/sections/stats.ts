import type { StatsSection } from '@/sanity/types/generated';

export const statsFallback: StatsSection = {
  _type: 'statsSection',
  heading: undefined,
  stats: [
    { _key: 'stat-est', _type: 'stat', label: 'Est.', value: '2026' },
    {
      _key: 'stat-founding-members',
      _type: 'stat',
      label: 'Founding Members',
      value: '5',
    },
    { _key: 'stat-committees', _type: 'stat', label: 'Committees', value: '4' },
    {
      _key: 'stat-recruitment',
      _type: 'stat',
      label: 'Recruitment',
      value: 'Fall 2026',
    },
  ],
};
