/**
 * Sanity content seeder.
 *
 * Idempotent — uses deterministic IDs + `createIfNotExists`. Safe to run
 * multiple times. Run AFTER `docs/SETUP-CHECKLIST.md` Section D
 * (Mack creates real Sanity project + populates `.env.local` with real
 * Project ID + `SANITY_API_WRITE_TOKEN`).
 *
 * Usage:
 *   bun run seed
 *
 * Required env (read from `.env.local` via Next.js convention OR
 * exported in shell):
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET (defaults to "production")
 *   - SANITY_API_WRITE_TOKEN (Editor or higher; created in Sanity manage UI)
 *
 * What it creates:
 *   - SiteSettings singleton (id: "siteSettings")  — locked Metis-mandated
 *     defaults for slogan, disclaimer, mission, naming compliance, club email.
 *   - HomePage singleton (id: "homePage") — empty sections array; UI renders
 *     hardcoded fallbacks until Mack composes sections via Studio.
 *   - 8 FoundingMember docs — Matt Walker (President), Ben Robinson +
 *     Michael Prosser (Consulting), Mack Haymond + Kai Hata + Samuel Jiang
 *     (Trading), Max Helmer + Rhett Adkins (IB). Roster confirmed by Mack
 *     from the club Slack on 2026-05-14.
 *   - 4 Committee docs — Wealth Management, Trading,
 *     Accounting & Consulting, Investment Banking.
 *
 * What it does NOT do:
 *   - Will not overwrite existing docs (idempotent).
 *   - Will not seed headshots — `photoReleaseObtained: false` until Mack
 *     collects releases and uploads via Studio.
 */

import { createClient, type SanityClient } from 'next-sanity';

// `bun run` auto-loads `.env.local` from project root — no dotenv needed.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2025-01-01';
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();

const PLACEHOLDER_PROJECT_ID = 'pPLACEHOLDR';

function exitWithError(message: string): never {
   
  console.error(`\n  ❌  ${message}\n`);
  process.exit(1);
}

if (!projectId || projectId === PLACEHOLDER_PROJECT_ID) {
  exitWithError(
    'Missing real NEXT_PUBLIC_SANITY_PROJECT_ID.\n' +
      '     Complete docs/SETUP-CHECKLIST.md Section D first:\n' +
      '       1) Create Sanity org + project (sanity.io/manage)\n' +
      '       2) Copy the Project ID into .env.local\n' +
      '       3) Re-run `bun run seed`',
  );
}

if (!writeToken) {
  exitWithError(
    'Missing SANITY_API_WRITE_TOKEN.\n' +
      '     1) In sanity.io/manage → your project → API → Tokens\n' +
      '     2) Create a token with Editor permissions\n' +
      '     3) Add SANITY_API_WRITE_TOKEN=... to .env.local (server-only,\n' +
      '        NEVER prefix with NEXT_PUBLIC_)\n' +
      '     4) Re-run `bun run seed`',
  );
}

const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
  perspective: 'published',
});

// Document IDs are intentionally dot-free. Sanity treats public datasets as
// readable to anonymous queries ONLY for IDs without a `.` separator — IDs
// like `foundingMember.kai` get a `permission` omit on anonymous reads even
// when aclMode=public. Singletons (`siteSettings`, `homePage`) and dash-only
// IDs (`member-kai-hata`) are anonymously readable. Verified empirically
// against project u1y6t81y on 2026-05-14.
const IDS = {
  siteSettings: 'siteSettings',
  homePage: 'homePage',
  members: {
    matt: 'member-matt-walker',
    ben: 'member-ben-robinson',
    michael: 'member-michael-prosser',
    kai: 'member-kai-hata',
    mack: 'member-mack-haymond',
    sam: 'member-samuel-jiang',
    maxHelmer: 'member-max-helmer',
    rhett: 'member-rhett-adkins',
  },
  committees: {
    wealth: 'committee-wealth-management',
    trading: 'committee-trading',
    accounting: 'committee-accounting-consulting',
    ib: 'committee-investment-banking',
  },
  // Stale IDs from the pre-roster-finalisation seed run. We delete these
  // before re-seeding so the dataset doesn't carry both old + new docs.
  // Order matters: committees must be deleted BEFORE members because the
  // `committee.director` reference creates a foreign-key-style constraint
  // in Sanity. Safe to remove this entire block once Mack confirms the
  // dataset is clean.
  stale: [
    'committee.wealth-management',
    'committee.trading',
    'committee.accounting-consulting',
    'committee.investment-banking',
    'foundingMember.mack-haymond',
    'foundingMember.max',
    'foundingMember.sam',
    'foundingMember.kai',
    'foundingMember.helmer',
  ],
} as const;

