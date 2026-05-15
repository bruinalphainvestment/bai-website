import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import {
  committeesIndexListFallback,
  committeesIndexPageFallback,
} from '@/app/_components/fallbacks/committees-index-page';
import { footerFallback } from '@/app/_components/fallbacks/footer';
import { resolveOgImages } from '@/app/_components/og-image';
import { sanityFetch } from '@/sanity/lib/live';
import {
  allCommitteesIndexQuery,
  committeesIndexPageQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries';
import type {
  AllCommitteesIndexQueryResult,
  CommitteesIndexPageQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity/types/generated';

type CommitteesIndexData = NonNullable<CommitteesIndexPageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;
type CommitteeCard = AllCommitteesIndexQueryResult[number];

export async function generateMetadata(): Promise<Metadata> {
  const [pageRaw, settingsRaw] = await Promise.all([
    loadCommitteesIndexData(),
    loadSiteSettings(),
  ]);
  const page = stegaClean(pageRaw);
  const settings = stegaClean(settingsRaw);

  const suffix = settings.titleSuffix ?? ' — Bruin Alpha Investment at UCLA';
  const fallbackTitle = `Committees${suffix}`;
  const title = page.seo?.title ?? fallbackTitle;
  const description =
    page.seo?.description ??
    settings.defaultMetaDescription ??
    committeesIndexPageFallback.seo?.description ??
    '';

  const images = resolveOgImages(page.seo?.ogImage, settings.defaultOgImage, title);

  return {
    title,
    description,
    openGraph: images ? { title, description, images } : { title, description },
  };
}

export default async function CommitteesIndexPage() {
  const [page, committees] = await Promise.all([
    loadCommitteesIndexData(),
    loadCommitteesList(),
  ]);

  const heading = page.hero?.heading ?? committeesIndexPageFallback.hero?.heading ?? 'Committees';
  const subheading = page.hero?.subheading ?? committeesIndexPageFallback.hero?.subheading ?? '';
  const intro = page.intro ?? committeesIndexPageFallback.intro;
  const connectedHeading =
    page.connectedByDesign?.heading ??
    committeesIndexPageFallback.connectedByDesign?.heading ??
    'Connected by Design';
  const connectedParagraphs =
    page.connectedByDesign?.paragraphs ??
    committeesIndexPageFallback.connectedByDesign?.paragraphs ??
    [];
  const connectedBody = page.connectedByDesign?.body ?? committeesIndexPageFallback.connectedByDesign?.body;

  const headingParts = heading.split(' ');
  const headingFirstHalf = headingParts.slice(0, 2).join(' ');
  const headingSecondHalf = headingParts.slice(2).join(' ');

  return (
    <div className="bg-cream min-h-screen text-navy pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <section className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight text-navy">
            {headingFirstHalf}
            {headingSecondHalf ? (
              <>
                <br className="hidden md:block" /> {headingSecondHalf}
              </>
            ) : null}
          </h1>
          <p className="text-lg md:text-xl text-navy/80 font-sans leading-relaxed">
            {subheading}
          </p>
          {intro ? (
            <p className="mt-6 text-base md:text-lg text-navy/70 font-sans leading-relaxed">
              {intro}
            </p>
          ) : null}
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {committees.map((committee) => (
            <CommitteeCardItem key={committee._id} committee={committee} />
          ))}
        </section>

        <section className="bg-navy text-white rounded-2xl p-8 md:p-16 text-center max-w-4xl mx-auto border border-gold/20">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-6 text-cream">
            {connectedHeading}
          </h2>
          <div className="w-24 h-1 bg-gold mx-auto mb-8"></div>
          {connectedParagraphs.length > 0
            ? connectedParagraphs.map((p, i) => (
                <p
                  key={`connected-paragraph-${i}`}
                  className={`text-lg text-cream/90 font-sans leading-relaxed ${i < connectedParagraphs.length - 1 ? 'mb-6' : ''}`}
                >
                  {p}
                </p>
              ))
            : connectedBody
            ? <p className="text-lg text-cream/90 font-sans leading-relaxed">{connectedBody}</p>
            : null}
        </section>
      </div>
    </div>
  );
}

function CommitteeCardItem({ committee }: { committee: CommitteeCard }) {
  const directorName =
    committee.director
      ? [committee.director.firstName, committee.director.lastName].filter(Boolean).join(' ').trim()
      : null;
  const directorLabel = directorName || committee.directorPlaceholder || 'TBD';
  const learnBullets = committee.learn ?? [];
  const name = committee.name ?? '';
  const slug = committee.slug ?? '';
  const initial = name.charAt(0) || '?';

  return (
    <div className="bg-white border border-gold/20 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold font-heading text-navy">{name}</h2>
          <div className="w-10 h-10 bg-gold/10 text-gold flex items-center justify-center rounded-full font-bold font-heading text-lg">
            {initial}
          </div>
        </div>
        <p className="text-sm text-gold font-semibold uppercase tracking-wider mb-4">
          Director: {directorLabel}
        </p>
        {committee.tagline ? (
          <p className="text-navy/80 font-sans mb-6">{committee.tagline}</p>
        ) : null}
        {learnBullets.length > 0 ? (
          <div className="bg-cream/50 rounded-lg p-5 mb-8">
            <h3 className="font-semibold text-navy mb-3">What you&apos;ll do:</h3>
            <ul className="space-y-2">
              {learnBullets.map((bullet) => (
                <li key={bullet} className="flex items-start text-sm text-navy/80">
                  <span className="text-gold mr-2 font-bold">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="mt-auto pt-4 border-t border-navy/10">
        {slug ? (
          <Link
            href={`/committees/${slug}`}
            className="inline-flex items-center font-bold text-navy hover:text-gold transition-colors"
          >
            Explore {name} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

async function loadCommitteesIndexData(): Promise<CommitteesIndexData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return committeesIndexPageFallback;
  try {
    const { data } = await sanityFetch({ query: committeesIndexPageQuery });
    return data ? (stegaClean(data) as CommitteesIndexData) : committeesIndexPageFallback;
  } catch (err) {
    console.error('[committees] page fetch failed; using fallback:', err);
    return committeesIndexPageFallback;
  }
}

async function loadCommitteesList(): Promise<AllCommitteesIndexQueryResult> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return committeesIndexListFallback;
  try {
    const { data } = await sanityFetch({ query: allCommitteesIndexQuery });
    return data && data.length > 0
      ? (stegaClean(data) as AllCommitteesIndexQueryResult)
      : committeesIndexListFallback;
  } catch (err) {
    console.error('[committees] list fetch failed; using fallback:', err);
    return committeesIndexListFallback;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error('[committees] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}
