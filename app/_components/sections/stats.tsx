import type { StatsSection } from '@/sanity/types/generated';

import { statsFallback } from '../fallbacks/sections/stats';

import { StaggerGroup, StaggerItem, CountUp } from '../motion/scroll-reveal';

export default function Stats(props: Partial<StatsSection> = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.stats && props.stats.length > 0 ? props : statsFallback;
  const stats = data.stats ?? statsFallback.stats ?? [];

  return (
    <section
      data-section="stats"
      className="bg-cream text-navy py-16 px-4 md:px-8 border-y border-navy/10"
    >
      <div className="mx-auto max-w-7xl">
        <StaggerGroup className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center md:text-left">
          {stats.map((stat) => (
            <StaggerItem
              key={stat._key}
              className="flex flex-col border-b-2 border-[#C5A059] pb-4"
            >
              <div className="font-display text-4xl md:text-5xl lg:text-6xl mb-2 text-navy">
                <CountUp value={stat.value ?? ''} />
              </div>
              <div className="font-sans text-sm md:text-base uppercase tracking-widest text-navy/70">
                {stat.label ?? ''}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
