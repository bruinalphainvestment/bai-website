import type { MissionSection } from '@/sanity/types/generated';

import {
  missionBodyText,
  missionFallback,
} from '../fallbacks/sections/mission';

import { StaggerGroup, StaggerItem } from '../motion/scroll-reveal';

export default function Mission(props: Partial<MissionSection> = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.heading ? props : missionFallback;

  const heading = data.heading ?? missionFallback.heading ?? '';
  const bodyText = extractText(data.body) || missionBodyText;
  const { initial, rest } = splitInitial(bodyText);

  return (
    <section
      data-section="mission"
      className="bg-cream text-navy py-24 md:py-32 px-4 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <StaggerItem className="md:col-span-4 lg:col-span-3">
            <h2 className="font-display text-2xl md:text-3xl sticky top-32">
              {heading}
            </h2>
          </StaggerItem>
          <StaggerItem className="md:col-span-8 lg:col-span-9">
            <p className="mission-copy font-sans text-lg md:text-2xl leading-relaxed md:leading-[1.6]">
              {initial ? (
                <>
                  <span className="mission-copy-initial">{initial}</span>
                  {rest}
                </>
              ) : (
                bodyText
              )}
            </p>
          </StaggerItem>
        </StaggerGroup>
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

function splitInitial(body: string): { initial: string; rest: string } {
  if (!body) return { initial: '', rest: '' };
  return { initial: body.charAt(0), rest: body.slice(1) };
}
