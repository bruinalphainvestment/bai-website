import type { ValuesSection } from '@/sanity/types/generated';

import { valuesFallback } from '../fallbacks/sections/values';
import { FadeUp, StaggerGroup, StaggerItem } from '../motion/scroll-reveal';

export default function Values(props: Partial<ValuesSection> = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data =
    useSanity && props.values && props.values.length > 0
      ? props
      : valuesFallback;
  const values = data.values ?? valuesFallback.values ?? [];
  const heading = data.heading?.trim();
  const [featuredValue, ...secondaryValues] = values;
  const featuredValueClassName =
    secondaryValues.length > 0 ? 'lg:col-span-5' : 'lg:col-span-12';

  return (
    <section
      data-section="values"
      className="bg-cream px-4 py-20 text-navy md:px-8 md:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {heading ? (
          <FadeUp>
            <h2 className="mb-12 max-w-3xl font-display text-4xl md:text-5xl">
              {heading}
            </h2>
          </FadeUp>
        ) : null}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {featuredValue ? (
            <FadeUp as="article" className={featuredValueClassName}>
              <div className="border-y border-navy/15 py-8 md:py-10 lg:sticky lg:top-32">
                <h3 className="font-display text-4xl leading-tight md:text-5xl">
                  {featuredValue.title ?? ''}
                </h3>
                {featuredValue.description ? (
                  <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-navy/70 md:text-xl">
                    {featuredValue.description}
                  </p>
                ) : null}
              </div>
            </FadeUp>
          ) : null}

          {secondaryValues.length > 0 ? (
            <StaggerGroup className="grid grid-cols-1 gap-x-10 border-t border-navy/10 sm:grid-cols-2 lg:col-span-7">
              {secondaryValues.map((value) => (
                <StaggerItem
                  key={value._key}
                  as="article"
                  className="group border-b border-navy/10 py-7 transition-colors hover:border-navy/30 md:py-8"
                >
                  <h3 className="font-display text-2xl leading-tight transition-colors group-hover:text-gold-end md:text-3xl">
                    {value.title ?? ''}
                  </h3>
                  {value.description ? (
                    <p className="mt-4 font-sans text-base leading-relaxed text-navy/65 md:text-lg">
                      {value.description}
                    </p>
                  ) : null}
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : null}
        </div>
      </div>
    </section>
  );
}
