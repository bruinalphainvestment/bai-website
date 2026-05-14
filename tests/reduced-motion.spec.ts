import { test, expect } from '@playwright/test';
import { SITE_ROUTES } from './_helpers/routes';

for (const route of SITE_ROUTES) {
  test(`reduced-motion renders cleanly: ${route}`, async ({ browser }, testInfo) => {
    const context = await browser.newContext({
      reducedMotion: 'reduce',
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    try {
      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const h1 = page.getByRole('heading', { level: 1 }).first();
      await expect(h1, `h1 missing under reduced-motion on ${route}`).toBeVisible();

      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        overflow.scrollWidth,
        `reduced-motion horizontal overflow on ${route}`,
      ).toBeLessThanOrEqual(overflow.clientWidth + 1);

      const slug =
        route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '__');
      const screenshot = await page.screenshot({ fullPage: false });
      await testInfo.attach(`reduced-motion-${slug}.png`, {
        body: screenshot,
        contentType: 'image/png',
      });
    } finally {
      await context.close();
    }
  });
}
