/**
 * One-shot SEO content seed: populates seo.title + seo.description on every
 * singleton page document and every committee document, and refreshes the
 * keyword-rich defaults on siteSettings. Idempotent — re-running overwrites
 * to the latest copy here. Run after `bun run typegen` if schemas changed.
 *
 * Usage:
 *   NEXT_PUBLIC_SANITY_DATASET=production bun run --bun sanity/seed/seed-seo.ts
 *
 * Requires SANITY_API_WRITE_TOKEN with Editor or higher.
 */

import { createClient, type SanityClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2025-01-01';
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();

const MAX_META_TITLE_LENGTH = 65;
const MAX_META_DESCRIPTION_LENGTH = 160;

type SeoPatch = {
  docId: string;
  label: string;
  title: string;
  description: string;
};

const PAGE_SEO: SeoPatch[] = [
  {
    docId: 'homePage',
    label: 'Home',
    title: "Bruin Alpha Investment — UCLA's Multi-Committee Finance Club",
    description:
      "Bruin Alpha Investment is UCLA's student-led finance club for investment banking, trading, wealth management, and consulting training through real projects.",
  },
  {
    docId: 'aboutPage',
    label: 'About',
    title: 'About BAI — Our Mission & Story | UCLA Finance Club',
    description:
      'Learn how Bruin Alpha Investment at UCLA prepares students for finance careers through committee rotations, hands-on projects, and an accessible training model.',
  },
  {
    docId: 'committeesIndexPage',
    label: 'Committees',
    title: 'Committees — Investment Banking, Trading, Wealth, Consulting',
    description:
      "Explore BAI's UCLA committees in investment banking, trading, wealth management, and consulting, each with curriculum and signature projects.",
  },
  {
    docId: 'trainingPage',
    label: 'Training',
    title: 'Rotational Training Program — Analyst to Director Track',
    description:
      "BAI's UCLA rotational finance training covers committee curriculum, prep work, and interview readiness across investment banking, trading, and advisory.",
  },
  {
    docId: 'eventsPage',
    label: 'Events',
    title: 'Events & Competitions — Stock Pitches, Trading Challenges',
    description:
      'Find BAI at UCLA competitions, trading challenges, campus fairs, speaker sessions, and stock pitch events. See upcoming ways to meet the club.',
  },
  {
    docId: 'projectsPage',
    label: 'Projects',
    title: 'Projects & Research — Real Finance Work at UCLA',
    description:
      'Explore BAI projects across event-contract modeling, wealth advisory work, trading competitions, consulting case work, and stock pitch research.',
  },
  {
    docId: 'teamPage',
    label: 'Members',
    title: 'Members — BAI Founding Class & Committee Leadership',
    description:
      "Meet Bruin Alpha Investment's UCLA founders, directors, and members leading committees across banking, trading, wealth management, and consulting.",
  },
  {
    docId: 'joinPage',
    label: 'Join',
    title: 'Join Bruin Alpha Investment — Apply to BAI at UCLA',
    description:
      'Apply to Bruin Alpha Investment at UCLA. Review recruitment steps, coffee chats, interviews, decisions, and why no finance experience is required.',
  },
];

const COMMITTEE_SEO: SeoPatch[] = [
  {
    docId: 'committee-investment-banking',
    label: 'Investment Banking committee',
    title: 'Investment Banking Committee — M&A, DCF & LBO Modeling',
    description:
      "Explore BAI's Investment Banking committee at UCLA: 3-statement modeling, M&A, LBO basics, networking strategy, and technical interview prep.",
  },
  {
    docId: 'committee-trading',
    label: 'Trading committee',
    title: 'Trading Committee — Markets, Quant & Hedge Fund Prep',
    description:
      "Explore BAI's Trading committee at UCLA: price action, volatility, systematic strategies, market structure, and trading competition prep.",
  },
  {
    docId: 'committee-wealth-management',
    label: 'Wealth Management committee',
    title: 'Wealth Management Committee — Sales & Advisory Skills',
    description:
      "Explore BAI's Wealth Management committee at UCLA: advisory sales, client relationships, SIE and Series awareness, and book-building discipline.",
  },
  {
    docId: 'committee-accounting-consulting',
    label: 'Consulting committee',
    title: 'Consulting Committee — Models & Case Strategy',
    description:
      "Explore BAI's Consulting committee at UCLA: financial analysis, market sizing, case frameworks, and advisory strategy.",
  },
];

const SITE_SETTINGS_PATCH = {
  defaultMetaDescription:
    "UCLA's multi-committee finance club for investment banking, trading, wealth management, and consulting training through real projects.",
  organizationDescription:
    "Bruin Alpha Investment is UCLA's student-led finance club for investment banking, trading, wealth management, and consulting. Members rotate through committees, complete technical training, and contribute to real-world projects.",
};

const COMMITTEE_ROUTE_PATCHES = [
  {
    docId: 'committee-accounting-consulting',
    label: 'Consulting legacy route',
    slug: 'consulting',
    redirectsFrom: ['accounting-consulting'],
  },
] as const;

function assertSeoCopyWithinLimits(): void {
  const violations: string[] = [];
  for (const { label, title, description } of [...PAGE_SEO, ...COMMITTEE_SEO]) {
    if (title.length > MAX_META_TITLE_LENGTH) {
      violations.push(
        `${label} title is ${title.length}/${MAX_META_TITLE_LENGTH} chars`,
      );
    }
    if (description.length > MAX_META_DESCRIPTION_LENGTH) {
      violations.push(
        `${label} description is ${description.length}/${MAX_META_DESCRIPTION_LENGTH} chars`,
      );
    }
  }

  const defaultDescription = SITE_SETTINGS_PATCH.defaultMetaDescription;
  if (defaultDescription.length > MAX_META_DESCRIPTION_LENGTH) {
    violations.push(
      `Site Settings defaultMetaDescription is ${defaultDescription.length}/${MAX_META_DESCRIPTION_LENGTH} chars`,
    );
  }

  if (violations.length > 0) {
    console.error('❌ SEO copy exceeds Sanity validation limits:');
    for (const violation of violations) console.error(`  - ${violation}`);
    process.exit(1);
  }
}

function getConfiguredClient(): SanityClient {
  if (!projectId) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
    process.exit(1);
  }
  if (!writeToken) {
    console.error('❌ Missing SANITY_API_WRITE_TOKEN (Editor+ scope)');
    process.exit(1);
  }

  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: writeToken,
    useCdn: false,
  });
}

