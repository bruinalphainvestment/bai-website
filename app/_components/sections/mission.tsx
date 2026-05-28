import Image from 'next/image';

import type { MissionSection } from '@/sanity/types/generated';
import { urlForImage } from '@/sanity/lib/imageUrl';

import {
  missionBodyText,
  missionFallback,
  missionFirstLetter,
} from '../fallbacks/sections/mission';

import { StaggerGroup, StaggerItem } from '../motion/scroll-reveal';

type GroupPhoto = NonNullable<MissionSection['groupPhoto']>;

export default function Mission(props: Partial<MissionSection> = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.heading ? props : missionFallback;

  const heading = data.heading ?? missionFallback.heading ?? '';
  const bodyText = extractText(data.body) || missionBodyText;
  const { dropCap, rest } = splitDropCap(bodyText);
  const groupPhoto = data.groupPhoto;
  const groupPhotoUrl = getGroupPhotoUrl(groupPhoto);
  const groupPhotoAlt =
    groupPhoto?.alt?.trim() || 'Bruin Alpha Investment group photo';

  return (
    <section
      data-section="mission"
      className="bg-cream text-navy px-4 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <StaggerGroup className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start lg:gap-16">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
            <StaggerItem className="md:col-span-4 lg:col-span-3">
              <h2 className="font-display sticky top-32 text-2xl md:text-3xl">
                {heading}
              </h2>
            </StaggerItem>
            <StaggerItem className="md:col-span-8 lg:col-span-9">
              <p className="font-sans text-lg leading-relaxed md:text-2xl md:leading-[1.6]">
                <span className="font-display float-left mt-1 mr-1 text-6xl leading-none text-[#8B6F38] md:mr-1.5 md:text-8xl">
                  {dropCap}
                </span>
                {rest}
              </p>
            </StaggerItem>
          </div>
          {groupPhotoUrl ? (
            <StaggerItem>
              <div className="bg-navy/10 relative mx-auto aspect-[3/4] w-full max-w-[360px] overflow-hidden rounded-[6px] shadow-[0_24px_70px_rgba(0,33,71,0.16)] sm:max-w-[420px] lg:mx-0 lg:max-w-none">
                <Image
                  src={groupPhotoUrl}
                  alt={groupPhotoAlt}
                  fill
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 420px, calc(100vw - 32px)"
                  className="object-cover"
                />
              </div>
            </StaggerItem>
          ) : null}
        </StaggerGroup>
      </div>
    </section>
  );
}

function getGroupPhotoUrl(groupPhoto: GroupPhoto | undefined) {
  if (!groupPhoto?.asset) return null;

  return urlForImage(groupPhoto)
    .width(900)
    .height(1200)
    .fit('crop')
    .auto('format')
    .url();
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
