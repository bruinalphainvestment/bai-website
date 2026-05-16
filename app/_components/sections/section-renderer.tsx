import type { HomePage } from '@/sanity/types/generated';

import CommitteesTeaser from './committees-teaser';
import FoundingTeam from './founding-team';
import Hero from './hero';
import Marquee from './marquee';
import Mission from './mission';
import RecruitmentCTA from './recruitment-cta';
import Stats from './stats';
import Values from './values';

type Section = NonNullable<HomePage['sections']>[number];

type Props = {
  section: Section;
};

export function SectionRenderer({ section }: Props) {
  switch (section._type) {
    case 'heroSection':
      return <Hero {...section} />;
    case 'missionSection':
      return <Mission {...section} />;
    case 'valuesSection':
      return <Values {...section} />;
    case 'statsSection':
      return <Stats {...section} />;
    case 'marqueeSection':
      return <Marquee items={section.items ?? []} />;
    case 'ctaSection':
      return <RecruitmentCTA {...section} />;
    case 'foundingTeamSection':
      return <FoundingTeam {...section} />;
    case 'committeesTeaserSection':
      return <CommitteesTeaser {...section} />;
    default: {
      const _exhaustiveCheck: never = section;
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[SectionRenderer] Unknown section type: ${
            (_exhaustiveCheck as { _type?: string })._type
          }`,
        );
      }
      return null;
    }
  }
}
