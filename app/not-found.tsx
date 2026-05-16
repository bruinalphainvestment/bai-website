import Link from 'next/link';
import { stegaClean } from 'next-sanity';

import { SiteFooter } from '@/app/_components/site-footer';
import { SiteHeader } from '@/app/_components/site-header';
import { sanityFetch } from '@/sanity/lib/live';
import { siteSettingsQuery } from '@/sanity/lib/queries';

const FALLBACK = {
  heading: 'Page not found',
  body: "The page you're looking for doesn't exist or has been moved.",
};

export default async function NotFound() {
  const { heading, body } = await loadCopy();
  return (
    <>
      <SiteHeader />
      <main
        id="main-content"
        className="min-h-screen bg-cream text-navy flex items-center justify-center px-6 py-24"
      >
        <div className="max-w-2xl text-center">
          <p className="text-sm tracking-widest uppercase text-gold-start mb-6">
            404
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-6">
            {heading}
          </h1>
          <p className="font-sans text-lg md:text-xl text-navy/80 mb-10 leading-relaxed">
            {body}
          </p>
          <Link
            href="/"
            className="inline-block bg-navy text-cream font-semibold py-3 px-8 rounded-full hover:bg-navy/90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

async function loadCopy(): Promise<{ heading: string; body: string }> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return FALLBACK;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    if (!data) return FALLBACK;
    const clean = stegaClean(data);
    return {
      heading: clean.errorCopy?.notFoundHeading ?? FALLBACK.heading,
      body: clean.errorCopy?.notFoundBody ?? FALLBACK.body,
    };
  } catch (error) {
    console.error('[not-found] siteSettings fetch failed; using fallback:', error);
    return FALLBACK;
  }
}
