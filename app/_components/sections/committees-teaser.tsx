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

  return (
    <section
      data-section="committees"
      className="bg-cream text-navy py-24 px-4 md:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <FadeUp>
          <h2 className="font-display text-4xl md:text-5xl mb-12">{heading}</h2>
        </FadeUp>
        {subheading ? (
          <FadeUp>
            <p className="font-sans text-lg text-navy/70 max-w-3xl mb-12 -mt-6">
              {subheading}
            </p>
          </FadeUp>
        ) : null}
        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {items.map((c) => (
            <StaggerItem key={c.slug}>
              <Link
                href={`/committees/${c.slug}`}
                className="group block bg-navy text-cream p-8 md:p-12 transition-transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#C5A059] focus:ring-offset-2 focus:ring-offset-cream"
              >
                <div className="flex flex-col h-full justify-between min-h-[240px]">
                  <div>
                    <h3 className="font-display text-3xl md:text-4xl mb-4 group-hover:text-[#C5A059] transition-colors">
                      {c.name}
                    </h3>
                    <p className="font-sans text-cream/80 text-lg">{c.tagline}</p>
                  </div>
                  <div className="flex justify-end mt-8">
                    <span className="font-mono uppercase tracking-widest text-sm text-[#C5A059] flex items-center gap-2 group-hover:gap-4 transition-all">
                      Explore <span>&rarr;</span>
                    </span>
                  </div>
                </div>
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
