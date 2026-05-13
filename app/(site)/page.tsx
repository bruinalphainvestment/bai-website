import Hero from '@/app/_components/sections/hero';
import Mission from '@/app/_components/sections/mission';
import Stats from '@/app/_components/sections/stats';
import Values from '@/app/_components/sections/values';
import CommitteesTeaser from '@/app/_components/sections/committees-teaser';
import FoundingTeam from '@/app/_components/sections/founding-team';
import Marquee from '@/app/_components/sections/marquee';
import RecruitmentCTA from '@/app/_components/sections/recruitment-cta';

export default function Home() {
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
