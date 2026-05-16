import type { MetadataRoute } from 'next';
import { stegaClean } from 'next-sanity';

import { sanityFetch } from '@/sanity/lib/live';
import { sitemapCommitteesQuery } from '@/sanity/lib/queries';
import type { SitemapCommitteesQueryResult } from '@/sanity/types/generated';

const STATIC_PATHS = [
  '/about',
  '/team',
  '/projects',
  '/events',
  '/training',
  '/join',
  '/committees',
] as const;

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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const committees = await loadCommittees();

  const homeEntry: MetadataRoute.Sitemap[number] = {
    url: baseUrl,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 1,
  };

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const committeeEntries: MetadataRoute.Sitemap = committees
    .filter((c): c is SitemapCommittee & { slug: string } => Boolean(c.slug))
    .map((c) => ({
      url: `${baseUrl}/committees/${c.slug}`,
      lastModified: c._updatedAt ? new Date(c._updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [homeEntry, ...staticEntries, ...committeeEntries];
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
    console.error('[sitemap] sanityFetch failed; using fallback committees:', error);
    const fallbackTime = new Date().toISOString();
    return FALLBACK_COMMITTEE_SLUGS.map((slug) => ({
      slug,
      _updatedAt: fallbackTime,
    }));
  }
}
