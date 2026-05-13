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
 *   - 5 FoundingMember docs — Mack, Max, Sam, Kai, Helmer.
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

const IDS = {
  siteSettings: 'siteSettings',
  homePage: 'homePage',
  members: {
    mack: 'foundingMember.mack-haymond',
    max: 'foundingMember.max',
    sam: 'foundingMember.sam',
    kai: 'foundingMember.kai',
    helmer: 'foundingMember.helmer',
  },
  committees: {
    wealth: 'committee.wealth-management',
    trading: 'committee.trading',
    accounting: 'committee.accounting-consulting',
    ib: 'committee.investment-banking',
  },
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

const foundingMembers = [
  {
    _id: IDS.members.mack,
    _type: 'foundingMember',
    firstName: 'Mack',
    lastName: 'Haymond',
    role: 'President',
    committee: 'president',
    gradYear: 2028,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.max,
    _type: 'foundingMember',
    firstName: 'Max',
    lastName: '',
    role: 'Trading Director',
    committee: 'trading',
    gradYear: 2028,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.sam,
    _type: 'foundingMember',
    firstName: 'Sam',
    lastName: '',
    role: 'Operations',
    committee: 'operations',
    gradYear: 2028,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.kai,
    _type: 'foundingMember',
    firstName: 'Kai',
    lastName: '',
    role: 'Trading Co-Director',
    committee: 'trading',
    gradYear: 2028,
    bio: '',
    photoReleaseObtained: false,
  },
  {
    _id: IDS.members.helmer,
    _type: 'foundingMember',
    firstName: 'Helmer',
    lastName: '',
    role: 'Accounting & Consulting Director',
    committee: 'accounting-consulting',
    gradYear: 2028,
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
    director: { _type: 'reference', _ref: IDS.members.mack },
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
    director: { _type: 'reference', _ref: IDS.members.max },
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
    director: { _type: 'reference', _ref: IDS.members.helmer },
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
    // director: TBD — left unset; Studio editor adds once recruited.
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

async function main() {
   
  console.log(
    `\n  🌱  Seeding Sanity project=${projectId} dataset=${dataset}\n`,
  );

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
