import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import { footerFallback } from '@/app/_components/fallbacks/footer';
import {
  projectsListFallback,
  projectsPageFallback,
} from '@/app/_components/fallbacks/projects-page';
import { resolveOgImages } from '@/app/_components/og-image';
import { sanityFetch } from '@/sanity/lib/live';
import {
  allProjectsQuery,
  projectsPageQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries';
import type {
  AllProjectsQueryResult,
  ProjectsPageQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity/types/generated';

type ProjectsPageData = NonNullable<ProjectsPageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;
type ProjectEntry = AllProjectsQueryResult[number];
type StatusKey = NonNullable<ProjectEntry['status']>;

const STATUS_DISPLAY: Record<StatusKey, { label: string; dot: string; emphasis: boolean }> = {
  planning: { label: 'Planning', dot: 'bg-gold-start', emphasis: true },
  active: { label: 'Active', dot: 'bg-green-500', emphasis: false },
  completed: { label: 'Completed', dot: 'bg-navy', emphasis: false },
};

export async function generateMetadata(): Promise<Metadata> {
  const [pageRaw, settingsRaw] = await Promise.all([
    loadProjectsPageData(),
    loadSiteSettings(),
  ]);
  const page = stegaClean(pageRaw);
  const settings = stegaClean(settingsRaw);

  const suffix = settings.titleSuffix ?? ' — Bruin Alpha Investment at UCLA';
  const fallbackTitle = `Projects & Research${suffix}`;
  const title = page.seo?.title ?? fallbackTitle;
  const description =
    page.seo?.description ??
    settings.defaultMetaDescription ??
    projectsPageFallback.seo?.description ??
    '';

  const images = resolveOgImages(page.seo?.ogImage, settings.defaultOgImage, title);

  return {
    title,
    description,
    openGraph: images ? { title, description, images } : { title, description },
  };
}

export default async function ProjectsPage() {
  const [page, projects] = await Promise.all([
    loadProjectsPageData(),
    loadProjectsList(),
  ]);

  const heading = page.hero?.heading ?? projectsPageFallback.hero?.heading ?? 'What We Build';
  const subheading = page.hero?.subheading ?? projectsPageFallback.hero?.subheading ?? '';
  const intro = page.intro ?? projectsPageFallback.intro;
  const emptyState = page.emptyState ?? projectsPageFallback.emptyState ?? '';
  const statusLegend = page.statusLegend ?? projectsPageFallback.statusLegend ?? [];

  return (
    <div className="bg-cream text-navy min-h-screen pt-32 pb-24">
      <section className="px-6 md:px-12 lg:px-24 mb-24 max-w-7xl mx-auto">
        <h1 className="font-serif text-h1 font-light tracking-tight mb-6">{heading}</h1>
        <p className="text-xl md:text-2xl font-light leading-relaxed max-w-3xl">
          {subheading}
        </p>
        {intro ? (
          <p className="mt-6 text-lg leading-relaxed opacity-80 max-w-3xl">{intro}</p>
        ) : null}
      </section>

      <section className="px-6 md:px-12 lg:px-24 mb-32 max-w-7xl mx-auto">
        {projects.length === 0 ? (
          <p className="opacity-70">{emptyState}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => {
              const statusKey = project.status ?? 'planning';
              const statusInfo = STATUS_DISPLAY[statusKey];
              return (
                <div
                  key={project._id}
                  className="bg-offwhite border border-border-subtle p-8 flex flex-col hover:border-gold-start transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {project.committee?.name ? (
                      <span className="bg-navy text-cream text-xs font-bold uppercase tracking-widest px-3 py-1">
                        {project.committee.name}
                      </span>
                    ) : null}
                    <span className="border border-gold-start text-gold-start text-xs font-bold uppercase tracking-widest px-3 py-1 flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${statusInfo.dot} ${statusInfo.emphasis ? 'animate-pulse' : ''}`}
                      ></span>
                      {statusInfo.label}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl mb-4">{project.name ?? ''}</h2>
                  {project.summary ? (
                    <p className="opacity-80 leading-relaxed mt-auto">{project.summary}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {statusLegend.length > 0 ? (
        <section className="px-6 md:px-12 lg:px-24 max-w-7xl mx-auto border-t border-border-subtle pt-12">
          <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-70">
            Status Legend
          </h3>
          <ul className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-sm">
            {statusLegend.map((entry) => {
              const key = entry.status ?? 'planning';
              const info = STATUS_DISPLAY[key];
              const showDimmed = key !== 'planning';
              return (
                <li
                  key={entry._key}
                  className={`flex items-center gap-3 ${showDimmed ? 'opacity-50 grayscale' : ''}`}
                >
                  <span className={`w-3 h-3 rounded-full ${info.dot}`}></span>
                  <span>
                    <strong className="block">{info.label}</strong>
                    {entry.description ?? ''}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

async function loadProjectsPageData(): Promise<ProjectsPageData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return projectsPageFallback;
  try {
    const { data } = await sanityFetch({ query: projectsPageQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data ?? projectsPageFallback;
  } catch (err) {
    console.error('[projects] page fetch failed; using fallback:', err);
    return projectsPageFallback;
  }
}

async function loadProjectsList(): Promise<AllProjectsQueryResult> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return projectsListFallback;
  try {
    const { data } = await sanityFetch({ query: allProjectsQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data && data.length > 0 ? data : projectsListFallback;
  } catch (err) {
    console.error('[projects] list fetch failed; using fallback:', err);
    return projectsListFallback;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error('[projects] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}
