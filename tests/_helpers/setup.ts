import type { Page } from '@playwright/test';

declare global {
  interface Window {
    __lenis?: unknown;
  }
}

/**
 * Navigate to `path` and wait until Lenis has attached to `window.__lenis`.
 * Returns once the smooth-scroll instance is ready, so subsequent scroll
 * interactions in tests run against a fully wired-up page.
 *
 * Falls back gracefully (resolves anyway after a short timeout) when Lenis
 * is intentionally disabled (e.g. reduced-motion contexts).
 */
export async function setupPageWithLenis(
  page: Page,
  path = '/',
): Promise<void> {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page
    .waitForFunction(() => typeof window.__lenis !== 'undefined', null, {
      timeout: 3000,
    })
    .catch(() => {
      /* Lenis may be disabled (reduced-motion) — proceed regardless. */
    });
}
