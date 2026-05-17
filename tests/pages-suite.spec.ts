import { test, expect, type ConsoleMessage } from '@playwright/test';
import { SITE_ROUTES } from './_helpers/routes';

const TITLE_FRAGMENT = 'Bruin Alpha Investment at UCLA';
const DISCLAIMER_FRAGMENT = 'registered student organization at UCLA';

for (const route of SITE_ROUTES) {
  test.describe(`route ${route}`, () => {
    test('h1 + title + disclaimer + no console errors + no horizontal overflow @1280', async ({
      page,
      viewport,
    }, testInfo) => {
      const consoleErrors: string[] = [];
      page.on('console', (msg: ConsoleMessage) => {
        if (msg.type() === 'error') {
          const text = msg.text();
          if (text.includes('Failed to load resource')) return;
          consoleErrors.push(text);
        }
      });
      page.on('pageerror', (err) => {
        consoleErrors.push(`pageerror: ${err.message}`);
      });

      await page.goto(route, { waitUntil: 'domcontentloaded' });

      const h1 = page.getByRole('heading', { level: 1 }).first();
      await expect(h1, `h1 missing on ${route}`).toBeVisible();
      const h1Text = (await h1.innerText()).trim();
      expect(h1Text.length, `empty h1 on ${route}`).toBeGreaterThan(0);

      const title = await page.title();
      expect(title, `title missing fragment on ${route}: "${title}"`).toContain(
        TITLE_FRAGMENT,
      );

      // Site footer is the last <footer> in the DOM. The .first() footer can
      // be a <blockquote><footer>...</footer></blockquote> attribution element
      // (e.g. on /about), which doesn't contain the disclaimer.
      const footerText = await page.locator('footer').last().innerText();
      expect(
        footerText,
        `disclaimer missing in footer on ${route}`,
      ).toContain(DISCLAIMER_FRAGMENT);

      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        };
      });
      expect(
        overflow.scrollWidth,
        `horizontal overflow on ${route} @${viewport?.width ?? '?'}: ` +
          `scrollWidth=${overflow.scrollWidth} innerWidth=${overflow.innerWidth}`,
      ).toBeLessThanOrEqual(overflow.innerWidth + 1);

      expect(
        consoleErrors,
        `console errors on ${route}: ${JSON.stringify(consoleErrors)}`,
      ).toEqual([]);

      void testInfo;
    });
  });
}
