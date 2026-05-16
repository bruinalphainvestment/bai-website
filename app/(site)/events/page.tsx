import type { Metadata } from 'next';
import { stegaClean } from 'next-sanity';

import {
  eventsListFallback,
  eventsPageFallback,
} from '@/app/_components/fallbacks/events-page';
import { footerFallback } from '@/app/_components/fallbacks/footer';
import { resolveOgImages } from '@/app/_components/og-image';
import { sanityFetch } from '@/sanity/lib/live';
import {
  allEventsQuery,
  eventsPageQuery,
  siteSettingsQuery,
} from '@/sanity/lib/queries';
import type {
  AllEventsQueryResult,
  EventsPageQueryResult,
  SiteSettingsQueryResult,
} from '@/sanity/types/generated';

type EventsPageData = NonNullable<EventsPageQueryResult>;
type SiteSettingsData = NonNullable<SiteSettingsQueryResult>;
type EventEntry = AllEventsQueryResult[number];

export async function generateMetadata(): Promise<Metadata> {
  const [pageRaw, settingsRaw] = await Promise.all([
    loadEventsPageData(),
    loadSiteSettings(),
  ]);
  const page = stegaClean(pageRaw);
  const settings = stegaClean(settingsRaw);

  const suffix = settings.titleSuffix ?? ' — Bruin Alpha Investment at UCLA';
  const fallbackTitle = `Events${suffix}`;
  const title = page.seo?.title ?? fallbackTitle;
  const description =
    page.seo?.description ??
    settings.defaultMetaDescription ??
    eventsPageFallback.seo?.description ??
    '';

  const images = resolveOgImages(page.seo?.ogImage, settings.defaultOgImage, title);

  return {
    title,
    description,
    openGraph: images ? { title, description, images } : { title, description },
  };
}

export default async function EventsPage() {
  const [page, eventsList] = await Promise.all([
    loadEventsPageData(),
    loadEventsList(),
  ]);

  const heading = page.hero?.heading ?? eventsPageFallback.hero?.heading ?? 'Where to Find Us';
  const subheading = page.hero?.subheading ?? eventsPageFallback.hero?.subheading ?? '';
  const intro = page.intro ?? eventsPageFallback.intro;
  const upcomingEmpty = page.upcomingEmptyState ?? eventsPageFallback.upcomingEmptyState ?? '';
  const pastEmpty = page.pastEmptyState ?? eventsPageFallback.pastEmptyState ?? '';

  const competitions = eventsList.filter((event) => event.type === 'comp');
  const upcoming = eventsList.filter((event) => event.type !== 'comp');

  return (
    <div className="min-h-screen bg-cream text-navy pt-32 pb-24">
      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-20 md:mb-32">
        <h1 className="font-display text-5xl md:text-7xl mb-6">{heading}</h1>
        <p className="font-sans text-xl md:text-2xl text-navy/80 max-w-3xl">
          {subheading}
        </p>
        {intro ? (
          <p className="font-sans mt-6 text-lg text-navy/70 max-w-3xl">{intro}</p>
        ) : null}
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          Upcoming &amp; Ongoing
        </h2>
        {upcoming.length === 0 ? (
          <p className="font-sans text-navy/70">{upcomingEmpty}</p>
        ) : (
          <div className="space-y-8">
            {upcoming.map((event, i) => (
              <UpcomingCard key={event._id} event={event} variant={i === 0 ? 'filled' : 'outlined'} />
            ))}
          </div>
        )}
      </section>

      <section className="px-4 md:px-8 max-w-7xl mx-auto mb-24 md:mb-32">
        <h2 className="font-display text-3xl md:text-4xl mb-12 border-b border-navy/10 pb-6">
          Competitions
        </h2>
        {competitions.length === 0 ? (
          <p className="font-sans text-navy/70">{pastEmpty}</p>
        ) : (
          <div className="space-y-8">
            {competitions.map((event, i) => (
              <CompetitionRow
                key={event._id}
                event={event}
                isLast={i === competitions.length - 1}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UpcomingCard({ event, variant }: { event: EventEntry; variant: 'filled' | 'outlined' }) {
  const wrapperClass =
    variant === 'filled'
      ? 'flex flex-col md:flex-row md:items-start gap-4 md:gap-12 bg-deep/5 p-8 rounded-sm'
      : 'flex flex-col md:flex-row md:items-start gap-4 md:gap-12 p-8 border border-navy/10 rounded-sm';
  const dateLabel = formatDateLabel(event);
  const locationLabel = event.location ? `Location: ${event.location}` : null;
  return (
    <div className={wrapperClass}>
      <div className="md:w-1/4 flex-shrink-0">
        {dateLabel ? (
          <span className="font-sans font-medium text-navy/80 uppercase tracking-wider text-sm block mb-1">
            {dateLabel}
          </span>
        ) : null}
        {locationLabel ? (
          <span className="text-navy/60 text-sm">{locationLabel}</span>
        ) : null}
      </div>
      <div>
        <h3 className="font-display text-2xl mb-3">{event.name ?? ''}</h3>
        {event.description ? (
          <p className="font-sans text-navy/80 leading-relaxed">{event.description}</p>
        ) : null}
      </div>
    </div>
  );
}

function CompetitionRow({ event, isLast }: { event: EventEntry; isLast: boolean }) {
  const dateLabel = formatDateLabel(event);
  const ownerLabel = event.committee?.name ?? null;
  return (
    <div
      className={`flex flex-col md:flex-row md:items-start gap-4 md:gap-12 ${isLast ? 'pb-8' : 'border-b border-navy/5 pb-8'}`}
    >
      <div className="md:w-1/4 flex-shrink-0">
        {ownerLabel ? (
          <span className="font-sans font-medium text-navy/80 block mb-1">
            {ownerLabel}
          </span>
        ) : null}
        {dateLabel ? (
          <span className="text-navy/60 text-sm">Date: {dateLabel}</span>
        ) : null}
      </div>
      <div>
        <h3 className="font-display text-xl mb-2">{event.name ?? ''}</h3>
        {event.description ? (
          <p className="font-sans text-navy/80 text-sm">{event.description}</p>
        ) : null}
      </div>
    </div>
  );
}

function formatDateLabel(event: EventEntry): string {
  if (event.date) {
    return new Date(event.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
  if (event.status === 'scheduled') return 'Coming Soon';
  if (event.status === 'past') return 'Past';
  return 'TBD';
}

async function loadEventsPageData(): Promise<EventsPageData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return eventsPageFallback;
  try {
    const { data } = await sanityFetch({ query: eventsPageQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data ?? eventsPageFallback;
  } catch (err) {
    console.error('[events] page fetch failed; using fallback:', err);
    return eventsPageFallback;
  }
}

async function loadEventsList(): Promise<AllEventsQueryResult> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return eventsListFallback;
  try {
    const { data } = await sanityFetch({ query: allEventsQuery });
    // Return stega-encoded data for JSX rendering (Visual Editing overlays need PUA chars).
    return data && data.length > 0 ? data : eventsListFallback;
  } catch (err) {
    console.error('[events] list fetch failed; using fallback:', err);
    return eventsListFallback;
  }
}

async function loadSiteSettings(): Promise<SiteSettingsData> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return footerFallback;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    return data ?? footerFallback;
  } catch (err) {
    console.error('[events] siteSettings fetch failed; using fallback:', err);
    return footerFallback;
  }
}
