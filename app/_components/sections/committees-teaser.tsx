import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

import { sanityFetch } from '@/sanity/lib/live';
import { allCommitteesIndexQuery } from '@/sanity/lib/queries';
import type {
  AllCommitteesIndexQueryResult,
  CommitteesTeaserSection,
} from '@/sanity/types/generated';

import {
  committeesTeaserFallback,
  committeesTeaserItemsFallback,
  type TeaserCommitteeItem,
} from '../fallbacks/sections/committees-teaser';

import { FadeUp, StaggerGroup, StaggerItem } from '../motion/scroll-reveal';

type CommitteeDoc = AllCommitteesIndexQueryResult[number];

type Props = Partial<CommitteesTeaserSection>;

export default async function CommitteesTeaser(props: Props = {}) {
  const useSanity = process.env.NEXT_PUBLIC_USE_SANITY === 'true';
  const data = useSanity && props.heading ? props : committeesTeaserFallback;
  const items = await loadCommittees();

  const heading = data.heading ?? committeesTeaserFallback.heading ?? '';
  const subheading = data.subheading;
  const ctaLabel = (
    data.ctaLabel ??
    committeesTeaserFallback.ctaLabel ??
    ''
  ).trim();

  return (
    <section
      data-section="committees"
      className="bg-cream px-4 py-20 text-navy md:px-8 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 sm:grid-cols-[minmax(140px,0.42fr)_minmax(0,1fr)] sm:gap-8 lg:grid-cols-12 lg:gap-16">
        <FadeUp className="sm:sticky sm:top-32 sm:z-10 sm:self-start sm:bg-cream sm:pb-2 lg:col-span-4">
          {heading ? (
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              {heading}
            </h2>
          ) : null}
          {subheading ? (
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-navy/70">
              {subheading}
            </p>
          ) : null}
        </FadeUp>

        <StaggerGroup className="grid min-w-0 auto-rows-fr grid-cols-1 gap-4 lg:col-span-8">
          {items.map((c) => (
            <StaggerItem key={c.slug} as="article" className="h-full">
              <Link
                href={`/committees/${c.slug}`}
                className="group grid h-full min-h-[168px] grid-cols-1 gap-6 bg-navy p-7 text-cream shadow-[0_18px_45px_rgba(0,33,71,0.12)] transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-gold-start focus:ring-offset-4 focus:ring-offset-cream sm:min-h-[148px] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center md:p-8"
              >
                <div>
                  <h3 className="font-display text-3xl leading-tight transition-colors group-hover:text-gold-start md:text-4xl">
                    {c.name}
                  </h3>
                  {c.tagline ? (
                    <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-cream/75 md:text-lg">
                      {c.tagline}
                    </p>
                  ) : null}
                </div>
                {ctaLabel ? (
                  <span className="flex items-center justify-between gap-3 font-mono text-xs uppercase tracking-widest text-gold-start sm:justify-end">
                    <span>{ctaLabel}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                      strokeWidth={1.75}
                    />
                  </span>
                ) : null}
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

async function loadCommittees(): Promise<TeaserCommitteeItem[]> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') {
    return committeesTeaserItemsFallback;
  }
  try {
    const { data } = await sanityFetch({ query: allCommitteesIndexQuery });
    if (!data || data.length === 0) {
      return committeesTeaserItemsFallback;
    }
    return data.flatMap(toTeaserItem);
  } catch (err) {
    console.error('[CommitteesTeaser] sanityFetch failed; using fallback:', err);
    return committeesTeaserItemsFallback;
  }
}

function toTeaserItem(c: CommitteeDoc): TeaserCommitteeItem[] {
  if (!c.slug || !c.name) return [];
  return [
    {
      name: c.name,
      tagline: c.tagline ?? '',
      slug: c.slug,
    },
  ];
}
