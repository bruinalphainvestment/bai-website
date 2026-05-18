import type { Metadata } from 'next';
import Image from 'next/image';
import { stegaClean } from 'next-sanity';

import { footerFallback } from '@/app/_components/fallbacks/footer';
import {
  foundingMembersFallback,
  teamPageFallback,
} from '@/app/_components/fallbacks/team-page';
import { FadeUp, StaggerGroup, StaggerItem } from '@/app/_components/motion/scroll-reveal';
import { buildPageMetadata } from '@/app/_components/seo';
import { urlForImage } from '@/sanity/lib/imageUrl';
import { sanityFetch } from '@/sanity/lib/live';
import {
  allFoundingMembersQuery,
  siteSettingsQuery,
  teamPageQuery,
} from '@/sanity/lib/queries';
import type {
  AllFoundingMembersQueryResult,
  SiteSettingsQueryResult,
  TeamPageQueryResult,
} from '@/sanity/types/generated';

type TeamPageData = NonNullable<TeamPageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;
type FoundingMember = AllFoundingMembersQueryResult[number];

export async function generateMetadata(): Promise<Metadata> {
  const [pageRaw, settingsRaw] = await Promise.all([
    loadTeamPageData(),
    loadSiteSettings(),
  ]);
  const page = stegaClean(pageRaw);
  const settings = stegaClean(settingsRaw);

  return buildPageMetadata({
    path: '/team',
    seo: page.seo,
    settings,
    fallbackTitle: 'Team',
    fallbackDescription: teamPageFallback.seo?.description ?? undefined,
  });
}

export default async function TeamPage() {
  const [page, members] = await Promise.all([
    loadTeamPageData(),
    loadFoundingMembers(),
  ]);

  const heading = page.hero?.heading ?? teamPageFallback.hero?.heading ?? 'The Team';
  const subheading = page.hero?.subheading ?? teamPageFallback.hero?.subheading ?? '';
  const intro = page.intro ?? teamPageFallback.intro;
  const foundingHeading = page.foundingClassHeading ?? teamPageFallback.foundingClassHeading ?? 'Founding Class';

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
            {foundingHeading}
          </h2>
        </FadeUp>
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {members.map((member) => (
            <StaggerItem key={member._id}>
              <FoundingMemberCard member={member} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

    </div>
  );
}

function FoundingMemberCard({ member }: { member: FoundingMember }) {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ').trim();
  const monogram = member.monogramOverride ?? deriveMonogram(member.firstName, member.lastName);
  const headshotUrl =
    member.photoReleaseObtained === true && member.headshot
      ? urlForImage(member.headshot).width(800).height(800).fit('crop').auto('format').url()
      : null;

  return (
    <div className="flex flex-col group">
      <div className="aspect-square bg-deep mb-6 overflow-hidden relative">
        {headshotUrl ? (
          <Image
            src={headshotUrl}
            alt={fullName ? `${fullName} headshot` : 'Founding team member headshot'}
            fill
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-navy to-deep opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-5xl md:text-6xl bg-gradient-to-br from-[#C5A059] to-[#8B6F38] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                {monogram}
              </span>
            </div>
          </>
        )}
      </div>
      <h3 className="font-display text-xl md:text-2xl mb-1">{fullName || 'TBD'}</h3>
      {member.role ? (
        <p className="font-sans font-medium text-navy/90 text-sm md:text-base mb-3">
          {member.role}
        </p>
      ) : null}
      {member.bio ? (
        <p className="font-sans text-navy/70 text-sm leading-relaxed">{member.bio}</p>
      ) : null}
    </div>
  );
}

function deriveMonogram(firstName: string | null | undefined, lastName: string | null | undefined): string {
  const first = (firstName ?? '').trim();
  const last = (lastName ?? '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (last) return last.slice(0, 2).toUpperCase();
  return '?';
}

async function loadTeamPageData(): Promise<TeamPageData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return teamPageFallback;
  try {
    const { data } = await sanityFetch({ query: teamPageQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data ?? teamPageFallback;
  } catch (err) {
    console.error('[team] page fetch failed; using fallback:', err);
    return teamPageFallback;
  }
}

async function loadFoundingMembers(): Promise<AllFoundingMembersQueryResult> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return foundingMembersFallback;
  try {
    const { data } = await sanityFetch({ query: allFoundingMembersQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data && data.length > 0 ? data : foundingMembersFallback;
  } catch (err) {
    console.error('[team] members fetch failed; using fallback:', err);
    return foundingMembersFallback;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error('[team] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}
