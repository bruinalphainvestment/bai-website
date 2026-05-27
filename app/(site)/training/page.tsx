import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import { footerFallback } from '@/app/_components/fallbacks/footer';
import { trainingPageFallback } from '@/app/_components/fallbacks/training-page';
import {
  FadeUp,
  StaggerGroup,
  StaggerItem,
} from '@/app/_components/motion/scroll-reveal';
import { buildPageMetadata } from '@/app/_components/seo';
import { sanityFetch } from '@/sanity/lib/live';
import { siteSettingsQuery, trainingPageQuery } from '@/sanity/lib/queries';
import type {
  SiteSettingsQueryResult,
  TrainingPageQueryResult,
} from '@/sanity/types/generated';

type TrainingData = NonNullable<TrainingPageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;

const hierarchyWidths = ['w-full', 'w-[85%]', 'w-[70%]', 'w-[55%]'];
const hierarchyBackgrounds = [
  'bg-navy',
  'bg-navy/90',
  'bg-navy/80',
  'bg-navy/70',
];

export async function generateMetadata(): Promise<Metadata> {
  const [trainingRaw, settingsRaw] = await Promise.all([
    loadTrainingData(),
    loadSiteSettings(),
  ]);
  const training = stegaClean(trainingRaw);
  const settings = stegaClean(settingsRaw);

  return buildPageMetadata({
    path: '/training',
    seo: training.seo,
    settings,
    fallbackTitle: 'Training & Rotational Program',
    fallbackDescription: trainingPageFallback.seo?.description ?? undefined,
  });
}

