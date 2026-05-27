import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();

test('training screenshot copy is not hardcoded in the route component', async () => {
  const source = await readFile(
    path.join(root, 'app/(site)/training/page.tsx'),
    'utf8',
  );

  for (const phrase of [
    'Executive Board',
    'Committee Meeting',
    'Asynchronous Work',
    'Members complete a 30-page consolidated study guide',
    'Quarterly All-Club Project',
  ]) {
    expect(
      source,
      `Move "${phrase}" into Sanity-backed fallback/seed data`,
    ).not.toContain(phrase);
  }
});

test('about founder quote is not hardcoded in the route component', async () => {
  const source = await readFile(
    path.join(root, 'app/(site)/about/page.tsx'),
    'utf8',
  );

  expect(
    source,
    'Move the founder quote into Sanity-backed about page data',
  ).not.toContain('aboutQuoteFallback');
  expect(
    source,
    'Move the values heading into Sanity-backed about page data',
  ).not.toContain('What Sets Us Apart');
});

test('committee fallback pages can hide curriculum completely', async ({
  page,
}) => {
  await page.goto('/committees/trading', { waitUntil: 'domcontentloaded' });

  await expect(
    page.getByRole('heading', { name: /^Curriculum/ }),
    'Disabled committee curriculum must not render heading or block wrapper',
  ).toHaveCount(0);
  await expect(
    page.getByText('Week 1 — Introduction & Core Concepts'),
    'Disabled committee curriculum must not render fallback curriculum text',
  ).toHaveCount(0);
});
