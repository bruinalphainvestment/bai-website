import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import { footerFallback } from '@/app/_components/fallbacks/footer';
import { joinPageFallback } from '@/app/_components/fallbacks/join-page';
import { FadeUp, StaggerGroup, StaggerItem } from '@/app/_components/motion/scroll-reveal';
import { buildPageMetadata } from '@/app/_components/seo';
import { sanityFetch } from '@/sanity/lib/live';
import { joinPageQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import type {
  JoinPageQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity/types/generated';

type JoinData = NonNullable<JoinPageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;

const APPLICATION_STEPS = ['Apply', 'Coffee Chat', 'Interview', 'Decision'] as const;

export async function generateMetadata(): Promise<Metadata> {
  const [joinRaw, settingsRaw] = await Promise.all([
    loadJoinData(),
    loadSiteSettings(),
  ]);
  const join = stegaClean(joinRaw);
  const settings = stegaClean(settingsRaw);

  return buildPageMetadata({
    path: '/join',
    seo: join.seo,
    settings,
    fallbackTitle: 'Join',
    fallbackDescription: joinPageFallback.seo?.description ?? undefined,
  });
}

export default async function JoinPage() {
  const data = await loadJoinData();
  const settings = await loadSiteSettings();

  const heading = data.hero?.heading ?? joinPageFallback.hero?.heading ?? 'Join the Cohort';
  const subheading = data.hero?.subheading ?? joinPageFallback.hero?.subheading ?? '';
  const intro = data.intro ?? joinPageFallback.intro;
  const timeline = data.timeline ?? joinPageFallback.timeline ?? [];
  const applicationForm = data.applicationForm ?? joinPageFallback.applicationForm;
  const faqs = data.faqs ?? joinPageFallback.faqs ?? [];

  const clubEmail = settings.clubEmail ?? footerFallback.clubEmail ?? '';
  const instagramHref = settings.instagramUrl ?? footerFallback.instagramUrl ?? '#';
  const linkedinHref = settings.linkedinUrl ?? footerFallback.linkedinUrl ?? '#';

  return (
    <div className="min-h-screen bg-cream text-navy pt-32 pb-24">
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20 md:mb-32">
        <StaggerGroup trigger="mount">
          <StaggerItem>
            <h1 className="font-display text-5xl md:text-7xl mb-6">{heading}</h1>
          </StaggerItem>
          <StaggerItem>
            <p className="font-sans text-xl md:text-2xl text-navy/80 max-w-3xl">
              {subheading}
            </p>
          </StaggerItem>
          {intro ? (
            <StaggerItem>
              <p className="font-sans mt-6 text-lg text-navy/70 max-w-3xl">{intro}</p>
            </StaggerItem>
          ) : null}
        </StaggerGroup>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <FadeUp>
          <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
            Application Process
          </h2>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 mb-16">
          {APPLICATION_STEPS.map((step, index) => (
            <StaggerItem
              key={step}
              className="bg-navy text-cream p-8 rounded-sm relative overflow-hidden group"
            >
              <div className="text-cream/10 font-display text-8xl absolute -bottom-4 -right-2 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                0{index + 1}
              </div>
              <h3 className="font-display text-2xl relative z-10">{step}</h3>
            </StaggerItem>
          ))}
        </StaggerGroup>

        {timeline.length > 0 ? (
          <FadeUp>
            <div className="bg-deep/5 p-8 md:p-12 rounded-sm mb-16">
              <h3 className="font-display text-2xl mb-6">Recruitment Timeline</h3>
              <StaggerGroup as="ul" className="space-y-6">
                {timeline.map((step, i) => (
                  <StaggerItem
                    key={step._key}
                    as="li"
                    className={`flex flex-col md:flex-row md:items-center gap-2 md:gap-8 ${i !== timeline.length - 1 ? 'border-b border-navy/10 pb-4' : 'pb-4'}`}
                  >
                    <span className="font-sans font-medium text-navy/80 md:w-1/4">
                      {step.title ?? ''}
                    </span>
                    <span className="font-sans text-navy">{step.body ?? ''}</span>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </FadeUp>
        ) : null}
      </section>

      {applicationForm ? (
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
          <FadeUp>
            <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
              {applicationForm.heading ?? 'Application Form'}
            </h2>
          </FadeUp>
          <FadeUp>
            <div className="aspect-[4/3] md:aspect-[21/9] w-full bg-cream border border-navy/10 rounded-sm relative overflow-hidden flex items-center justify-center flex-col">
              <p className="font-display text-2xl md:text-3xl mb-4">
                {applicationForm.body ?? ''}
              </p>
              <a
                href={applicationForm.formUrl ?? '#'}
                className="font-sans border border-navy px-6 py-3 hover:bg-navy hover:text-cream transition-colors duration-300"
              >
                Link to Application
              </a>
              <iframe
                src="about:blank"
                data-tally-placeholder="true"
                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                title="Application Form"
              />
            </div>
          </FadeUp>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
          <FadeUp>
            <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
              FAQ
            </h2>
          </FadeUp>
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {faqs.map((faq) => (
              <StaggerItem key={faq._key} className="flex flex-col">
                <h3 className="font-display text-xl mb-3">{faq.question ?? ''}</h3>
                <p className="font-sans text-navy/70 leading-relaxed">
                  {faq.answer ?? ''}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </section>
      ) : null}

      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <FadeUp>
          <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
            Get in Touch
          </h2>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StaggerItem className="bg-deep/5 p-8 rounded-sm hover:bg-deep/10 transition-colors duration-300">
            <span className="block font-sans text-sm text-navy/60 mb-2 uppercase tracking-wider">
              Email
            </span>
            <a
              href={clubEmail ? `mailto:${clubEmail}` : '#'}
              className="font-display text-lg md:text-xl underline underline-offset-4 decoration-navy/30 hover:decoration-navy transition-colors"
            >
              {clubEmail || 'Contact us'}
            </a>
          </StaggerItem>
          <StaggerItem className="bg-deep/5 p-8 rounded-sm hover:bg-deep/10 transition-colors duration-300">
            <span className="block font-sans text-sm text-navy/60 mb-2 uppercase tracking-wider">
              Instagram
            </span>
            <a
              href={instagramHref}
              className="font-display text-lg md:text-xl underline underline-offset-4 decoration-navy/30 hover:decoration-navy transition-colors"
            >
              @bruinalphainvestment
            </a>
          </StaggerItem>
          <StaggerItem className="bg-deep/5 p-8 rounded-sm hover:bg-deep/10 transition-colors duration-300">
            <span className="block font-sans text-sm text-navy/60 mb-2 uppercase tracking-wider">
              LinkedIn
            </span>
            <a
              href={linkedinHref}
              className="font-display text-lg md:text-xl underline underline-offset-4 decoration-navy/30 hover:decoration-navy transition-colors"
            >
              Bruin Alpha Investment
            </a>
          </StaggerItem>
        </StaggerGroup>
      </section>
    </div>
  );
}

async function loadJoinData(): Promise<JoinData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return joinPageFallback;
  try {
    const { data } = await sanityFetch({ query: joinPageQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data ?? joinPageFallback;
  } catch (err) {
    console.error('[join] sanityFetch failed; using fallback:', err);
    return joinPageFallback;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error('[join] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}
