import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import { footerFallback } from '@/app/_components/fallbacks/footer';
import {
  foundingMembersFallback,
  teamPageFallback,
} from '@/app/_components/fallbacks/team-page';
import { resolveOgImages } from '@/app/_components/og-image';
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

  const suffix = settings.titleSuffix ?? ' — Bruin Alpha Investment at UCLA';
  const fallbackTitle = `Team${suffix}`;
  const title = page.seo?.title ?? fallbackTitle;
  const description =
    page.seo?.description ??
    settings.defaultMetaDescription ??
    teamPageFallback.seo?.description ??
    '';

  const images = resolveOgImages(page.seo?.ogImage, settings.defaultOgImage, title);

  return {
    title,
    description,
    openGraph: images ? { title, description, images } : { title, description },
  };
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
  const membersHeading = page.membersHeading ?? teamPageFallback.membersHeading ?? 'Members';
  const membersPlaceholder = page.membersPlaceholder ?? teamPageFallback.membersPlaceholder ?? '';
  const alumniHeading = page.alumniHeading ?? teamPageFallback.alumniHeading ?? 'Alumni';
  const alumniPlaceholder = page.alumniPlaceholder ?? teamPageFallback.alumniPlaceholder ?? '';

  return (
    <div className="min-h-screen bg-cream text-navy pt-32 pb-24">
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20 md:mb-32">
        <h1 className="font-display text-5xl md:text-7xl mb-6">{heading}</h1>
        <p className="font-sans text-xl md:text-2xl text-navy/80 max-w-3xl">
          {subheading}
        </p>
        {intro ? (
          <p className="font-sans mt-6 text-lg text-navy/70 max-w-3xl">{intro}</p>
        ) : null}
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          {foundingHeading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {members.map((member) => (
            <FoundingMemberCard key={member._id} member={member} />
          ))}
        </div>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-8">{membersHeading}</h2>
        <div className="bg-cream border border-navy/10 p-8 md:p-12 text-center rounded-sm">
          <p className="font-sans text-lg text-navy/70">{membersPlaceholder}</p>
        </div>
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl md:text-4xl mb-8">{alumniHeading}</h2>
        <div className="bg-cream border border-navy/10 p-8 md:p-12 text-center rounded-sm">
          <p className="font-sans text-lg text-navy/70">{alumniPlaceholder}</p>
        </div>
      </section>
    </div>
  );
}

function FoundingMemberCard({ member }: { member: FoundingMember }) {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ').trim();
  const monogram = member.monogramOverride ?? deriveMonogram(member.firstName, member.lastName);
  return (
    <div className="flex flex-col group">
      <div className="aspect-square bg-deep flex items-center justify-center mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-navy to-deep opacity-80" />
        <span className="relative z-10 font-display text-5xl md:text-6xl bg-gradient-to-br from-[#C5A059] to-[#8B6F38] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
          {monogram}
        </span>
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
