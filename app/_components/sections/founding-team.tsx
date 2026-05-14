import type { FoundingTeamSection } from '@/sanity/types/generated';

import {
  foundingTeamFallback,
  foundingTeamMembersFallback,
  type FoundingTeamMemberItem,
} from '../fallbacks/sections/founding-team';

type Props = Partial<FoundingTeamSection> & {
  members?: FoundingTeamMemberItem[];
};

export default function FoundingTeam(props: Props = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.heading ? props : foundingTeamFallback;
  const members =
    useSanity && props.members && props.members.length > 0
      ? props.members
      : foundingTeamMembersFallback;

  const heading = data.heading ?? foundingTeamFallback.heading ?? '';
  const subheading = data.subheading;

  return (
    <section
      data-section="team"
      className="bg-cream text-navy py-24 md:py-32 px-4 md:px-8 border-t border-navy/10"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-3xl md:text-5xl mb-16 max-w-2xl">
          {heading}
        </h2>
        {subheading ? (
          <p className="font-sans text-lg text-navy/70 max-w-3xl mb-12 -mt-12">
            {subheading}
          </p>
        ) : null}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {members.map((member) => (
            <div key={member.name} className="flex flex-col group">
              <div className="aspect-square bg-deep flex items-center justify-center mb-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-navy to-deep opacity-80" />
                <span className="relative z-10 font-display text-5xl md:text-6xl bg-gradient-to-br from-[#C5A059] to-[#8B6F38] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                  {member.monogram}
                </span>
              </div>
              <h3 className="font-display text-xl md:text-2xl mb-1">
                {member.name}
              </h3>
              <p className="font-sans text-navy/70 text-sm md:text-base">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
