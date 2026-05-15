import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

import { client } from '@/sanity/lib/client';

/**
 * GET /api/draft-mode/enable
 *
 * Sanity Presentation Tool hits this handler with a dynamic per-session
 * `sanity-preview-secret` query param. We validate via the @sanity/preview-url-secret
 * package which looks up the secret doc in the Sanity dataset.
 *
 * If valid, enable Next.js draft mode and redirect to the target preview path.
 * Otherwise 401.
 */
export async function GET(request: Request): Promise<Response> {
  let isValid = false;
  let redirectTo = '/';

  try {
    const result = await validatePreviewUrl(
      client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
      request.url,
    );
    isValid = result.isValid;
    if (result.redirectTo) redirectTo = result.redirectTo;
  } catch (err) {
    console.error('[draft-mode/enable] validatePreviewUrl threw:', err);
    return new Response('Invalid preview secret', { status: 401 });
  }

  if (!isValid) {
    return new Response('Invalid preview secret', { status: 401 });
  }

  // Defensive: only allow same-origin internal redirects
  const safePath =
    redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';

  const draft = await draftMode();
  draft.enable();

  redirect(safePath);
}
