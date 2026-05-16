import Link from 'next/link';

import type { CtaSection } from '@/sanity/types/generated';

import { recruitmentCtaFallback } from '../fallbacks/sections/recruitment-cta';

import { StaggerGroup, StaggerItem } from '../motion/scroll-reveal';

type Props = Partial<CtaSection> & {
  primaryHref?: string;
};

export default function RecruitmentCTA(props: Props = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.heading ? props : recruitmentCtaFallback;

  const heading = data.heading ?? recruitmentCtaFallback.heading ?? '';
  const body = data.body ?? recruitmentCtaFallback.body ?? '';
  const primaryLabel = data.ctaLabel ?? recruitmentCtaFallback.ctaLabel ?? 'Apply Now';
  const primaryHref = props.primaryHref ?? '#';
  const secondaryLabel =
    data.secondaryCtaLabel ?? recruitmentCtaFallback.secondaryCtaLabel ?? 'Email Us';
  const secondaryHref =
    data.secondaryCtaHref ?? recruitmentCtaFallback.secondaryCtaHref ?? '#';

  return (
    <section data-section="cta" className="bg-cream text-navy py-32 px-4 md:px-8">
      <StaggerGroup className="mx-auto max-w-4xl text-center">
        <StaggerItem>
          <h2 className="font-display text-4xl md:text-6xl mb-6">{heading}</h2>
        </StaggerItem>
        <StaggerItem>
          <p className="font-sans text-lg md:text-2xl text-navy/80 mb-12 max-w-2xl mx-auto font-light">
            {body}
          </p>
        </StaggerItem>
        <StaggerItem className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href={primaryHref}
            className="bg-navy text-cream px-8 py-4 font-sans uppercase tracking-widest text-sm hover:bg-[#C5A059] transition-colors w-full sm:w-auto text-center"
            rel="noopener noreferrer"
          >
            {primaryLabel}
          </Link>
          <a
            href={secondaryHref}
            className="text-navy font-sans uppercase tracking-widest text-sm border-b border-navy pb-1 hover:text-[#C5A059] hover:border-[#C5A059] transition-colors w-full sm:w-auto text-center"
          >
            {secondaryLabel}
          </a>
        </StaggerItem>
      </StaggerGroup>
    </section>
  );
}