const LOCKED_DISCLAIMER =
  'Bruin Alpha Investment is a registered student organization at UCLA. Content on this site is educational only and does not constitute investment advice. BAI is not a registered investment adviser, broker-dealer, or financial advisor. This organization acts independently of UCLA and does not represent the University.';

const LOCKED_MISSION =
  'Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application. The club brings together students interested in asset and wealth management, financial analysis, sales & trading, prediction markets, and those engaged in active investing across equities, options, futures, and cryptocurrency markets. Beyond discussion, members actively participate in real trading environments, applying arbitrage strategies and other advanced techniques to live markets. The organization emphasizes practical execution, disciplined risk management, and a deep understanding of market structure. Through a collaborative and performance-driven community, Bruin Alpha Investment equips members with the technical skills, strategic thinking, and real experience needed to succeed in competitive finance careers.';

const LOCKED_SLOGAN = 'Have Passion, Believe in Legacy, Believe in BAI';
const LOCKED_NAME = 'Bruin Alpha Investment at UCLA';
const CLUB_EMAIL = 'bruinalphainvestment26@gmail.com';
const COMMITTEE_PLACEHOLDER_DESCRIPTION =
  'Curriculum in development — check back fall 2026.';

function portableText(text: string, keyPrefix: string) {
  return [
    {
      _type: 'block',
      _key: `${keyPrefix}-blk`,
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: `${keyPrefix}-spn`,
          text,
          marks: [],
        },
      ],
    },
  ];
}

const siteSettingsDoc = {
  _id: IDS.siteSettings,
  _type: 'siteSettings',
  ucla_compliant_name: LOCKED_NAME,
  slogan: LOCKED_SLOGAN,
  mission_statement: portableText(LOCKED_MISSION, 'mission'),
  disclaimer_text: LOCKED_DISCLAIMER,
  applyUrl: 'https://tally.so/r/placeholder',
  clubEmail: CLUB_EMAIL,
  // instagramUrl + linkedinUrl + slackInviteUrl + domain_renewal_date left
  // intentionally unset — editors fill via Studio once real URLs exist.
};

const homePageDoc = {
  _id: IDS.homePage,
  _type: 'homePage',
  title: 'Home Page',
  sections: [] as unknown[],
};

// Founding roster as confirmed by Mack on 2026-05-14 from the club Slack
// member list. Schema requires non-empty first+last name, role, committee
// (must match COMMITTEE_OPTIONS), and 2024<=gradYear<=2035. All 8 founders
// are the class of 2029 (confirmed by Mack 2026-05-14).
const foundingMembers = [
  {
    _id: IDS.members.matt,
    _type: 'foundingMember',
    firstName: 'Matt',
    lastName: 'Walker',
    role: 'President & Wealth Management Director',
    committee: 'wealth-management',
    gradYear: 2029,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.ben,
    _type: 'foundingMember',
    firstName: 'Ben',
    lastName: 'Robinson',
    role: 'Accounting & Consulting Co-Director',
    committee: 'accounting-consulting',
    gradYear: 2029,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.michael,
    _type: 'foundingMember',
    firstName: 'Michael',
    lastName: 'Prosser',
    role: 'Accounting & Consulting Co-Director',
    committee: 'accounting-consulting',
    gradYear: 2029,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.mack,
    _type: 'foundingMember',
    firstName: 'Mack',
    lastName: 'Haymond',
    role: 'Founder & Trading Co-Director',
    committee: 'trading',
    gradYear: 2029,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.kai,
    _type: 'foundingMember',
    firstName: 'Kai',
    lastName: 'Hata',
    role: 'Trading Co-Director',
    committee: 'trading',
    gradYear: 2029,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.sam,
    _type: 'foundingMember',
    firstName: 'Samuel',
    lastName: 'Jiang',
    role: 'Trading Co-Director',
    committee: 'trading',
    gradYear: 2029,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.maxHelmer,
    _type: 'foundingMember',
    firstName: 'Max',
    lastName: 'Helmer',
    role: 'Investment Banking Co-Director',
    committee: 'investment-banking',
    gradYear: 2029,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.rhett,
    _type: 'foundingMember',
    firstName: 'Rhett',
    lastName: 'Adkins',
    // Mack to confirm Rhett's committee — IB is a placeholder.
    role: 'Investment Banking Co-Director',
    committee: 'investment-banking',
    gradYear: 2029,
    bio: '',
    photoReleaseObtained: false,
  },
] as const;

