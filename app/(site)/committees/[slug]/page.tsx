import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { PortableText } from 'next-sanity';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { committeeDetailFallback } from '@/app/_components/fallbacks/committee-detail';
import { footerFallback } from '@/app/_components/fallbacks/footer';
import {
  FadeUp,
  StaggerGroup,
  StaggerItem,
} from '@/app/_components/motion/scroll-reveal';
import {
  formatGraduationYear,
  normalizeExternalUrl,
} from '@/app/_components/person-fields';
import { absoluteUrl, buildPageMetadata } from '@/app/_components/seo';
import { client as sanityReadClient } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/imageUrl';
import { sanityFetch } from '@/sanity/lib/live';
import {
  committeeBySlugQuery,
  committeeSlugsQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries';
import type {
  CommitteeBySlugQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity/types/generated';

type CommitteeData = NonNullable<CommitteeBySlugQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;

export const revalidate = 3600;
export const dynamicParams = false;

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') {
    return Object.keys(committeeDetailFallback).map((slug) => ({ slug }));
  }
  try {
    // Use the plain read client (no draftMode lookup) — sanityFetch reaches into
    // next/headers at build time which is not allowed inside generateStaticParams
    // and crashes the build. The published-perspective client returns the same
    // slug list and is safe to call here.
    const data =
      await sanityReadClient.fetch<Array<{ slug: string | null }>>(
        committeeSlugsQuery,
      );
    const slugs = (data ?? [])
      .map((entry) => entry.slug)
      .filter((s): s is string => Boolean(s));
    if (slugs.length === 0) {
      return Object.keys(committeeDetailFallback).map((slug) => ({ slug }));
    }
    return slugs.map((slug) => ({ slug }));
  } catch (err) {
    console.error(
      '[committees/[slug]] slugs fetch failed; using fallback:',
      err,
    );
    return Object.keys(committeeDetailFallback).map((slug) => ({ slug }));
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const committee = await loadCommittee(slug);
  if (!committee)
    return {
      title: 'Committee Not Found',
      robots: { index: false, follow: false },
    };

  const cleaned = stegaClean(committee);
  const settings = stegaClean(await loadSiteSettings());

  const seoFromCommittee = cleaned.seo ?? null;
  const fallbackTitle = cleaned.name ?? 'Committee';
  const fallbackDescription = cleaned.tagline ?? undefined;

  return buildPageMetadata({
    path: `/committees/${slug}`,
    seo: seoFromCommittee,
    settings,
    fallbackTitle,
    fallbackDescription,
  });
}

export default async function CommitteeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const committee = await loadCommittee(slug);
  if (!committee) notFound();

  const fallbackCommittee = committeeDetailFallback[slug] ?? null;
  const cleaned = stegaClean(committee);
  const director = committee.director;
  const directorName = director
    ? [director.firstName, director.lastName].filter(Boolean).join(' ').trim()
    : null;
  const directorLabel = directorName || committee.directorPlaceholder || 'TBD';
  const directorRole = director?.role ?? null;
  const directorBio = director?.bio ?? null;
  const directorGradYear = formatGraduationYear(director?.gradYear);
  const directorLinkedinHref = normalizeExternalUrl(director?.linkedinUrl);
  const directorMonogram =
    director?.monogramOverride ??
    deriveDirectorMonogram(director?.firstName, director?.lastName);
  const directorHeadshotUrl =
    director?.photoReleaseObtained === true && director?.headshot
      ? urlForImage(director.headshot)
          .width(400)
          .height(400)
          .fit('crop')
          .auto('format')
          .url()
      : null;

  const curriculumBlocks = committee.curriculum ?? [];
  const showCurriculum =
    committee.curriculumEnabled === true && curriculumBlocks.length > 0;
  const curriculumHeading =
    committee.curriculumHeading ?? fallbackCommittee?.curriculumHeading ?? '';
  const curriculumTerm =
    committee.curriculumTerm ?? fallbackCommittee?.curriculumTerm ?? null;
  const differentiatorHeading =
    committee.differentiatorHeading ??
    fallbackCommittee?.differentiatorHeading ??
    '';
  const learnHeading =
    committee.learnHeading ?? fallbackCommittee?.learnHeading ?? '';
  const signatureProjectsHeading =
    committee.signatureProjectsHeading ??
    fallbackCommittee?.signatureProjectsHeading ??
    '';
  const learnBullets = committee.learn ?? [];
  const projects = committee.projects ?? [];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: absoluteUrl('/'),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Committees',
        item: absoluteUrl('/committees'),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cleaned.name ?? 'Committee',
        item: absoluteUrl(`/committees/${slug}`),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 font-sans text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="mx-auto max-w-5xl px-6 pt-32 pb-16 md:px-12">
        <StaggerGroup trigger="mount">
          <StaggerItem>
            <Link
              href="/committees"
              className="mb-8 inline-flex items-center font-medium text-[#0A192F] transition-colors hover:text-blue-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Committees
            </Link>
          </StaggerItem>

          <StaggerItem>
            <h1 className="mb-6 font-serif text-5xl leading-tight text-[#0A192F] md:text-6xl">
              {committee.name ?? ''}
            </h1>
          </StaggerItem>

          {committee.tagline ? (
            <StaggerItem>
              <p className="mb-8 max-w-3xl text-xl leading-relaxed font-light text-gray-700 md:text-2xl">
                {committee.tagline}
              </p>
            </StaggerItem>
          ) : null}

          <StaggerItem>
            <div className="inline-flex items-center rounded-full bg-[#0A192F] px-5 py-2.5 text-sm font-medium tracking-wide text-[#FAF9F6]">
              Director: {directorLabel}
            </div>
          </StaggerItem>

          {director && directorName ? (
            <StaggerItem>
              <div className="mt-8 flex max-w-lg items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#0A192F]">
                  {directorHeadshotUrl ? (
                    <Image
                      src={directorHeadshotUrl}
                      alt={`${directorName} headshot`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0A192F] to-[#020c1b] opacity-80" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-gradient-to-br from-[#C5A059] to-[#8B6F38] bg-clip-text font-serif text-xl text-transparent">
                          {directorMonogram}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg text-[#0A192F]">
                    {directorName}
                  </span>
                  {directorRole ? (
                    <span className="font-sans text-sm text-gray-600">
                      {directorRole}
                    </span>
                  ) : null}
                  {directorGradYear ? (
                    <span className="mt-1 font-sans text-xs font-medium uppercase tracking-[0.14em] text-gray-500">
                      {directorGradYear}
                    </span>
                  ) : null}
                  {directorBio ? (
                    <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-gray-600">
                      {directorBio}
                    </p>
                  ) : null}
                  {directorLinkedinHref ? (
                    <a
                      href={directorLinkedinHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${directorName}'s LinkedIn profile`}
                      className="mt-3 inline-flex w-fit items-center gap-2 border-b border-[#C5A059]/70 pb-1 font-sans text-sm font-medium text-[#0A192F] transition-colors hover:text-[#8B6F38]"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      <span>LinkedIn</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </StaggerItem>
          ) : null}
        </StaggerGroup>
      </section>

      <div className="mx-auto max-w-5xl space-y-20 px-6 md:px-12">
        {committee.differentiator || committee.directorQuote ? (
          <StaggerGroup className="grid items-center gap-12 md:grid-cols-2">
            {committee.differentiator ? (
              <StaggerItem>
                <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                  <h2 className="mb-4 font-serif text-2xl text-[#0A192F]">
                    {differentiatorHeading}
                  </h2>
                  <p className="leading-relaxed text-gray-700">
                    {committee.differentiator}
                  </p>
                </div>
              </StaggerItem>
            ) : null}

            {committee.directorQuote ? (
              <StaggerItem>
                <blockquote className="border-l-4 border-[#0A192F] py-2 pl-6 font-serif text-xl leading-relaxed text-[#0A192F] italic md:text-2xl">
                  {committee.directorQuote}
                </blockquote>
              </StaggerItem>
            ) : null}
          </StaggerGroup>
        ) : null}

        {committee.description && committee.description.length > 0 ? (
          <FadeUp>
            <section className="prose prose-lg max-w-none">
              <PortableText value={committee.description} />
            </section>
          </FadeUp>
        ) : null}

        {learnBullets.length > 0 ? (
          <section>
            <FadeUp>
              <h2 className="mb-8 border-b border-gray-200 pb-4 font-serif text-3xl text-[#0A192F]">
                {learnHeading}
              </h2>
            </FadeUp>
            <StaggerGroup className="grid gap-4 md:grid-cols-2">
              {learnBullets.map((item) => (
                <StaggerItem key={item} className="flex items-start">
                  <span className="mt-1 mr-3 text-[#0A192F]">•</span>
                  <span className="leading-relaxed text-gray-700">{item}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        ) : null}

        {projects.length > 0 ? (
          <section>
            <FadeUp>
              <h2 className="mb-8 border-b border-gray-200 pb-4 font-serif text-3xl text-[#0A192F]">
                {signatureProjectsHeading}
              </h2>
            </FadeUp>
            <StaggerGroup className="grid gap-6 md:grid-cols-2">
              {projects.map((project) => (
                <StaggerItem
                  key={project._id}
                  className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                >
                  <h3 className="mb-3 text-xl font-bold text-[#0A192F]">
                    {project.name ?? ''}
                  </h3>
                  {project.summary ? (
                    <p className="leading-relaxed text-gray-600">
                      {project.summary}
                    </p>
                  ) : null}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        ) : null}

        {showCurriculum ? (
          <FadeUp>
            <section>
              <h2 className="mb-8 border-b border-gray-200 pb-4 font-serif text-3xl text-[#0A192F]">
                {curriculumHeading}{' '}
                {curriculumTerm ? (
                  <span className="ml-2 font-sans text-2xl text-gray-400">
                    ({curriculumTerm})
                  </span>
                ) : null}
              </h2>
              <div className="prose prose-lg max-w-none overflow-hidden rounded-2xl border border-gray-100 bg-white px-6 py-4 shadow-sm">
                <PortableText value={curriculumBlocks} />
              </div>
            </section>
          </FadeUp>
        ) : null}
      </div>
    </div>
  );
}

function deriveDirectorMonogram(
  firstName: string | null | undefined,
  lastName: string | null | undefined,
): string {
  const first = (firstName ?? '').trim();
  const last = (lastName ?? '').trim();
  if (first && last) return `${first[0]}${last[0]}`.toUpperCase();
  if (first) return first.slice(0, 2).toUpperCase();
  if (last) return last.slice(0, 2).toUpperCase();
  return '?';
}

async function loadCommittee(slug: string): Promise<CommitteeData | null> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') {
    return committeeDetailFallback[slug] ?? null;
  }
  try {
    const { data } = await sanityFetch({
      query: committeeBySlugQuery,
      params: { slug },
    });
    if (data) return data;
    return committeeDetailFallback[slug] ?? null;
  } catch (err) {
    console.error('[committees/[slug]] fetch failed; using fallback:', err);
    return committeeDetailFallback[slug] ?? null;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error(
      '[committees/[slug]] siteSettings fetch failed; using fallback:',
      err,
    );
    return footerFallback;
  }
}
