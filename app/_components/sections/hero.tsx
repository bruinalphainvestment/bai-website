import type { HeroSection } from '@/sanity/types/generated';

import { heroFallback } from '../fallbacks/sections/hero';

import { StaggerGroup, StaggerItem } from '../motion/scroll-reveal';

export default function Hero(props: Partial<HeroSection> = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.headline ? props : heroFallback;

  const headline = data.headline ?? heroFallback.headline ?? '';
  const subheadline = data.subheadline ?? heroFallback.subheadline ?? '';
  const eyebrow = data.eyebrow ?? heroFallback.eyebrow;

  const headlineParts = parseGoldAccent(headline);

  return (
    <section
      data-section="hero"
      className="relative flex min-h-screen flex-col items-center justify-center bg-deep text-cream pt-20"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-deep to-navy opacity-80" />
      <StaggerGroup trigger="mount" className="relative z-10 flex flex-col items-center text-center px-4">
        {eyebrow ? (
          <StaggerItem className="mb-4">
            <span className="font-mono uppercase tracking-widest text-sm text-cream/70">
              {eyebrow}
            </span>
          </StaggerItem>
        ) : null}
        <StaggerItem className="mb-6">
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight max-w-6xl">
            {headlineParts.before}
            {headlineParts.accent ? (
              <span className="bg-gradient-to-r from-[#C5A059] to-[#8B6F38] bg-clip-text text-transparent">
                {' '}{headlineParts.accent}{' '}
              </span>
            ) : null}
            {headlineParts.after}
          </h1>
        </StaggerItem>
        <StaggerItem>
          <p className="font-sans text-xl md:text-2xl text-cream/80 max-w-2xl font-light">
            {subheadline}
          </p>
        </StaggerItem>
      </StaggerGroup>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-cream/50 animate-bounce">
        <span className="text-sm uppercase tracking-widest mb-2 font-mono">Scroll</span>
        <div className="w-[1px] h-12 bg-cream/30"></div>
      </div>
    </section>
  );
}

function parseGoldAccent(headline: string): { before: string; accent: string; after: string } {
  const words = headline.split(' ');
  if (words.length < 3) return { before: headline, accent: '', after: '' };
  return {
    before: words[0] ?? '',
    accent: words[1] ?? '',
    after: words.slice(2).join(' '),
  };
}
