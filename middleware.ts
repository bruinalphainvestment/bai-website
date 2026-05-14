import { unstable_cache } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { client } from '@/sanity/lib/client';
import { committeeRedirectMapQuery } from '@/sanity/lib/queries';
import type { CommitteeRedirectMapQueryResult } from '@/sanity/types/generated';

const loadRedirectMap = unstable_cache(
  async (): Promise<Record<string, string>> => {
    if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return {};
    try {
      const rows = await client
        .withConfig({ apiVersion: '2025-01-01', useCdn: false })
        .fetch<CommitteeRedirectMapQueryResult>(committeeRedirectMapQuery);
      const map: Record<string, string> = {};
      for (const row of rows) {
        if (!row.slug) continue;
        for (const oldSlug of row.redirectsFrom ?? []) {
          if (oldSlug && oldSlug !== row.slug) {
            map[oldSlug] = row.slug;
          }
        }
      }
      return map;
    } catch (err) {
      console.error('[middleware] committee redirect map fetch failed:', err);
      return {};
    }
  },
  ['committee-redirect-map'],
  { tags: ['committee'], revalidate: 3600 },
);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/committees/')) {
    const slug = pathname.replace('/committees/', '').split('/')[0];
    if (slug) {
      const redirectMap = await loadRedirectMap();
      const target = redirectMap[slug];
      if (target && target !== slug) {
        const url = req.nextUrl.clone();
        url.pathname = `/committees/${target}`;
        return NextResponse.redirect(url, 301);
      }
    }
  }

  if (pathname.startsWith('/studio') || pathname.startsWith('/api')) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/committees/:path*', '/studio/:path*', '/api/:path*'],
};
