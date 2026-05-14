import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { timingSafeEqual } from 'node:crypto';

/**
 * GET /api/draft-mode/enable
 *
 * Sanity Presentation Tool hits this handler with `?sanity-preview-secret=...&sanity-preview-pathname=...`.
 * We verify the shared secret against `SANITY_STUDIO_PREVIEW_SECRET` using a
 * constant-time comparison, then enable Next.js draft mode and redirect to
 * the target preview path. Without a valid secret we return 401 — never leak
 * draft content into production.
 *
 * NOTE: We accept both `sanity-preview-secret` (modern Presentation) and
 * `secret` (legacy fallback) so manual smoke tests via curl keep working.
 */

export async function GET(request: Request): Promise<Response> {
  const expected = process.env.SANITY_STUDIO_PREVIEW_SECRET;

  if (typeof expected !== 'string' || expected.length === 0) {
    return new Response(
      'Draft mode is not configured. Set SANITY_STUDIO_PREVIEW_SECRET in the deployment environment.',
      { status: 500 },
    );
  }

  const url = new URL(request.url);
  const provided =
    url.searchParams.get('sanity-preview-secret') ??
    url.searchParams.get('secret');

  if (provided === null) {
    return new Response('Missing preview secret', { status: 401 });
  }

  const providedBuf = Buffer.from(provided);
  const expectedBuf = Buffer.from(expected);
  const isValid =
    providedBuf.length === expectedBuf.length &&
    timingSafeEqual(providedBuf, expectedBuf);

  if (!isValid) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  const requestedPath =
    url.searchParams.get('sanity-preview-pathname') ??
    url.searchParams.get('redirect') ??
    '/';
  // Defensive: only allow same-origin internal redirects (paths starting
  // with a single forward slash). Reject `//evil.com`, full URLs, and
  // anything else that could be used for an open-redirect.
  const safePath =
    requestedPath.startsWith('/') && !requestedPath.startsWith('//')
      ? requestedPath
      : '/';

  const draft = await draftMode();
  draft.enable();

  redirect(safePath);
}