async function patchSeoBatch(
  client: SanityClient,
  patches: SeoPatch[],
): Promise<number> {
  let failures = 0;
  for (const { docId, label, title, description } of patches) {
    try {
      await client
        .patch(docId)
        .setIfMissing({ seo: { _type: 'seo' } })
        .set({
          'seo.title': title,
          'seo.description': description,
        })
        .commit({ autoGenerateArrayKeys: true });
      console.log(`  ✓ ${label.padEnd(36)} → ${title}`);
    } catch (err) {
      console.error(
        `  ✗ ${label} (${docId}) failed:`,
        err instanceof Error ? err.message : err,
      );
      failures += 1;
    }
  }
  return failures;
}

async function patchSiteSettings(client: SanityClient): Promise<number> {
  try {
    await client
      .patch('siteSettings')
      .set(SITE_SETTINGS_PATCH)
      .commit({ autoGenerateArrayKeys: true });
    console.log(
      '  ✓ siteSettings: defaultMetaDescription + organizationDescription refreshed',
    );
  } catch (err) {
    console.error(
      '  ✗ siteSettings patch failed:',
      err instanceof Error ? err.message : err,
    );
    return 1;
  }
  return 0;
}

async function patchCommitteeRoutes(client: SanityClient): Promise<number> {
  let failures = 0;
  for (const { docId, label, slug, redirectsFrom } of COMMITTEE_ROUTE_PATCHES) {
    try {
      const current = await client.fetch<{ redirectsFrom?: unknown } | null>(
        '*[_id == $docId][0]{redirectsFrom}',
        { docId },
      );
      const existingRedirects = Array.isArray(current?.redirectsFrom)
        ? current.redirectsFrom.filter(
            (redirect): redirect is string => typeof redirect === 'string',
          )
        : [];
      const mergedRedirects = [
        ...new Set([...existingRedirects, ...redirectsFrom]),
      ];

      await client
        .patch(docId)
        .set({
          slug: { _type: 'slug', current: slug },
          redirectsFrom: mergedRedirects,
        })
        .commit({ autoGenerateArrayKeys: true });
      console.log(`  ✓ ${label.padEnd(36)} → /committees/${slug}`);
    } catch (err) {
      console.error(
        `  ✗ ${label} (${docId}) failed:`,
        err instanceof Error ? err.message : err,
      );
      failures += 1;
    }
  }
  return failures;
}

async function main(): Promise<void> {
  assertSeoCopyWithinLimits();
  const client = getConfiguredClient();

  console.log(
    `\n▶ Seeding SEO content to dataset "${dataset}" (project ${projectId})\n`,
  );

  console.log('▸ Page singletons');
  let failures = await patchSeoBatch(client, PAGE_SEO);

  console.log('\n▸ Committee documents');
  failures += await patchSeoBatch(client, COMMITTEE_SEO);

  console.log('\n▸ Site settings');
  failures += await patchSiteSettings(client);

  console.log('\n▸ Committee routes');
  failures += await patchCommitteeRoutes(client);

  if (failures > 0) {
    console.error(
      `\n❌ SEO seed failed: ${failures} patch(es) did not apply.\n`,
    );
    process.exit(1);
  }

  console.log('\n✅ SEO seed complete.\n');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
