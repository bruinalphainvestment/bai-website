import { defineLive } from 'next-sanity/live';

import { client } from './client';

/**
 * Sanity live-content API.
 *
 * `sanityFetch` — wrap every server-side Sanity read. Auto-tags responses for
 *   on-demand revalidation; integrates with Visual Editing when draftMode active.
 * `<SanityLive />` — client-side React component mounted in root layout that
 *   establishes the live-content channel.
 *
 * Per Decision D19 of cms-migration plan. Replaces ad-hoc `client.fetch()` calls.
 *
 * Token rules:
 * - `serverToken`: optional Viewer-permission token. Enables live preview in
 *   draftMode. We pass `SANITY_API_READ_TOKEN` (may be empty in dev — defineLive
 *   tolerates undefined).
 * - `browserToken`: optional Viewer token. Enables Visual Editing overlay clicks
 *   in the browser. We pass `NEXT_PUBLIC_SANITY_BROWSER_TOKEN` (may be empty;
 *   creates a TODO for the editor to mint via Sanity manage UI).
 *
 * NOTE: `defineLive` is exported from `next-sanity/live`, NOT the package root
 * (verified against next-sanity@12.4.5 exports map). The plan's snippet had it
 * imported from `next-sanity` — corrected here.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    apiVersion: '2025-01-01',
    useCdn: false,
  }),
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.NEXT_PUBLIC_SANITY_BROWSER_TOKEN,
});
