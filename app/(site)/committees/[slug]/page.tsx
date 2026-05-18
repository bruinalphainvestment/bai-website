import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { PortableText } from 'next-sanity';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  committeeDetailFallback,
  committeeDetailFallbackCurriculum,
} from '@/app/_components/fallbacks/committee-detail';
import { footerFallback } from '@/app/_components/fallbacks/footer';
import { FadeUp, StaggerGroup, StaggerItem } from '@/app/_components/motion/scroll-reveal';
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
    const data = await sanityReadClient.fetch<Array<{ slug: string | null }>>(
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
    console.error('[committees/[slug]] slugs fetch failed; using fallback:', err);
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
  if (!committee) return { title: 'Committee Not Found', robots: { index: false, follow: false } };

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

  const cleaned = stegaClean(committee);
  const director = committee.director;
  const directorName = director
    ? [director.firstName, director.lastName]
        .filter(Boolean)
        .join(' ')
        .trim()
    : null;
  const directorLabel = directorName || committee.directorPlaceholder || 'TBD';
  const directorRole = director?.role ?? null;
  const directorMonogram =
    director?.monogramOverride ??
    deriveDirectorMonogram(director?.firstName, director?.lastName);
  const directorHeadshotUrl =
    director?.photoReleaseObtained === true && director?.headshot
      ? urlForImage(director.headshot).width(400).height(400).fit('crop').auto('format').url()
      : null;

  const curriculumBlocks = committee.curriculum && committee.curriculum.length > 0
    ? committee.curriculum
    : committeeDetailFallbackCurriculum;

  const learnBullets = committee.learn ?? [];
  const projects = committee.projects ?? [];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl('/') },
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
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 font-sans pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto">
        <StaggerGroup trigger="mount">
          <StaggerItem>
            <Link
              href="/committees"
              className="inline-flex items-center text-[#0A192F] hover:text-blue-700 transition-colors mb-8 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Committees
            </Link>
          </StaggerItem>

          <StaggerItem>
            <h1 className="text-5xl md:text-6xl font-serif text-[#0A192F] mb-6 leading-tight">
              {committee.name ?? ''}
            </h1>
          </StaggerItem>

          {committee.tagline ? (
            <StaggerItem>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mb-8 leading-relaxed font-light">
                {committee.tagline}
              </p>
            </StaggerItem>
          ) : null}

          <StaggerItem>
            <div className="inline-flex items-center bg-[#0A192F] text-[#FAF9F6] px-5 py-2.5 rounded-full text-sm font-medium tracking-wide">
              Director: {directorLabel}
            </div>
          </StaggerItem>

          {director && directorName ? (
            <StaggerItem>
              <div className="mt-8 flex items-center gap-5 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 max-w-md">
                <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-full bg-[#0A192F]">
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
                        <span className="font-serif text-xl bg-gradient-to-br from-[#C5A059] to-[#8B6F38] bg-clip-text text-transparent">
                          {directorMonogram}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-serif text-lg text-[#0A192F]">{directorName}</span>
                  {directorRole ? (
                    <span className="font-sans text-sm text-gray-600">{directorRole}</span>
                  ) : null}
                </div>
              </div>
            </StaggerItem>
          ) : null}
        </StaggerGroup>
      </section>

      <div className="px-6 md:px-12 max-w-5xl mx-auto space-y-20">
        {committee.differentiator || committee.directorQuote ? (
          <StaggerGroup className="grid md:grid-cols-2 gap-12 items-center">
            {committee.differentiator ? (
              <StaggerItem>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                  <h2 className="text-2xl font-serif text-[#0A192F] mb-4">
                    The BAI Difference
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {committee.differentiator}
                  </p>
                </div>
              </StaggerItem>
            ) : null}

            {committee.directorQuote ? (
              <StaggerItem>
                <blockquote className="text-xl md:text-2xl font-serif italic text-[#0A192F] leading-relaxed border-l-4 border-[#0A192F] pl-6 py-2">
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
              <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
                What You&apos;ll Learn
              </h2>
            </FadeUp>
            <StaggerGroup className="grid md:grid-cols-2 gap-4">
              {learnBullets.map((item) => (
                <StaggerItem key={item} className="flex items-start">
                  <span className="text-[#0A192F] mr-3 mt-1">•</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        ) : null}

        {projects.length > 0 ? (
          <section>
            <FadeUp>
              <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
                Signature Projects
              </h2>
            </FadeUp>
            <StaggerGroup className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <StaggerItem
                  key={project._id}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-bold text-[#0A192F] mb-3">
                    {project.name ?? ''}
                  </h3>
                  {project.summary ? (
                    <p className="text-gray-600 leading-relaxed">{project.summary}</p>
                  ) : null}
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        ) : null}

        {curriculumBlocks.length > 0 ? (
          <FadeUp>
            <section>
              <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
                Curriculum{' '}
                <span className="text-gray-400 text-2xl font-sans ml-2">(Fall 2026)</span>
              </h2>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden px-6 py-4 prose prose-lg max-w-none">
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
    console.error('[committees/[slug]] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}
