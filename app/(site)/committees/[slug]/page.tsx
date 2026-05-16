import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { PortableText } from 'next-sanity';
import { stegaClean } from 'next-sanity';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  committeeDetailFallback,
  committeeDetailFallbackCurriculum,
} from '@/app/_components/fallbacks/committee-detail';
import { footerFallback } from '@/app/_components/fallbacks/footer';
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
    const { data } = await sanityFetch({ query: committeeSlugsQuery });
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
  if (!committee) return { title: 'Committee Not Found' };

  const cleaned = stegaClean(committee);
  const settings = stegaClean(await loadSiteSettings());

  const suffix = settings.titleSuffix ?? ' — Bruin Alpha Investment at UCLA';
  const title = `${cleaned.name ?? 'Committee'}${suffix}`;
  const description =
    cleaned.tagline ?? settings.defaultMetaDescription ?? '';

  return { title, description };
}

export default async function CommitteeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const committee = await loadCommittee(slug);
  if (!committee) notFound();

  const directorName = committee.director
    ? [committee.director.firstName, committee.director.lastName]
        .filter(Boolean)
        .join(' ')
        .trim()
    : null;
  const directorLabel = directorName || committee.directorPlaceholder || 'TBD';

  const curriculumBlocks = committee.curriculum && committee.curriculum.length > 0
    ? committee.curriculum
    : committeeDetailFallbackCurriculum;

  const learnBullets = committee.learn ?? [];
  const projects = committee.projects ?? [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-gray-900 font-sans pb-24">
      <section className="pt-32 pb-16 px-6 md:px-12 max-w-5xl mx-auto">
        <Link
          href="/committees"
          className="inline-flex items-center text-[#0A192F] hover:text-blue-700 transition-colors mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Committees
        </Link>

        <h1 className="text-5xl md:text-6xl font-serif text-[#0A192F] mb-6 leading-tight">
          {committee.name ?? ''}
        </h1>

        {committee.tagline ? (
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mb-8 leading-relaxed font-light">
            {committee.tagline}
          </p>
        ) : null}

        <div className="inline-flex items-center bg-[#0A192F] text-[#FAF9F6] px-5 py-2.5 rounded-full text-sm font-medium tracking-wide">
          Director: {directorLabel}
        </div>
      </section>

      <div className="px-6 md:px-12 max-w-5xl mx-auto space-y-20">
        {committee.differentiator || committee.director_quote ? (
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {committee.differentiator ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-serif text-[#0A192F] mb-4">
                  The BAI Difference
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {committee.differentiator}
                </p>
              </div>
            ) : null}

            {committee.director_quote ? (
              <blockquote className="text-xl md:text-2xl font-serif italic text-[#0A192F] leading-relaxed border-l-4 border-[#0A192F] pl-6 py-2">
                {committee.director_quote}
              </blockquote>
            ) : null}
          </div>
        ) : null}

        {committee.description && committee.description.length > 0 ? (
          <section className="prose prose-lg max-w-none">
            <PortableText value={committee.description} />
          </section>
        ) : null}

        {learnBullets.length > 0 ? (
          <section>
            <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
              What You&apos;ll Learn
            </h2>
            <ul className="grid md:grid-cols-2 gap-4">
              {learnBullets.map((item) => (
                <li key={item} className="flex items-start">
                  <span className="text-[#0A192F] mr-3 mt-1">•</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {projects.length > 0 ? (
          <section>
            <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
              Signature Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-bold text-[#0A192F] mb-3">
                    {project.name ?? ''}
                  </h3>
                  {project.summary ? (
                    <p className="text-gray-600 leading-relaxed">{project.summary}</p>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {curriculumBlocks.length > 0 ? (
          <section>
            <h2 className="text-3xl font-serif text-[#0A192F] mb-8 border-b border-gray-200 pb-4">
              Curriculum{' '}
              <span className="text-gray-400 text-2xl font-sans ml-2">(Fall 2026)</span>
            </h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden px-6 py-4 prose prose-lg max-w-none">
              <PortableText value={curriculumBlocks} />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
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
