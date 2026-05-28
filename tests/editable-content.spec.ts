import { expect, test } from '@playwright/test';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const sourceRoots = ['app'] as const;

const visibleCmsPhrases = [
  'The Rotational Program',
  'Executive Board',
  'Committee Meeting',
  'Asynchronous Work',
  'Members complete a 30-page consolidated study guide',
  'Quarterly All-Club Project',
  'Our Story',
  'What Sets Us Apart',
  'Application Process',
  'Coffee Chat',
  'Link to Application',
  'Get in Touch',
  '@bruinalphainvestment',
  'Upcoming & Ongoing',
  'Enormous Activities Fair',
  'CME Trading Challenge',
  'Status Legend',
  'Event-Contract Modeling Research',
  'UCLA Club Audit Initiative',
  'Active Community',
  'The Founding Class',
  'Connected by Design',
  'What you',
  'We are starting it, we are building it',
  'Curriculum in development',
  'SIE Study Pod',
  'Internal Trading Competition',
  'External Competitions',
  'Industry Case Competitions',
  'Live Deal Tear-Down',
  'TBD — UCLA Campus',
  'The market is an incredible teacher',
] as const;

async function listSourceFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return listSourceFiles(fullPath);
      if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) return [fullPath];
      return [];
    }),
  );
  return nested.flat();
}

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

test('visible editorial content is not hardcoded in app render or fallback modules', async () => {
  const files = (
    await Promise.all(sourceRoots.map((dir) => listSourceFiles(path.join(root, dir))))
  ).flat();

  const offenders: string[] = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    for (const phrase of visibleCmsPhrases) {
      if (source.includes(phrase)) {
        offenders.push(`${path.relative(root, file)} contains "${phrase}"`);
      }
    }
  }

  expect(
    offenders,
    'Visible website content belongs in Sanity schema/queries/seed data, not render components or fallbacks.',
  ).toEqual([]);
});

test('newly migrated visible labels are queried and seeded for Sanity', async () => {
  const [queries, seed] = await Promise.all([
    readFile(path.join(root, 'sanity/lib/queries.ts'), 'utf8'),
    readFile(path.join(root, 'sanity/seed/seed.ts'), 'utf8'),
  ]);

  for (const field of [
    'applicationProcessHeading',
    'applicationSteps',
    'timelineHeading',
    'faqHeading',
    'contactHeading',
    'contactLinks',
    'upcomingHeading',
    'competitionsHeading',
    'externalCtaLabel',
    'statusLegendHeading',
    'cardLearnHeading',
    'cardCtaLabel',
  ]) {
    expect(queries, `${field} must be selected by a Sanity query`).toContain(
      field,
    );
    expect(seed, `${field} must be present in migration seed data`).toContain(
      field,
    );
  }

  for (const phrase of [
    'Application Process',
    'Coffee Chat',
    'Upcoming & Ongoing',
    'Status Legend',
    '@bruinalphainvestment',
  ]) {
    expect(seed, `"${phrase}" must be seeded into Sanity`).toContain(phrase);
  }
});

test('founding member config fields have public app bindings', async () => {
  const [schema, queries, teamPage, foundingTeam, committeeDetail] =
    await Promise.all([
      readFile(path.join(root, 'sanity/schemas/foundingMember.ts'), 'utf8'),
      readFile(path.join(root, 'sanity/lib/queries.ts'), 'utf8'),
      readFile(path.join(root, 'app/(site)/team/page.tsx'), 'utf8'),
      readFile(path.join(root, 'app/_components/sections/founding-team.tsx'), 'utf8'),
      readFile(path.join(root, 'app/(site)/committees/[slug]/page.tsx'), 'utf8'),
    ]);

  const memberFields = [
    'firstName',
    'lastName',
    'role',
    'committee',
    'gradYear',
    'bio',
    'photoReleaseObtained',
    'headshot',
    'monogramOverride',
    'linkedinUrl',
  ] as const;

  for (const field of memberFields) {
    expect(schema, `${field} must exist in the foundingMember schema`).toContain(
      `name: '${field}'`,
    );
    expect(
      queries,
      `${field} must be selected by a public foundingMember query`,
    ).toContain(field);
  }

  for (const usage of [
    'member.firstName',
    'member.lastName',
    'member.role',
    'member.committee',
    'member.gradYear',
    'member.bio',
    'member.photoReleaseObtained',
    'member.headshot',
    'member.monogramOverride',
    'member.linkedinUrl',
  ]) {
    expect(teamPage, `${usage} must be rendered or drive rendering on /team`).toContain(
      usage,
    );
  }

  expect(
    foundingTeam,
    'Home founding team cards must expose configured member links.',
  ).toContain('member.linkedinUrl');
  expect(
    foundingTeam,
    'Home founding team cards must render configured member bios.',
  ).toContain('member.bio');
  expect(
    committeeDetail,
    'Committee director cards must expose configured member links.',
  ).toContain('director.linkedinUrl');
  expect(
    committeeDetail,
    'Committee director cards must render configured member committee labels.',
  ).toContain('director.committee');
  expect(
    committeeDetail,
    'Committee director cards must render configured member bios.',
  ).toContain('director.bio');
});

test('committee detail visible content is seeded and main project grid stays exact', async () => {
  const [queries, seed] = await Promise.all([
    readFile(path.join(root, 'sanity/lib/queries.ts'), 'utf8'),
    readFile(path.join(root, 'sanity/seed/seed.ts'), 'utf8'),
  ]);

  expect(queries).toContain('signatureProjects[]->');
  expect(queries).toContain('showOnProjectsPage != false');

  for (const phrase of [
    'directorQuote',
    'signatureProjects',
    'SIE Study Pod',
    'Internal Trading Competition',
    'External Competitions',
    'Industry Case Competitions',
    'Live Deal Tear-Down',
    'showOnProjectsPage: false',
  ]) {
    expect(seed, `${phrase} must be represented in Sanity seed data`).toContain(
      phrase,
    );
  }
});

test('preserve seed does not overwrite intentionally empty editor values', async () => {
  const seed = await readFile(path.join(root, 'sanity/seed/seed.ts'), 'utf8');

  expect(seed).toContain('setIfMissing');
  expect(seed).not.toContain('patch.set(setValues)');
  expect(seed).toContain('cleanupLegacySeedArtifacts');
  expect(seed).toContain('LEGACY_EVENT_DATES');
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
