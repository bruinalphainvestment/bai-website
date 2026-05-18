import Image from 'next/image';

import { urlForImage } from '@/sanity/lib/imageUrl';
import { sanityFetch } from '@/sanity/lib/live';
import { allFoundingMembersQuery } from '@/sanity/lib/queries';
import type {
  AllFoundingMembersQueryResult,
  FoundingTeamSection,
} from '@/sanity/types/generated';

import {
  foundingTeamFallback,
  foundingTeamMembersFallback,
  type FoundingTeamMemberItem,
} from '../fallbacks/sections/founding-team';

import { FadeUp, StaggerGroup, StaggerItem } from '../motion/scroll-reveal';

type FoundingMemberDoc = AllFoundingMembersQueryResult[number];

type DisplayMember = FoundingTeamMemberItem & {
  key: string;
  headshotUrl: string | null;
};

type Props = Partial<FoundingTeamSection>;

export default async function FoundingTeam(props: Props = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.heading ? props : foundingTeamFallback;

  const heading = data.heading ?? foundingTeamFallback.heading ?? '';
  const subheading = data.subheading;

  const members = await loadMembers();

  return (
    <section
      data-section="team"
      className="bg-cream text-navy py-24 md:py-32 px-4 md:px-8 border-t border-navy/10"
    >
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <h2 className="font-display text-3xl md:text-5xl mb-16 max-w-2xl">
            {heading}
          </h2>
        </FadeUp>
        {subheading ? (
          <FadeUp>
            <p className="font-sans text-lg text-navy/70 max-w-3xl mb-12 -mt-12">
              {subheading}
            </p>
          </FadeUp>
        ) : null}
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {members.map((member) => (
            <StaggerItem key={member.key} className="flex flex-col group">
              <div className="aspect-square bg-deep mb-6 overflow-hidden relative">
                {member.headshotUrl ? (
                  <Image
                    src={member.headshotUrl}
                    alt={member.name ? `${member.name} headshot` : 'Founding team member headshot'}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-navy to-deep opacity-80" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-5xl md:text-6xl bg-gradient-to-br from-[#C5A059] to-[#8B6F38] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                        {member.monogram}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <h3 className="font-display text-xl md:text-2xl mb-1">
                {member.name}
              </h3>
              <p className="font-sans text-navy/70 text-sm md:text-base">
                {member.role}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

async function loadMembers(): Promise<DisplayMember[]> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') {
    return foundingTeamMembersFallback.map((m, i) => ({
      ...m,
      key: `fallback-${i}-${m.name}`,
      headshotUrl: null,
    }));
  }
  try {
    const { data } = await sanityFetch({ query: allFoundingMembersQuery });
    if (!data || data.length === 0) {
      return foundingTeamMembersFallback.map((m, i) => ({
        ...m,
        key: `fallback-${i}-${m.name}`,
        headshotUrl: null,
      }));
    }
    return data.map(toDisplayMember);
  } catch (err) {
    console.error('[FoundingTeam] sanityFetch failed; using fallback:', err);
    return foundingTeamMembersFallback.map((m, i) => ({
      ...m,
      key: `fallback-${i}-${m.name}`,
      headshotUrl: null,
    }));
  }
}

function toDisplayMember(member: FoundingMemberDoc): DisplayMember {
  const fullName = [member.firstName, member.lastName].filter(Boolean).join(' ').trim();
  const monogram = member.monogramOverride ?? deriveMonogram(member.firstName, member.lastName);
  const headshotUrl =
    member.photoReleaseObtained === true && member.headshot
      ? urlForImage(member.headshot).width(600).height(600).fit('crop').auto('format').url()
      : null;
  return {
    key: member._id,
    name: fullName || 'TBD',
    role: member.role ?? '',
    monogram,
    headshotUrl,
  };
}

function deriveMonogram(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
): string {
  const first = (firstName ?? '').trim();
  const last = (lastName ?? '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (last) return last.slice(0, 2).toUpperCase();
  return '?';
}
