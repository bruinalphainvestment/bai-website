/**
 * Sanity → Vercel revalidation webhook (Metis §2.11, plan T1.3).
 *
 * Receives signed POSTs from Sanity Content Lake on every doc mutation. Calls
 * `revalidateTag` (so `sanityFetch`'s auto-tagged ISR cache entries flush) +
 * `revalidatePath` for list pages and dynamic routes.
 *
 * `parseBody(req, secret, true)` — third arg is MANDATORY (Content Lake
 * propagation delay): with `waitForContentLakeEventualConsistency=true` the
 * helper waits ~5s for the mutation to be queryable before returning, so the
 * subsequent revalidation can re-fetch fresh data instead of stale cached data.
 *
 * Webhook is configured in the Sanity Manage UI (T1.4 — manual step) with
 * the matching `SANITY_REVALIDATE_SECRET` from .env.local / Vercel env.
 *
 * Reference cascades (audit 2026-05-17):
 *   - foundingMember mutation → every /committees/{slug} where this person
 *     is the director field needs to revalidate. Same for /team and /
 *     (handled by LIST_PATHS).
 *   - project mutation → the /committees/{slug} that lists this project in
 *     its signatureProjects array needs to revalidate. Same for /projects
 *     (handled by LIST_PATHS).
 *   - committee mutation → /, /events, /projects all show committee names
 *     via reference, so they need to revalidate too (handled via the
 *     expanded LIST_PATHS entry).
 *
 * The cascade queries use the public read client (no token) since all the
 * lookups are slug/ref retrievals on the production dataset.
 */
import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from 'next-sanity';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

import { apiVersion, dataset, projectId } from '@/sanity/env';

type WebhookPayload = {
  _type: string;
  _id: string;
  slug?: { current?: string };
  previousSlug?: string;
};

/** Map doc-type → list paths to revalidate. */
const LIST_PATHS: Record<string, string[]> = {
  /* committee names surface in /events (CompetitionRow) and /projects (project
     cards via committee.name). Home page CommitteesTeaser also fetches the
     committee collection, so / must revalidate too. */
  committee: ['/committees', '/', '/events', '/projects'],
  /* foundingMember surfaces in /team, the home FoundingTeam section,
     and as director on /committees/{slug} (cascaded below per-id). */
  foundingMember: ['/team', '/'],
  /* project cards surface on /projects and inside the committee detail
     page's Signature Projects section (cascaded below per-id). */
  project: ['/projects'],
  event: ['/events'],
  faq: ['/join'],
  siteSettings: ['/'],
  homePage: ['/'],
  aboutPage: ['/about'],
  trainingPage: ['/training'],
  joinPage: ['/join'],
  eventsPage: ['/events'],
  projectsPage: ['/projects'],
  teamPage: ['/team'],
  committeesIndexPage: ['/committees'],
};

const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'published',
});

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      return new NextResponse(
        'Webhook secret not configured: set SANITY_REVALIDATE_SECRET',
        { status: 500 },
      );
    }

    const { isValidSignature, body } = await parseBody<WebhookPayload>(
      req,
      secret,
      true, // CRITICAL: wait for Content Lake propagation (Metis §2.11)
    );

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }

    if (!body?._type) {
      return new NextResponse('Bad request: missing _type', { status: 400 });
    }

    revalidateTag(body._type, 'max');
    if (body._id) revalidateTag(`${body._type}:${body._id}`, 'max');

    for (const p of LIST_PATHS[body._type] ?? []) {
      revalidatePath(p);
    }

    // Committee slug page + previous slug (rename handling).
    if (body._type === 'committee' && body.slug?.current) {
      revalidatePath(`/committees/${body.slug.current}`);
      if (body.previousSlug && body.previousSlug !== body.slug.current) {
        revalidatePath(`/committees/${body.previousSlug}`);
      }
    }

    // Reference cascades. Each lookup is a slug-only fetch on the public
    // dataset — cheap, idempotent, and safe to fail (we just log + continue).
    const cascaded = await cascadeRevalidate(body);

    return NextResponse.json({
      revalidated: true,
      _type: body._type,
      _id: body._id ?? null,
      cascaded,
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new NextResponse(`Webhook error: ${message}`, { status: 500 });
  }
}

/**
 * For mutations on referenced documents, look up every page that displays
 * them via a Sanity reference and revalidate that page too. Returns the
 * list of paths that were cascaded for logging/debugging.
 */
async function cascadeRevalidate(body: WebhookPayload): Promise<string[]> {
  if (!body._id) return [];

  const cascadedPaths: string[] = [];

  try {
    if (body._type === 'foundingMember') {
      // Director reference → committee detail page.
      const committees = await readClient.fetch<Array<{ slug: string | null }>>(
        `*[_type == "committee" && director._ref == $id && defined(slug.current)] {
          "slug": slug.current
        }`,
        { id: body._id },
      );
      for (const c of committees) {
        if (!c.slug) continue;
        const path = `/committees/${c.slug}`;
        revalidatePath(path);
        cascadedPaths.push(path);
      }
    } else if (body._type === 'project') {
      // signatureProjects array reference → committee detail page.
      const committees = await readClient.fetch<Array<{ slug: string | null }>>(
        `*[_type == "committee" && $id in signatureProjects[]._ref && defined(slug.current)] {
          "slug": slug.current
        }`,
        { id: body._id },
      );
      for (const c of committees) {
        if (!c.slug) continue;
        const path = `/committees/${c.slug}`;
        revalidatePath(path);
        cascadedPaths.push(path);
      }
    }
  } catch (err) {
    console.error('[revalidate] cascade lookup failed:', err);
  }

  return cascadedPaths;
}
