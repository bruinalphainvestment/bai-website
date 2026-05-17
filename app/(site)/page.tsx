import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import { footerFallback } from '@/app/_components/fallbacks/footer';
import { SectionRenderer } from '@/app/_components/sections/section-renderer';
import CommitteesTeaser from '@/app/_components/sections/committees-teaser';
import FoundingTeam from '@/app/_components/sections/founding-team';
import Hero from '@/app/_components/sections/hero';
import Marquee from '@/app/_components/sections/marquee';
import Mission from '@/app/_components/sections/mission';
import RecruitmentCTA from '@/app/_components/sections/recruitment-cta';
import Stats from '@/app/_components/sections/stats';
import Values from '@/app/_components/sections/values';
import { buildPageMetadata } from '@/app/_components/seo';
import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import type {
  HomePageQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity/types/generated';

type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;

export async function generateMetadata(): Promise<Metadata> {
  const [homeRaw, settingsRaw] = await Promise.all([
    loadHomeData(),
    loadSiteSettings(),
  ]);
  const home = homeRaw ? stegaClean(homeRaw) : null;
  const settings = stegaClean(settingsRaw);

  const brand = settings.brandName ?? 'Bruin Alpha Investment';
  return buildPageMetadata({
    path: '/',
    seo: home?.seo,
    settings,
    fallbackTitle: brand,
    fallbackDescription: settings.defaultMetaDescription ?? undefined,
  });
}

export default async function Home() {
  const data = await loadHomeData();
  const sections = data?.sections ?? [];

  if (sections.length === 0) {
    return <FallbackHome />;
  }

  return (
    <>
      {sections.map((section, index) => (
        <SectionRenderer
          key={section._key ?? `section-${index}`}
          section={section}
        />
      ))}
    </>
  );
}

async function loadHomeData(): Promise<HomePageQueryResult | null> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return null;
  try {
    const { data } = await sanityFetch({ query: homePageQuery });
    return data ?? null;
  } catch (err) {
    console.error('[Home] sanityFetch failed; rendering fallback:', err);
    return null;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error('[Home] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}

function FallbackHome() {
  return (
    <>
      <Hero />
      <Mission />
      <Stats />
      <Values />
      <CommitteesTeaser />
      <FoundingTeam />
      <Marquee />
      <RecruitmentCTA />
    </>
  );
}
