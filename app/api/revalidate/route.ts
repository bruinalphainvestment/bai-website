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
 */
import { revalidatePath, revalidateTag } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

type WebhookPayload = {
  _type: string;
  _id: string;
  slug?: { current?: string };
  previousSlug?: string;
};

/** Map doc-type → list paths to revalidate. All 14 doc types wired up front. */
const LIST_PATHS: Record<string, string[]> = {
  committee: ['/committees'],
  foundingMember: ['/team', '/'],
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

    if (body._type === 'committee' && body.slug?.current) {
      revalidatePath(`/committees/${body.slug.current}`);
      if (body.previousSlug && body.previousSlug !== body.slug.current) {
        revalidatePath(`/committees/${body.previousSlug}`);
      }
    }

    return NextResponse.json({
      revalidated: true,
      _type: body._type,
      _id: body._id ?? null,
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new NextResponse(`Webhook error: ${message}`, { status: 500 });
  }
}
