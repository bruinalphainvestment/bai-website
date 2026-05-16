import { SectionRenderer } from '@/app/_components/sections/section-renderer';
import CommitteesTeaser from '@/app/_components/sections/committees-teaser';
import FoundingTeam from '@/app/_components/sections/founding-team';
import Hero from '@/app/_components/sections/hero';
import Marquee from '@/app/_components/sections/marquee';
import Mission from '@/app/_components/sections/mission';
import RecruitmentCTA from '@/app/_components/sections/recruitment-cta';
import Stats from '@/app/_components/sections/stats';
import Values from '@/app/_components/sections/values';
import { sanityFetch } from '@/sanity/lib/live';
import { homePageQuery } from '@/sanity/lib/queries';
import type { HomePageQueryResult } from '@/sanity/types/generated';

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
    /* stega-encoded data flows directly into JSX so Visual Editing
       overlays can attribute each rendered string to its Sanity source. */
    return data ?? null;
  } catch (err) {
    console.error('[Home] sanityFetch failed; rendering fallback:', err);
    return null;
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