export default async function TrainingPage() {
  const data = await loadTrainingData();
  const heading =
    data.hero?.heading ??
    trainingPageFallback.hero?.heading ??
    'The Rotational Program';
  const subheading =
    data.hero?.subheading ?? trainingPageFallback.hero?.subheading ?? '';
  const intro = data.intro ?? trainingPageFallback.intro;
  const curriculum = data.curriculum ?? trainingPageFallback.curriculum ?? [];
  const curriculumHeading =
    data.curriculumHeading ?? trainingPageFallback.curriculumHeading ?? '';
  const classHierarchy =
    data.classHierarchy ?? trainingPageFallback.classHierarchy;
  const hierarchyTiers = classHierarchy?.tiers ?? [];
  const sampleWeek = data.sampleWeek ?? trainingPageFallback.sampleWeek;
  const sampleWeekItems = sampleWeek?.items ?? [];
  const assessment = data.assessment ?? trainingPageFallback.assessment;
  const quarterlyProject =
    data.quarterlyProject ?? trainingPageFallback.quarterlyProject;

  return (
    <div className="bg-cream text-navy min-h-screen pt-32 pb-24">
      <section className="mx-auto mb-24 max-w-7xl px-6 md:px-12 lg:px-24">
        <StaggerGroup trigger="mount">
          <StaggerItem>
            <h1 className="text-h1 mb-6 font-serif font-light tracking-tight">
              {heading}
            </h1>
          </StaggerItem>
          <StaggerItem>
            <p className="max-w-3xl text-xl leading-relaxed font-light md:text-2xl">
              {subheading}
            </p>
          </StaggerItem>
          {intro ? (
            <StaggerItem>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed opacity-80">
                {intro}
              </p>
            </StaggerItem>
          ) : null}
        </StaggerGroup>
      </section>

      {curriculum.length > 0 ? (
        <section className="mx-auto mb-32 max-w-7xl px-6 md:px-12 lg:px-24">
          <FadeUp>
            <h2 className="text-h2 border-border-subtle mb-12 border-b pb-4 font-serif font-light">
              {curriculumHeading}
            </h2>
          </FadeUp>
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-5">
            {curriculum.map((entry, i) => (
              <StaggerItem
                key={entry._key}
                className="bg-offwhite border-border-subtle group hover:border-gold-start relative flex h-full flex-col border p-6 transition-colors"
              >
                <span className="text-gold-start mb-4 block text-sm font-bold tracking-widest uppercase">
                  {entry.week ?? ''}
                </span>
                <h3 className="mb-3 font-serif text-xl">{entry.topic ?? ''}</h3>
                <p className="mt-auto text-sm leading-relaxed opacity-80">
                  {entry.body ?? ''}
                </p>
                {i !== curriculum.length - 1 && (
                  <div className="border-border-subtle absolute top-1/2 -right-4 z-10 hidden w-4 border-t border-dashed md:block" />
                )}
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      ) : null}

      <section className="mx-auto mb-32 max-w-7xl px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {classHierarchy && hierarchyTiers.length > 0 ? (
            <div>
              <FadeUp>
                <h2 className="text-h2 border-border-subtle mb-8 border-b pb-4 font-serif font-light">
                  {classHierarchy.heading ?? ''}
                </h2>
              </FadeUp>
              <StaggerGroup className="flex flex-col items-end space-y-4">
                {hierarchyTiers.map((tier, index) => (
                  <StaggerItem
                    key={tier._key}
                    className={`p-6 ${hierarchyBackgrounds[index] ?? 'bg-navy'} text-cream flex items-center justify-between ${hierarchyWidths[index] ?? 'w-full'}`}
                  >
                    <div>
                      <h3 className="mb-1 font-serif text-2xl">
                        {tier.title ?? ''}
                      </h3>
                      <p className="text-sm opacity-70">
                        {tier.subtitle ?? ''}
                      </p>
                    </div>
                    <span className="text-gold-start text-xl">
                      {index === 0 ? '✦' : '↑'}
                    </span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          ) : null}

          <div className="space-y-12">
            {sampleWeek && sampleWeekItems.length > 0 ? (
              <div>
                <FadeUp>
                  <h2 className="text-h2 border-border-subtle mb-8 border-b pb-4 font-serif font-light">
                    {sampleWeek.heading ?? ''}
                  </h2>
                </FadeUp>
                <FadeUp>
                  <div className="bg-offwhite border-border-subtle border p-8">
                    <StaggerGroup as="ul" className="space-y-6">
                      {sampleWeekItems.map((item) => (
                        <StaggerItem
                          key={item._key}
                          as="li"
                          className="flex items-start"
                        >
                          <span className="text-gold-start mr-4 w-12 shrink-0 font-bold">
                            {item.duration ?? ''}
                          </span>
                          <div>
                            <h4 className="mb-1 font-bold">
                              {item.title ?? ''}
                            </h4>
                            <p className="text-sm opacity-80">
                              {item.body ?? ''}
                            </p>
                          </div>
                        </StaggerItem>
                      ))}
                    </StaggerGroup>
                  </div>
                </FadeUp>
              </div>
            ) : null}

            {assessment ? (
              <FadeUp>
                <div>
                  <h2 className="text-h2 border-border-subtle mb-4 border-b pb-4 font-serif font-light">
                    {assessment.heading ?? ''}
                  </h2>
                  <p className="leading-relaxed opacity-80">
                    {assessment.body ?? ''}
                  </p>
                </div>
              </FadeUp>
            ) : null}
          </div>
        </div>
      </section>

      {quarterlyProject ? (
        <FadeUp>
          <section className="mx-auto max-w-7xl px-6 md:px-12 lg:px-24">
            <div className="bg-navy text-cream border-gold-start border-t-4 p-12 md:p-16">
              <h2 className="text-h2 mb-4 font-serif font-light">
                {quarterlyProject.heading ?? ''}
              </h2>
              <p className="max-w-3xl text-lg leading-relaxed opacity-80">
                {quarterlyProject.body ?? ''}
              </p>
            </div>
          </section>
        </FadeUp>
      ) : null}
    </div>
  );
}

async function loadTrainingData(): Promise<TrainingData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true')
    return trainingPageFallback;
  try {
    const { data } = await sanityFetch({ query: trainingPageQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data ?? trainingPageFallback;
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
