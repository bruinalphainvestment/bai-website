import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import { aboutPageFallback, aboutQuoteFallback } from '@/app/_components/fallbacks/about-page';
import { footerFallback } from '@/app/_components/fallbacks/footer';
import { resolveOgImages } from '@/app/_components/og-image';
import { sanityFetch } from '@/sanity/lib/live';
import { aboutPageQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import type {
  AboutPageQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity/types/generated';

type AboutData = NonNullable<AboutPageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;

export async function generateMetadata(): Promise<Metadata> {
  const [aboutRaw, settingsRaw] = await Promise.all([
    loadAboutData(),
    loadSiteSettings(),
  ]);
  const about = stegaClean(aboutRaw);
  const settings = stegaClean(settingsRaw);

  const brand = settings.brandName ?? 'Bruin Alpha Investment';
  const suffix = settings.titleSuffix ?? ' — Bruin Alpha Investment at UCLA';
  const fallbackTitle = `About — ${brand}${suffix}`.replace(/\s+—\s+—\s+/, ' — ');
  const title = about.seo?.title ?? fallbackTitle;
  const description =
    about.seo?.description ??
    settings.defaultMetaDescription ??
    aboutPageFallback.seo?.description ??
    '';

  const images = resolveOgImages(about.seo?.ogImage, settings.defaultOgImage, title);

  return {
    title,
    description,
    openGraph: images ? { title, description, images } : { title, description },
  };
}

export default async function AboutPage() {
  const data = await loadAboutData();
  const heading = data.hero?.heading ?? aboutPageFallback.hero?.heading ?? 'Our Story';
  const subheading = data.hero?.subheading ?? aboutPageFallback.hero?.subheading ?? '';
  const historyBody = data.history?.body ?? aboutPageFallback.history?.body ?? '';
  const historyParagraphs = historyBody
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const values = data.values ?? aboutPageFallback.values ?? [];
  const signatureTrip = data.signatureTrip ?? aboutPageFallback.signatureTrip;
  const showSignatureTrip = signatureTrip?.visible !== false;

  return (
    <div className="bg-cream text-navy min-h-screen pt-32 pb-24 selection:bg-navy selection:text-cream">
      <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto">
        <h1 className="font-serif text-h1 font-light tracking-tight mb-6">{heading}</h1>
        <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
          {subheading}
        </p>
      </section>

      {historyParagraphs.length > 0 ? (
        <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-4xl mx-auto">
          <div className="prose prose-lg prose-navy max-w-none space-y-6 text-lg leading-relaxed opacity-90">
            {historyParagraphs.map((paragraph, i) => (
              <p key={`history-paragraph-${i}`}>{paragraph}</p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-5xl mx-auto">
        <blockquote className="border-l-4 border-gold-start pl-8 py-4">
          <p className="font-serif text-h2 font-light leading-snug mb-6">
            &ldquo;{aboutQuoteFallback.body}&rdquo;
          </p>
          <footer className="text-sm tracking-widest uppercase opacity-70">
            &mdash; {aboutQuoteFallback.attribution}
          </footer>
        </blockquote>
      </section>

      {values.length > 0 ? (
        <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-7xl mx-auto">
          <h2 className="font-serif text-h2 font-light mb-12 border-b border-border-subtle pb-4">
            What Sets Us Apart
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value) => (
              <div key={value._key}>
                <h3 className="font-serif text-2xl mb-4 text-gold-start">
                  {value.title ?? ''}
                </h3>
                <p className="opacity-80 leading-relaxed">{value.body ?? ''}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {showSignatureTrip && signatureTrip ? (
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
          <div className="bg-offwhite border border-border-subtle p-12 md:p-24 text-center rounded-sm">
            <h2 className="font-serif text-h2 font-light mb-4">
              {signatureTrip.headline ?? 'Signature Trip'}
            </h2>
            {signatureTrip.status ? (
              <p className="text-lg opacity-70 uppercase tracking-widest">
                {signatureTrip.status}
              </p>
            ) : null}
            {signatureTrip.body ? (
              <p className="text-lg opacity-80 mt-6 max-w-2xl mx-auto">
                {signatureTrip.body}
              </p>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

async function loadAboutData(): Promise<AboutData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return aboutPageFallback;
  try {
    const { data } = await sanityFetch({ query: aboutPageQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data ?? aboutPageFallback;
  } catch (err) {
    console.error('[about] sanityFetch failed; using fallback:', err);
    return aboutPageFallback;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error('[about] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}
