import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import { footerFallback } from '@/app/_components/fallbacks/footer';
import { trainingPageFallback } from '@/app/_components/fallbacks/training-page';
import { resolveOgImages } from '@/app/_components/og-image';
import { sanityFetch } from '@/sanity/lib/live';
import { siteSettingsQuery, trainingPageQuery } from '@/sanity/lib/queries';
import type {
  SiteSettingsQueryResult,
  TrainingPageQueryResult,
} from '@/sanity/types/generated';

type TrainingData = NonNullable<TrainingPageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;

export async function generateMetadata(): Promise<Metadata> {
  const [trainingRaw, settingsRaw] = await Promise.all([
    loadTrainingData(),
    loadSiteSettings(),
  ]);
  const training = stegaClean(trainingRaw);
  const settings = stegaClean(settingsRaw);

  const suffix = settings.titleSuffix ?? ' — Bruin Alpha Investment at UCLA';
  const fallbackTitle = `Training & Rotational Program${suffix}`;
  const title = training.seo?.title ?? fallbackTitle;
  const description =
    training.seo?.description ??
    settings.defaultMetaDescription ??
    trainingPageFallback.seo?.description ??
    '';

  const images = resolveOgImages(training.seo?.ogImage, settings.defaultOgImage, title);

  return {
    title,
    description,
    openGraph: images ? { title, description, images } : { title, description },
  };
}

export default async function TrainingPage() {
  const data = await loadTrainingData();
  const heading = data.hero?.heading ?? trainingPageFallback.hero?.heading ?? 'The Rotational Program';
  const subheading = data.hero?.subheading ?? trainingPageFallback.hero?.subheading ?? '';
  const intro = data.intro ?? trainingPageFallback.intro;
  const curriculum = data.curriculum ?? trainingPageFallback.curriculum ?? [];

  return (
    <div className="bg-cream text-navy min-h-screen pt-32 pb-24">
      <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto">
        <h1 className="font-serif text-h1 font-light tracking-tight mb-6">{heading}</h1>
        <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
          {subheading}
        </p>
        {intro ? (
          <p className="mt-6 text-lg leading-relaxed opacity-80 max-w-3xl">
            {intro}
          </p>
        ) : null}
      </section>

      {curriculum.length > 0 ? (
        <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-7xl mx-auto">
          <h2 className="font-serif text-h2 font-light mb-12 border-b border-border-subtle pb-4">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {curriculum.map((entry, i) => (
              <div
                key={entry._key}
                className="relative bg-offwhite p-6 border border-border-subtle flex flex-col h-full group hover:border-gold-start transition-colors"
              >
                <span className="text-sm font-bold tracking-widest text-gold-start mb-4 block uppercase">
                  {entry.week ?? ''}
                </span>
                <h3 className="font-serif text-xl mb-3">{entry.topic ?? ''}</h3>
                <p className="opacity-80 text-sm leading-relaxed mt-auto">
                  {entry.body ?? ''}
                </p>
                {i !== curriculum.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-4 border-t border-dashed border-border-subtle z-10" />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-h2 font-light mb-8 border-b border-border-subtle pb-4">
              Class Hierarchy
            </h2>
            <div className="flex flex-col space-y-4">
              <div className="p-6 bg-navy text-cream flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-2xl mb-1">Analyst</h3>
                  <p className="opacity-70 text-sm">Year 1</p>
                </div>
                <span className="text-gold-start text-xl">&uarr;</span>
              </div>
              <div className="p-6 bg-navy/90 text-cream flex items-center justify-between ml-4">
                <div>
                  <h3 className="font-serif text-2xl mb-1">Associate</h3>
                  <p className="opacity-70 text-sm">Year 2</p>
                </div>
                <span className="text-gold-start text-xl">&uarr;</span>
              </div>
              <div className="p-6 bg-navy/80 text-cream flex items-center justify-between ml-8">
                <div>
                  <h3 className="font-serif text-2xl mb-1">Director</h3>
                  <p className="opacity-70 text-sm">Committee Lead</p>
                </div>
                <span className="text-gold-start text-xl">✦</span>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-h2 font-light mb-8 border-b border-border-subtle pb-4">
                Sample Week
              </h2>
              <div className="bg-offwhite p-8 border border-border-subtle">
                <ul className="space-y-6">
                  <li className="flex items-start">
                    <span className="text-gold-start font-bold mr-4 w-12 shrink-0">1 hr</span>
                    <div>
                      <h4 className="font-bold mb-1">Committee Meeting</h4>
                      <p className="opacity-80 text-sm">
                        Synchronous instruction, project alignment, and progress reviews.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-gold-start font-bold mr-4 w-12 shrink-0">2 hr</span>
                    <div>
                      <h4 className="font-bold mb-1">Asynchronous Work</h4>
                      <p className="opacity-80 text-sm">
                        Independent research, modeling, and deliverable preparation.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-h2 font-light mb-4 border-b border-border-subtle pb-4">
                Assessment
              </h2>
              <p className="opacity-80 leading-relaxed">
                Members complete a 30-page consolidated study guide prior to recruiting interviews, ensuring technical readiness across all major financial disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
        <div className="bg-navy text-cream p-12 md:p-16 border-t-4 border-gold-start">
          <h2 className="font-serif text-h2 font-light mb-4">Quarterly All-Club Project</h2>
          <p className="text-lg opacity-80 max-w-3xl leading-relaxed">
            Beyond committee work, the entire organization unites once per quarter for a comprehensive, cross-disciplinary project. This ensures continued collaboration between groups and reinforces the interconnected nature of the financial ecosystem.
          </p>
        </div>
      </section>
    </div>
  );
}

async function loadTrainingData(): Promise<TrainingData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return trainingPageFallback;
  try {
    const { data } = await sanityFetch({ query: trainingPageQuery });
    return data ? (stegaClean(data) as TrainingData) : trainingPageFallback;
  } catch (err) {
    console.error('[training] sanityFetch failed; using fallback:', err);
    return trainingPageFallback;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error('[training] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}
