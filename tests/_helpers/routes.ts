/**
 * Canonical list of site routes exercised by the per-page Playwright suite.
 *
 * Kept in sync by hand with the public routes emitted by `app/sitemap.ts`.
 * Each entry is a stable, server-rendered route under `(site)`.
 * Studio routes live under `/studio` and are deliberately excluded — they're
 * a third-party SPA shell and not part of the public marketing surface.
 *
 * If a new top-level page lands under `app/(site)/`, add it here so every
 * cross-cutting check (titles, disclaimer, forbidden language, overflow,
 * console errors, reduced-motion) picks it up automatically.
 */
export const SITE_ROUTES = [
  '/',
  '/about',
  '/committees',
  '/committees/wealth-management',
  '/committees/trading',
  '/committees/consulting',
  '/committees/investment-banking',
  '/training',
  '/projects',
  '/team',
  '/events',
  '/join',
] as const;

export type SiteRoute = (typeof SITE_ROUTES)[number];
