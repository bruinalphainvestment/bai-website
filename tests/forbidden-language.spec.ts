import { test, expect, type Page } from '@playwright/test';
import { SITE_ROUTES } from './_helpers/routes';

const STRICT_FORBIDDEN_PATTERN =
  /manage real client money|live trading|polymarket|\bAUM\b|assets under management/i;

const RIA_PATTERN = /registered investment adviser/gi;

async function getMainText(page: Page): Promise<string> {
  return page.evaluate(() => {
    const main = document.querySelector('main');
    const root = main ?? document.body;
    const clone = root.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('footer').forEach((f) => f.remove());
    return clone.textContent ?? '';
  });
}

function findUnnegatedRiaMatches(text: string): Array<{ index: number; context: string }> {
  const offenders: Array<{ index: number; context: string }> = [];
  for (const match of text.matchAll(RIA_PATTERN)) {
    const matchIndex = match.index ?? 0;
    const lookbehindStart = Math.max(0, matchIndex - 30);
    const preceding = text.substring(lookbehindStart, matchIndex);
    if (!/\bnot\b/i.test(preceding)) {
      offenders.push({ index: matchIndex, context: text.substring(lookbehindStart, matchIndex + match[0].length) });
    }
  }
  return offenders;
}

for (const route of SITE_ROUTES) {
  test(`forbidden-language: ${route}`, async ({ page }) => {
    await page.goto(route, { waitUntil: 'domcontentloaded' });
    const text = await getMainText(page);

    const strictMatch = text.match(STRICT_FORBIDDEN_PATTERN);
    expect(
      strictMatch,
      `Forbidden phrase "${strictMatch?.[0] ?? ''}" found on ${route}. ` +
        `See .sisyphus/notepads/bai-website/learnings.md "Hard Guardrails".`,
    ).toBeNull();

    const riaOffenders = findUnnegatedRiaMatches(text);
    expect(
      riaOffenders,
      `Non-negated "registered investment adviser" reference(s) on ${route}: ` +
        `${riaOffenders.map((o) => `"…${o.context}"`).join(' | ')}. ` +
        `Compliant form must be preceded by "not" within 30 chars (e.g. "BAI is not a registered investment adviser").`,
    ).toEqual([]);
  });
}