const committees = [
  {
    _id: IDS.committees.wealth,
    _type: 'committee',
    name: 'Wealth Management',
    slug: { _type: 'slug', current: 'wealth-management' },
    director: { _type: 'reference', _ref: IDS.members.matt },
    tagline: 'Relationships, soft skills, exam preparation.',
    description: portableText(
      COMMITTEE_PLACEHOLDER_DESCRIPTION,
      'desc-wealth',
    ),
    order: 1,
    accentColor: 'gold',
  },
  {
    _id: IDS.committees.trading,
    _type: 'committee',
    name: 'Trading',
    slug: { _type: 'slug', current: 'trading' },
    // Trading is co-led by Mack, Kai, and Samuel. Sanity's committee schema
    // only supports a single director reference, so Mack (founder) is the
    // canonical Studio pick. Use the `role` field on each member doc to
    // surface all three as Co-Directors on the public page.
    director: { _type: 'reference', _ref: IDS.members.mack },
    tagline: 'Charts, volatility, systematic strategies.',
    description: portableText(
      COMMITTEE_PLACEHOLDER_DESCRIPTION,
      'desc-trading',
    ),
    order: 2,
    accentColor: 'navy',
  },
  {
    _id: IDS.committees.accounting,
    _type: 'committee',
    name: 'Accounting & Consulting',
    slug: { _type: 'slug', current: 'accounting-consulting' },
    // Co-led by Ben + Michael. Ben listed first per Mack's roster note.
    director: { _type: 'reference', _ref: IDS.members.ben },
    tagline: '3-statement modeling, DCF, audit fundamentals.',
    description: portableText(
      COMMITTEE_PLACEHOLDER_DESCRIPTION,
      'desc-accounting',
    ),
    order: 3,
    accentColor: 'gold',
  },
  {
    _id: IDS.committees.ib,
    _type: 'committee',
    name: 'Investment Banking',
    slug: { _type: 'slug', current: 'investment-banking' },
    director: { _type: 'reference', _ref: IDS.members.maxHelmer },
    tagline: 'Modeling, networking, technical interview prep.',
    description: portableText(COMMITTEE_PLACEHOLDER_DESCRIPTION, 'desc-ib'),
    order: 4,
    accentColor: 'navy',
  },
] as const;

async function createIfNotExists(
  doc: Record<string, unknown> & { _id: string; _type: string },
): Promise<{ id: string; status: 'created' | 'exists' }> {
  const existing = await client.getDocument(doc._id);
  if (existing) {
    return { id: doc._id, status: 'exists' };
  }
  await client.createIfNotExists(
    doc as Parameters<typeof client.createIfNotExists>[0],
  );
  return { id: doc._id, status: 'created' };
}

async function deleteStaleDocs(staleIds: readonly string[]): Promise<number> {
  let deleted = 0;
  for (const id of staleIds) {
    const existing = await client.getDocument(id);
    if (!existing) continue;
    await client.delete(id);
    deleted += 1;
  }
  return deleted;
}

async function main() {
   
  console.log(
    `\n  🌱  Seeding Sanity project=${projectId} dataset=${dataset}\n`,
  );

  const removed = await deleteStaleDocs(IDS.stale);
  if (removed > 0) {
     
    console.log(`  🧹  Removed ${removed} stale doc(s) from prior schema.\n`);
  }

  const results: Array<{ id: string; status: 'created' | 'exists' }> = [];

  // Order matters: members must exist before committees (committee.director refs them).
  for (const member of foundingMembers) {
     
    results.push(await createIfNotExists(member));
  }

  for (const cmt of committees) {
     
    results.push(await createIfNotExists(cmt));
  }

  results.push(await createIfNotExists(siteSettingsDoc));
  results.push(await createIfNotExists(homePageDoc));

   
  console.log('  Results:');
  for (const r of results) {
    const icon = r.status === 'created' ? '✨' : '✓ ';
     
    console.log(`    ${icon} ${r.id} (${r.status})`);
  }

  const createdCount = results.filter((r) => r.status === 'created').length;
  const existsCount = results.filter((r) => r.status === 'exists').length;
   
  console.log(
    `\n  ✅  Done. ${createdCount} created, ${existsCount} already existed.\n`,
  );
   
  console.log(
    `  Next: open https://www.sanity.io/manage → your project, or run \`bun run dev\`\n  and visit http://localhost:3000/studio to verify and continue editing.\n`,
  );
}

main().catch((err: unknown) => {
   
  console.error('\n  ❌  Seed failed:\n', err);
  process.exit(1);
});
