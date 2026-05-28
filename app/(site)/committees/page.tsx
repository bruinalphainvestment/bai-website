import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import {
  committeesIndexListFallback,
  committeesIndexPageFallback,
} from '@/app/_components/fallbacks/committees-index-page';
import { footerFallback } from '@/app/_components/fallbacks/footer';
import {
  FadeUp,
  StaggerGroup,
  StaggerItem,
} from '@/app/_components/motion/scroll-reveal';
import { buildPageMetadata } from '@/app/_components/seo';
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
type CommitteeCardDirector = NonNullable<CommitteeCard['directors']>[number];

export async function generateMetadata(): Promise<Metadata> {
  const [pageRaw, settingsRaw] = await Promise.all([
    loadCommitteesIndexData(),
    loadSiteSettings(),
  ]);
  const page = stegaClean(pageRaw);
  const settings = stegaClean(settingsRaw);

  return buildPageMetadata({
    path: '/committees',
    seo: page.seo,
    settings,
    fallbackTitle: 'Committees',
    fallbackDescription:
      committeesIndexPageFallback.seo?.description ?? undefined,
  });
}

export default async function CommitteesIndexPage() {
  const [page, committees] = await Promise.all([
    loadCommitteesIndexData(),
    loadCommitteesList(),
  ]);

  const heading =
    page.hero?.heading ?? committeesIndexPageFallback.hero?.heading ?? '';
  const subheading =
    page.hero?.subheading ?? committeesIndexPageFallback.hero?.subheading ?? '';
  const intro = page.intro ?? committeesIndexPageFallback.intro;
  const connectedHeading =
    page.connectedByDesign?.heading ??
    committeesIndexPageFallback.connectedByDesign?.heading ??
    '';
  const connectedParagraphs =
    page.connectedByDesign?.paragraphs ??
    committeesIndexPageFallback.connectedByDesign?.paragraphs ??
    [];
  const connectedBody =
    page.connectedByDesign?.body ??
    committeesIndexPageFallback.connectedByDesign?.body;
  const cardLearnHeading =
    page.cardLearnHeading ?? committeesIndexPageFallback.cardLearnHeading ?? '';
  const cardCtaLabel =
    page.cardCtaLabel ?? committeesIndexPageFallback.cardCtaLabel ?? '';

  const headingParts = heading.split(' ');
  const headingFirstHalf = headingParts.slice(0, 2).join(' ');
  const headingSecondHalf = headingParts.slice(2).join(' ');

  return (
    <div className="bg-cream text-navy min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <section className="mx-auto mb-20 max-w-3xl text-center">
          <StaggerGroup trigger="mount">
            <StaggerItem>
              <h1 className="font-heading text-navy mb-6 text-4xl font-bold tracking-tight md:text-6xl">
                {headingFirstHalf}
                {headingSecondHalf ? (
                  <>
                    <br className="hidden md:block" /> {headingSecondHalf}
                  </>
                ) : null}
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="text-navy/80 font-sans text-lg leading-relaxed md:text-xl">
                {subheading}
              </p>
            </StaggerItem>
            {intro ? (
              <StaggerItem>
                <p className="text-navy/70 mt-6 font-sans text-base leading-relaxed md:text-lg">
                  {intro}
                </p>
              </StaggerItem>
            ) : null}
          </StaggerGroup>
        </section>

        <StaggerGroup className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-2">
          {committees.map((committee) => (
            <StaggerItem key={committee._id}>
              <CommitteeCardItem
                cardCtaLabel={cardCtaLabel}
                learnHeading={cardLearnHeading}
                committee={committee}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <FadeUp>
          <section className="bg-navy border-gold/20 mx-auto max-w-4xl rounded-2xl border p-8 text-center text-white md:p-16">
            <h2 className="font-heading text-cream mb-6 text-3xl font-bold md:text-4xl">
              {connectedHeading}
            </h2>
            <div className="bg-gold mx-auto mb-8 h-1 w-24"></div>
            {connectedParagraphs.length > 0 ? (
              connectedParagraphs.map((p, i) => (
                <p
                  key={`connected-paragraph-${i}`}
                  className={`text-cream/90 font-sans text-lg leading-relaxed ${i < connectedParagraphs.length - 1 ? 'mb-6' : ''}`}
                >
                  {p}
                </p>
              ))
            ) : connectedBody ? (
              <p className="text-cream/90 font-sans text-lg leading-relaxed">
                {connectedBody}
              </p>
            ) : null}
          </section>
        </FadeUp>
      </div>
    </div>
  );
}

function CommitteeCardItem({
  cardCtaLabel,
  learnHeading,
  committee,
}: {
  cardCtaLabel: string;
  learnHeading: string;
  committee: CommitteeCard;
}) {
  const directorNames = getCommitteeDirectors(committee)
    .map(formatDirectorName)
    .filter(Boolean);
  const directorLabel =
    formatDirectorList(directorNames) || committee.directorPlaceholder || 'TBD';
  const directorHeading = directorNames.length > 1 ? 'Directors' : 'Director';
  const learnBullets = committee.learn ?? [];
  const name = committee.name ?? '';
  const slug = committee.slug ?? '';
  const initial = name.charAt(0) || '?';
  const isNavyAccent = committee.accentColor === 'navy';
  const cardBorder = isNavyAccent ? 'border-navy/30' : 'border-gold/20';
  const initialBg = isNavyAccent
    ? 'bg-navy/10 text-navy'
    : 'bg-gold/10 text-gold';
  const directorAccent = isNavyAccent ? 'text-navy' : 'text-gold';

  return (
    <div
      className={`border bg-white ${cardBorder} group flex h-full flex-col rounded-xl p-8 shadow-sm transition-shadow hover:shadow-md`}
    >
      <div className="mb-6">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="font-heading text-navy text-2xl font-bold">{name}</h2>
          <div
            className={`h-10 w-10 ${initialBg} font-heading flex items-center justify-center rounded-full text-lg font-bold`}
          >
            {initial}
          </div>
        </div>
        <p
          className={`text-sm ${directorAccent} mb-4 font-semibold tracking-wider uppercase`}
        >
          {directorHeading}: {directorLabel}
        </p>
        {committee.tagline ? (
          <p className="text-navy/80 mb-6 font-sans">{committee.tagline}</p>
        ) : null}
        {learnBullets.length > 0 ? (
          <div className="bg-cream/50 mb-8 rounded-lg p-5">
            {learnHeading ? (
              <h3 className="text-navy mb-3 font-semibold">{learnHeading}</h3>
            ) : null}
            <ul className="space-y-2">
              {learnBullets.map((bullet) => (
                <li
                  key={bullet}
                  className="text-navy/80 flex items-start text-sm"
                >
                  <span className="text-gold mr-2 font-bold">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="border-navy/10 mt-auto border-t pt-4">
        {slug ? (
          <Link
            href={`/committees/${slug}`}
            className="text-navy hover:text-gold inline-flex items-center font-bold transition-colors"
          >
            {cardCtaLabel ? `${cardCtaLabel} ${name}` : name}{' '}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function getCommitteeDirectors(
  committee: CommitteeCard,
): CommitteeCardDirector[] {
  if (committee.directors && committee.directors.length > 0) {
    return committee.directors;
  }
  return committee.director ? [committee.director] : [];
}

function formatDirectorName(director: CommitteeCardDirector): string {
  return [director.firstName, director.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();
}

function formatDirectorList(names: string[]): string {
  if (names.length <= 1) return names[0] ?? '';
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
}

async function loadCommitteesIndexData(): Promise<CommitteesIndexData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true')
    return committeesIndexPageFallback;
  try {
    const { data } = await sanityFetch({ query: committeesIndexPageQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data ?? committeesIndexPageFallback;
  } catch (err) {
    console.error('[committees] page fetch failed; using fallback:', err);
    return committeesIndexPageFallback;
  }
}

async function loadCommitteesList(): Promise<AllCommitteesIndexQueryResult> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true')
    return committeesIndexListFallback;
  try {
    const { data } = await sanityFetch({ query: allCommitteesIndexQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data && data.length > 0 ? data : committeesIndexListFallback;
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
    console.error(
      '[committees] siteSettings fetch failed; using fallback:',
      err,
    );
    return footerFallback;
  }
}
