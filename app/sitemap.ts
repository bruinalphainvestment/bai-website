import type { MetadataRoute } from 'next';
import { stegaClean } from 'next-sanity';

import { sanityFetch } from '@/sanity/lib/live';
import {
  sitemapCommitteesQuery,
  sitemapPagesQuery,
} from '@/sanity/lib/queries';
import type {
  SitemapCommitteesQueryResult,
  SitemapPagesQueryResult,
} from '@/sanity/types/generated';

type SitemapPageType = SitemapPagesQueryResult[number]['_type'];

const PAGE_TYPE_TO_PATH: Record<SitemapPageType, string> = {
  homePage: '/',
  aboutPage: '/about',
  teamPage: '/team',
  projectsPage: '/projects',
  eventsPage: '/events',
  trainingPage: '/training',
  joinPage: '/join',
  committeesIndexPage: '/committees',
};

const PAGE_PRIORITY: Record<SitemapPageType, number> = {
  homePage: 1.0,
  aboutPage: 0.8,
  teamPage: 0.7,
  projectsPage: 0.8,
  eventsPage: 0.8,
  trainingPage: 0.8,
  joinPage: 0.9,
  committeesIndexPage: 0.9,
};

const PAGE_CHANGE_FREQ: Record<SitemapPageType, 'weekly' | 'monthly'> = {
  homePage: 'weekly',
  aboutPage: 'monthly',
  teamPage: 'monthly',
  projectsPage: 'monthly',
  eventsPage: 'weekly',
  trainingPage: 'monthly',
  joinPage: 'weekly',
  committeesIndexPage: 'monthly',
};

const FALLBACK_COMMITTEE_SLUGS = [
  'trading',
  'asset-management',
  'wealth-management',
  'sales-trading',
] as const;

type SitemapCommittee = {
  slug: string | null;
  _updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

  const [pages, committees] = await Promise.all([
    loadPages(),
    loadCommittees(),
  ]);

  const pageEntriesByType = new Map<SitemapPageType, Date>();
  for (const page of pages) {
    if (page._updatedAt) {
      pageEntriesByType.set(page._type, new Date(page._updatedAt));
    }
  }

  const pageEntries: MetadataRoute.Sitemap = (
    Object.keys(PAGE_TYPE_TO_PATH) as SitemapPageType[]
  ).map((type) => ({
    url: `${baseUrl}${PAGE_TYPE_TO_PATH[type]}`,
    lastModified: pageEntriesByType.get(type) ?? new Date(),
    changeFrequency: PAGE_CHANGE_FREQ[type],
    priority: PAGE_PRIORITY[type],
  }));

  const committeeEntries: MetadataRoute.Sitemap = committees
    .filter((c): c is SitemapCommittee & { slug: string } => Boolean(c.slug))
    .map((c) => ({
      url: `${baseUrl}/committees/${c.slug}`,
      lastModified: c._updatedAt ? new Date(c._updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...pageEntries, ...committeeEntries];
}

async function loadPages(): Promise<SitemapPagesQueryResult> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return [];
  try {
    const { data } = await sanityFetch({ query: sitemapPagesQuery });
    return stegaClean(data ?? []);
  } catch (error) {
    console.error('[sitemap] pages fetch failed:', error);
    return [];
  }
}

async function loadCommittees(): Promise<SitemapCommittee[]> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') {
    const fallbackTime = new Date().toISOString();
    return FALLBACK_COMMITTEE_SLUGS.map((slug) => ({
      slug,
      _updatedAt: fallbackTime,
    }));
  }

  try {
    const { data } = await sanityFetch({ query: sitemapCommitteesQuery });
    const cleaned: SitemapCommitteesQueryResult = stegaClean(data ?? []);
    return cleaned;
  } catch (error) {
    console.error('[sitemap] committees fetch failed; using fallback:', error);
    const fallbackTime = new Date().toISOString();
    return FALLBACK_COMMITTEE_SLUGS.map((slug) => ({
      slug,
      _updatedAt: fallbackTime,
    }));
  }
}
