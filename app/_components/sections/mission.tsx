import type { MissionSection } from '@/sanity/types/generated';

import {
  missionBodyText,
  missionFallback,
  missionFirstLetter,
} from '../fallbacks/sections/mission';

export default function Mission(props: Partial<MissionSection> = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.heading ? props : missionFallback;

  const heading = data.heading ?? missionFallback.heading ?? '';
  const bodyText = extractText(data.body) || missionBodyText;
  const { dropCap, rest } = splitDropCap(bodyText);

  return (
    <section
      data-section="mission"
      className="bg-cream text-navy py-24 md:py-32 px-4 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4 lg:col-span-3">
            <h2 className="font-display text-2xl md:text-3xl sticky top-32">
              {heading}
            </h2>
          </div>
          <div className="md:col-span-8 lg:col-span-9">
            <p className="font-sans text-lg md:text-2xl leading-relaxed md:leading-[1.6]">
              <span className="float-left text-6xl md:text-8xl font-display leading-none mr-4 mt-2 text-[#8B6F38]">
                {dropCap}
              </span>
              {rest}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function extractText(body: MissionSection['body']): string {
  if (!body) return '';
  return body
    .flatMap((block) => block.children?.map((child) => child.text ?? '') ?? [])
    .join('');
}

function splitDropCap(body: string): { dropCap: string; rest: string } {
  if (!body) return { dropCap: missionFirstLetter, rest: missionBodyText };
  return { dropCap: body.charAt(0), rest: body.slice(1) };
}
