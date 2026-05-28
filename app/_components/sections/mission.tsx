import Image from 'next/image';

import type { MissionSection } from '@/sanity/types/generated';
import { urlForImage } from '@/sanity/lib/imageUrl';

import {
  missionBodyText,
  missionFallback,
} from '../fallbacks/sections/mission';

import { StaggerGroup, StaggerItem } from '../motion/scroll-reveal';

type GroupPhoto = NonNullable<MissionSection['groupPhoto']>;

const alphaDefinition =
  'A measure of edge: return above a benchmark, earned through disciplined research, original judgment, and execution.';

export default function Mission(props: Partial<MissionSection> = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && hasMissionContent(props) ? props : missionFallback;

  const heading = data.heading?.trim() || missionFallback.heading || '';
  const bodyText = extractText(data.body).trim() || missionBodyText;
  const { initial, rest } = splitInitial(bodyText);
  const groupPhoto = data.groupPhoto;
  const groupPhotoUrl = getGroupPhotoUrl(groupPhoto);
  const hasHeading = Boolean(heading);
  const hasBody = Boolean(bodyText);
  const hasTextContent = hasHeading || hasBody;
  const hasHeadingAndBody = hasHeading && hasBody;
  const layoutClassName = groupPhotoUrl && hasTextContent
    ? 'grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(320px,480px)] lg:items-center lg:gap-16'
    : 'grid grid-cols-1 gap-12';
  const textGridClassName = hasHeadingAndBody
    ? 'grid grid-cols-1 gap-12 md:grid-cols-12'
    : 'grid grid-cols-1 gap-12';
  const headingClassName = hasHeadingAndBody
    ? 'md:col-span-4 lg:col-span-3'
    : undefined;
  const bodyClassName = hasHeadingAndBody
    ? 'md:col-span-8 lg:col-span-9'
    : !groupPhotoUrl
      ? 'max-w-5xl'
      : undefined;
  const imageFrameClassName =
    groupPhotoUrl && hasTextContent
      ? 'bg-navy/10 relative mx-auto aspect-[3/4] w-full max-w-[390px] overflow-hidden shadow-[0_24px_70px_rgba(0,33,71,0.16)] sm:max-w-[460px] lg:mx-0 lg:max-w-none'
      : 'bg-navy/10 relative mx-auto aspect-[3/4] w-full max-w-[390px] overflow-hidden shadow-[0_24px_70px_rgba(0,33,71,0.16)] sm:max-w-[460px] lg:max-w-[480px]';
  const groupPhotoAlt =
    groupPhoto?.alt?.trim() || 'Bruin Alpha Investment group photo';

  if (!hasTextContent && !groupPhotoUrl) return null;

  return (
    <section
      data-section="mission"
      className="bg-cream text-navy px-4 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <div
          data-section="alpha-definition"
          className="mb-20 border-y border-navy/10 py-10 md:mb-24 md:py-14"
        >
          <StaggerGroup>
            <StaggerItem className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-3">
                <p className="font-mono text-sm text-gold-end">noun</p>
                <p className="mt-3 font-display text-2xl italic text-navy/60">
                  al-fa
                </p>
              </div>
              <div className="md:col-span-9">
                <p className="alpha-definition-term text-6xl leading-none text-navy md:text-8xl lg:text-9xl">
                  <dfn className="not-italic">alpha</dfn>
                </p>
                <p className="mt-6 max-w-4xl font-display text-2xl leading-tight text-navy md:text-4xl">
                  {alphaDefinition}
                </p>
              </div>
            </StaggerItem>
          </StaggerGroup>
        </div>
        <StaggerGroup className={layoutClassName}>
          {hasTextContent ? (
            <div className={textGridClassName}>
              {hasHeading ? (
                <StaggerItem className={headingClassName}>
                  <h2 className="font-display sticky top-32 text-2xl md:text-3xl">
                    {heading}
                  </h2>
                </StaggerItem>
              ) : null}
              {hasBody ? (
                <StaggerItem className={bodyClassName}>
                  <p className="mission-copy font-sans text-lg leading-relaxed md:text-2xl md:leading-[1.6]">
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
              ) : null}
            </div>
          ) : null}
          {groupPhotoUrl ? (
            <StaggerItem>
              <div className={imageFrameClassName}>
                <Image
                  src={groupPhotoUrl}
                  alt={groupPhotoAlt}
                  fill
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 460px, calc(100vw - 32px)"
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

function hasMissionContent(data: Partial<MissionSection>) {
  return (
    Boolean(data.heading?.trim()) ||
    Boolean(extractText(data.body).trim()) ||
    Boolean(data.groupPhoto?.asset)
  );
}

function getGroupPhotoUrl(groupPhoto: GroupPhoto | undefined) {
  if (!groupPhoto?.asset) return null;

  return urlForImage(groupPhoto)
    .width(1080)
    .height(1440)
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

function splitInitial(body: string): { initial: string; rest: string } {
  if (!body) return { initial: '', rest: '' };
  return { initial: body.charAt(0), rest: body.slice(1) };
}
