import type { ValuesSection } from '@/sanity/types/generated';

import { valuesFallback } from '../fallbacks/sections/values';

export default function Values(props: Partial<ValuesSection> = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.values && props.values.length > 0 ? props : valuesFallback;
  const values = data.values ?? valuesFallback.values ?? [];

  return (
    <section
      data-section="values"
      className="bg-cream text-navy py-24 md:py-32 px-4 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-12 md:gap-16">
          {values.map((value, index) => {
            const num = (index + 1).toString().padStart(2, '0');
            return (
              <div
                key={value._key}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 group"
              >
                <div className="md:col-span-2 flex items-start">
                  <span className="font-mono text-3xl md:text-5xl text-[#C5A059] opacity-80 group-hover:opacity-100 transition-opacity">
                    {num}
                  </span>
                </div>
                <div className="md:col-span-10 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 border-b border-navy/10 pb-8 group-hover:border-navy/30 transition-colors">
                  <h3 className="font-display text-2xl md:text-4xl flex-shrink-0 md:w-1/2">
                    {value.title ?? ''}
                  </h3>
                  <p className="font-sans text-lg text-navy/70 md:w-1/2">
                    {value.description ?? ''}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
