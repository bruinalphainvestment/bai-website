import { test, expect } from '@playwright/test';

test.describe('footer external links', () => {
  test('every external <a> in footer opens safely (target+rel hardening)', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const footer = page.locator('footer').first();
    await expect(footer, 'footer not found').toBeVisible();

    const externals = await footer.evaluate((el: HTMLElement) => {
      const anchors = Array.from(el.querySelectorAll<HTMLAnchorElement>('a[href]'));
      return anchors
        .filter((a) => {
          const href = a.getAttribute('href') ?? '';
          if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
          if (href.startsWith('#') || href.startsWith('/')) return false;
          try {
            const u = new URL(href, window.location.href);
            return u.host !== window.location.host;
          } catch {
            return false;
          }
        })
        .map((a) => ({
          href: a.getAttribute('href') ?? '',
          target: a.getAttribute('target') ?? '',
          rel: a.getAttribute('rel') ?? '',
        }));
    });

    expect(
      externals.length,
      'no external links found in footer — expected at least Instagram + LinkedIn',
    ).toBeGreaterThan(0);

    for (const link of externals) {
      expect(
        link.target,
        `footer external link missing target=_blank: ${link.href}`,
      ).toBe('_blank');
      expect(
        link.rel,
        `footer external link rel missing "noopener": ${link.href} (rel="${link.rel}")`,
      ).toMatch(/\bnoopener\b/);
      expect(
        link.rel,
        `footer external link rel missing "noreferrer": ${link.href} (rel="${link.rel}")`,
      ).toMatch(/\bnoreferrer\b/);
    }
  });
});
