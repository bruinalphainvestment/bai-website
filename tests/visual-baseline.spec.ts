import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

/**
 * T6.1 — Phase 6 pre-cutover visual baseline.
 *
 * Captures full-page screenshots of every public marketing route at desktop
 * (1280x800) and mobile (375x667) viewports. The output PNGs are committed
 * under `tests/__snapshots__/visual-baseline/` and used post-cutover to
 * assert a <1% pixel diff per Metis §5.1.
 *
 * Run against a preview URL by setting `BASE_URL`:
 *   BASE_URL=https://bai-website-<sha>-spyicydevs-projects.vercel.app \
 *     bunx playwright test tests/visual-baseline.spec.ts \
 *     --project=chromium-desktop \
 *     --project=chromium-mobile-375
 *
 * Animations / motion are disabled inside the test via `reducedMotion: 'reduce'`
 * + `prefers-reduced-motion` query, so re-runs are deterministic.
 */

const ROUTES = [
  '/',
  '/about',
  '/committees',
  '/committees/trading',
  '/team',
  '/projects',
  '/events',
  '/training',
  '/join',
] as const;

const SNAPSHOT_DIR = path.join(
  __dirname,
  '__snapshots__',
  'visual-baseline',
);

test.beforeAll(() => {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
});

async function settle(page: Page): Promise<void> {
  // Disable transitions/animations + image-lazy-load to stabilize.
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `,
  });
  // Wait for fonts + idle network.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForLoadState('networkidle').catch(() => {});
}

for (const route of ROUTES) {
  test.describe(`baseline ${route}`, () => {
    test(`capture screenshot`, async ({ page, viewport }) => {
      const viewportLabel =
        viewport && viewport.width <= 480 ? 'mobile' : 'desktop';
      const safeRoute = route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '_');
      const filename = `baseline-${safeRoute}-${viewportLabel}.png`;
      const outPath = path.join(SNAPSHOT_DIR, filename);

      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(
        response,
        `navigation to ${route} returned no response`,
      ).not.toBeNull();
      expect(
        response!.status(),
        `unexpected status on ${route}: ${response!.status()}`,
      ).toBeLessThan(400);

      await settle(page);

      await page.screenshot({
        path: outPath,
        fullPage: true,
        animations: 'disabled',
      });

      // Sanity-check the file exists and has non-trivial size.
      const stat = fs.statSync(outPath);
      expect(stat.size, `screenshot for ${route} is empty`).toBeGreaterThan(1024);
    });
  });
}
