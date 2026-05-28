import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import { footerFallback } from '@/app/_components/fallbacks/footer';
import { SectionRenderer } from '@/app/_components/sections/section-renderer';
import { buildPageMetadata } from '@/app/_components/seo';
import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery, siteSettingsQuery } from '@/sanity/lib/queries';
import type {
  HomePageQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity/types/generated';

type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;
type HomeSection = NonNullable<
  NonNullable<HomePageQueryResult>['sections']
>[number];
type GroupPhoto = Extract<
  HomeSection,
  { _type: 'missionSection' }
>['groupPhoto'];

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
  const sections = normalizeHomeSections(data?.sections ?? []);

  if (sections.length === 0) {
    return null;
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

function normalizeHomeSections(sections: HomeSection[]): HomeSection[] {
  const legacyGroupPhoto = sections.find(
    (section): section is Extract<HomeSection, { _type: 'heroSection' }> =>
      section._type === 'heroSection',
  )?.groupPhoto;

  if (!legacyGroupPhoto?.asset) return sections;

  return sections.map((section) => {
    if (section._type !== 'missionSection' || section.groupPhoto?.asset) {
      return section;
    }

    return {
      ...section,
      groupPhoto: legacyGroupPhoto as GroupPhoto,
    };
  });
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
