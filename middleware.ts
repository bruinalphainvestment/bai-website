import { unstable_cache } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

import { client } from '@/sanity/lib/client';
import { committeeRedirectMapQuery } from '@/sanity/lib/queries';
import type { CommitteeRedirectMapQueryResult } from '@/sanity/types/generated';

const STUDIO_HOST = 'studio.bruinalphainvestment.com';
const WWW_HOST = 'www.bruinalphainvestment.com';
const APEX_HOST = 'bruinalphainvestment.com';

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
  const hostname = req.nextUrl.hostname;
  const url = req.nextUrl.clone();

  // Studio subdomain handling
  if (hostname === STUDIO_HOST) {
    // Bare subdomain → redirect to /studio
    if (pathname === '/' || pathname === '') {
      url.pathname = '/studio';
      return NextResponse.redirect(url, 308);
    }
    // Anything other than /studio, /api, /_next, /brand → bounce to www
    if (
      !pathname.startsWith('/studio') &&
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/_next') &&
      !pathname.startsWith('/brand')
    ) {
      url.hostname = WWW_HOST;
      return NextResponse.redirect(url, 301);
    }
    // /studio paths fall through (Studio renders normally)
  }

  // www / apex: canonicalize /studio to subdomain
  if ((hostname === WWW_HOST || hostname === APEX_HOST) && pathname.startsWith('/studio')) {
    url.hostname = STUDIO_HOST;
    return NextResponse.redirect(url, 301);
  }

  if (pathname.startsWith('/committees/')) {
    const slug = pathname.replace('/committees/', '').split('/')[0];
    if (slug) {
      const redirectMap = await loadRedirectMap();
      const target = redirectMap[slug];
      if (target && target !== slug) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = `/committees/${target}`;
        return NextResponse.redirect(redirectUrl, 301);
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
