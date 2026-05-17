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

if (!projectId) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
  process.exit(1);
}
if (!writeToken) {
  console.error('❌ Missing SANITY_API_WRITE_TOKEN (Editor+ scope)');
  process.exit(1);
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
});

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
      "Bruin Alpha Investment is UCLA's student-led finance club bridging investment banking, trading, wealth management, and accounting through committee-based training and real projects.",
  },
  {
    docId: 'aboutPage',
    label: 'About',
    title: 'About BAI — Our Mission & Story | UCLA Finance Club',
    description:
      "Founded Spring 2026, Bruin Alpha Investment unites UCLA students across investment banking, trading, wealth management, and accounting & consulting through a rotational program and hands-on projects.",
  },
  {
    docId: 'committeesIndexPage',
    label: 'Committees',
    title: 'Committees — Investment Banking, Trading, Wealth, Consulting',
    description:
      "Explore BAI's four specialized committees at UCLA: Investment Banking, Trading, Wealth Management, and Accounting & Consulting. Each delivers committee curriculum and signature projects.",
  },
  {
    docId: 'trainingPage',
    label: 'Training',
    title: 'Rotational Training Program — Analyst to Director Track',
    description:
      "BAI's rotational finance training at UCLA: weekly committee curriculum, asynchronous prep, and a 30-page interview study guide for top finance recruiting across IB, trading, and advisory.",
  },
  {
    docId: 'eventsPage',
    label: 'Events',
    title: 'Events & Competitions — Stock Pitches, Trading Challenges',
    description:
      'Find BAI at UCLA case competitions, the CME Trading Challenge, IMC Prosperity, the Enormous Activities Fair, and our Spring Stock Pitch. See upcoming events and where to meet us.',
  },
  {
    docId: 'projectsPage',
    label: 'Projects',
    title: 'Projects & Research — Real Finance Work at UCLA',
    description:
      'Hands-on BAI projects: event-contract modeling, UCLA club audits, wealth advisory mock engagements, internal trading competitions, and the all-club Spring Stock Pitch capstone.',
  },
  {
    docId: 'teamPage',
    label: 'Members',
    title: 'Members — BAI Founding Class & Committee Leadership',
    description:
      'Meet the founders, directors, and members of Bruin Alpha Investment at UCLA — students leading committees across investment banking, trading, wealth management, and consulting.',
  },
  {
    docId: 'joinPage',
    label: 'Join',
    title: 'Join Bruin Alpha Investment — Apply to BAI at UCLA',
    description:
      'Apply to join Bruin Alpha Investment at UCLA. Four-step recruitment: apply, coffee chat, interview, decision. Open to all majors — no prior finance experience required.',
  },
];

const COMMITTEE_SEO: SeoPatch[] = [
  {
    docId: 'committee-investment-banking',
    label: 'Investment Banking committee',
    title: 'Investment Banking Committee — M&A, DCF & LBO Modeling',
    description:
      "BAI's Investment Banking committee at UCLA: advanced 3-statement modeling, M&A and LBO mechanics, networking strategy, and technical interview prep for top-tier banking groups.",
  },
  {
    docId: 'committee-trading',
    label: 'Trading committee',
    title: 'Trading Committee — Markets, Quant & Hedge Fund Prep',
    description:
      "BAI's Trading committee at UCLA: price action, volatility analysis, systematic strategies, hedge fund coffee chats, plus CME Trading Challenge and IMC Prosperity preparation.",
  },
  {
    docId: 'committee-wealth-management',
    label: 'Wealth Management committee',
    title: 'Wealth Management Committee — Sales & Advisory Skills',
    description:
      "BAI's Wealth Management committee at UCLA: rejection-resistance, relationship building, SIE/Series exam prep, and the long-game discipline of building a book of business.",
  },
  {
    docId: 'committee-accounting-consulting',
    label: 'Accounting & Consulting committee',
    title: 'Accounting & Consulting — Models, Audit & Case Strategy',
    description:
      "BAI's Accounting & Consulting committee at UCLA: 3-statement modeling, DCF and LBO basics, audit fundamentals, and structured case frameworks for advisory thinking.",
  },
];

const SITE_SETTINGS_PATCH = {
  defaultMetaDescription:
    "UCLA's multi-committee finance club bridging investment banking, trading, wealth management, and accounting & consulting through hands-on training and real-world projects.",
  organizationDescription:
    "Bruin Alpha Investment is UCLA's student-led, multi-committee finance club covering investment banking, trading, wealth management, and accounting & consulting. Members rotate through committees during a structured training program and contribute to real-world projects across the financial industry.",
};

async function patchSeoBatch(patches: SeoPatch[]): Promise<void> {
  for (const { docId, label, title, description } of patches) {
    try {
      await client
        .patch(docId)
        .set({
          seo: { _type: 'seo', title, description },
        })
        .commit({ autoGenerateArrayKeys: true });
      console.log(`  ✓ ${label.padEnd(36)} → ${title}`);
    } catch (err) {
      console.error(`  ✗ ${label} (${docId}) failed:`, err instanceof Error ? err.message : err);
    }
  }
}

async function patchSiteSettings(): Promise<void> {
  try {
    await client
      .patch('siteSettings')
      .set(SITE_SETTINGS_PATCH)
      .commit({ autoGenerateArrayKeys: true });
    console.log('  ✓ siteSettings: defaultMetaDescription + organizationDescription refreshed');
  } catch (err) {
    console.error('  ✗ siteSettings patch failed:', err instanceof Error ? err.message : err);
  }
}

async function main(): Promise<void> {
  console.log(`\n▶ Seeding SEO content to dataset "${dataset}" (project ${projectId})\n`);

  console.log('▸ Page singletons');
  await patchSeoBatch(PAGE_SEO);

  console.log('\n▸ Committee documents');
  await patchSeoBatch(COMMITTEE_SEO);

  console.log('\n▸ Site settings');
  await patchSiteSettings();

  console.log('\n✅ SEO seed complete.\n');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
