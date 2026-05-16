import { stegaClean } from 'next-sanity';

import { sanityFetch } from '@/sanity/lib/live';
import { siteSettingsQuery } from '@/sanity/lib/queries';

const FALLBACK_LABEL = 'Loading…';

export default async function Loading() {
  const label = await loadLabel();
  return (
    <div className="min-h-screen bg-cream text-navy flex items-center justify-center px-6 py-24">
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-6"
      >
        <span
          aria-hidden="true"
          className="block w-12 h-12 rounded-full border-2 border-navy/20 border-t-gold-start animate-spin"
        />
        <p className="font-sans text-base tracking-widest uppercase text-navy/70">
          {label}
        </p>
      </div>
    </div>
  );
}

async function loadLabel(): Promise<string> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return FALLBACK_LABEL;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    if (!data) return FALLBACK_LABEL;
    const clean = stegaClean(data);
    return clean.errorCopy?.loadingLabel ?? FALLBACK_LABEL;
  } catch (error) {
    console.error('[loading] siteSettings fetch failed; using fallback:', error);
    return FALLBACK_LABEL;
  }
}
