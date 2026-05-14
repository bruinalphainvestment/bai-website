import { test, expect, type Page } from '@playwright/test';
import { SITE_ROUTES } from './_helpers/routes';

const FORBIDDEN_PATTERN =
  /manage real client money|live trading|registered investment adviser|polymarket|AUM|assets under management/i;

async function getMainText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const main = document.querySelector('main');
    const root = main ?? document.body;
    const clone = root.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('footer').forEach((f) => f.remove());
    return clone.textContent ?? '';
  });
}

for (const route of SITE_ROUTES) {
  test(`forbidden-language: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const text = await getMainText(page);
    const match = text.match(FORBIDDEN_PATTERN);
    expect(
      match,
      `Forbidden phrase "${match?.[0] ?? ''}" found on ${route}. ` +
        `See .sisyphus/notepads/bai-website/learnings.md "Hard Guardrails".`,
    ).toBeNull();
  });
}
