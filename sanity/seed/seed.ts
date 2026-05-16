/**
 * Sanity content seeder — Phase 0 T0.11 rewrite.
 *
 * SEED_MODE env flag controls write semantics (Metis §2.13):
 *   - SEED_MODE=preserve (DEFAULT): only create when missing. Post-cutover
 *     this prevents editor edits from being clobbered by re-running the seed.
 *   - SEED_MODE=replace: createOrReplace every doc. Use during migration
 *     iteration to re-seed fresh content.
 *
 * Usage:
 *   SEED_MODE=replace NEXT_PUBLIC_SANITY_DATASET=migration bun run seed
 *   bun run seed                                    # preserve mode, current dataset
 *
 * Required env (read from `.env.local` or shell):
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET (defaults to "production")
 *   - SANITY_API_WRITE_TOKEN (Editor or higher)
 *   - SEED_MODE (optional, defaults to "preserve")
 *
 * What it creates (~30 docs):
 *   - 1 siteSettings singleton — both legacy snake_case AND new camelCase
 *     fields populated to the same canonical values (D10 deprecation pattern).
 *   - 1 homePage singleton — sections[] populated with 8 sections (hero,
 *     mission, stats, values, committees-teaser, founding-team, marquee, cta)
 *     mirroring the current hardcoded render order of `app/(site)/page.tsx`.
 *   - 7 new page singletons — aboutPage, trainingPage, joinPage, eventsPage,
 *     projectsPage, teamPage, committeesIndexPage. Content lifted verbatim
 *     from the current `app/(site)/<page>/page.tsx` source so the dataset
 *     mirrors the live site Day 1.
 *   - 8 foundingMember docs (real Spring 2026 roster, all class of 2029).
 *   - 4 committee docs with learn[], differentiator, directorPlaceholder.
 *   - 5 project docs from `app/(site)/projects/page.tsx`.
 *   - 6 event docs from `app/(site)/events/page.tsx`.
 *
 * What it does NOT do:
 *   - Will not seed headshots (`photoReleaseObtained: false`).
 *   - Will not touch the production dataset unless explicitly requested via
 *     NEXT_PUBLIC_SANITY_DATASET=production. Migration work uses `migration`.
 */

import { createClient, type SanityClient } from 'next-sanity';

// `bun run` auto-loads `.env.local` from project root — no dotenv needed.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2025-01-01';
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();

type SeedMode = 'replace' | 'preserve';
const rawSeedMode = (process.env.SEED_MODE ?? 'preserve').trim();

const PLACEHOLDER_PROJECT_ID = 'pPLACEHOLDR';

function exitWithError(message: string): never {
   
  console.error(`\n  ❌  ${message}\n`);
  process.exit(1);
}

if (rawSeedMode !== 'replace' && rawSeedMode !== 'preserve') {
  exitWithError(
    `SEED_MODE must be 'replace' or 'preserve' (got '${rawSeedMode}').`,
  );
}
const seedMode: SeedMode = rawSeedMode;

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
  // New page singletons (T0.7)
  aboutPage: 'aboutPage',
  trainingPage: 'trainingPage',
  joinPage: 'joinPage',
  eventsPage: 'eventsPage',
  projectsPage: 'projectsPage',
  teamPage: 'teamPage',
  committeesIndexPage: 'committeesIndexPage',
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
  // Project docs (5) — IDs are dash-only (Sanity anonymous-read quirk).
  projects: {
    eventContractModeling: 'project-event-contract-modeling',
    uclaClubAudit: 'project-ucla-club-audit',
    springStockPitch: 'project-spring-stock-pitch',
    wealthAdvisoryMock: 'project-wealth-advisory-mock',
    uclaTradingComp: 'project-ucla-trading-competition',
  },
  // Event docs (6) — dash-only IDs.
  events: {
    eaf: 'event-enormous-activities-fair-2026',
    speakers: 'event-speakers-workshops',
    cme: 'event-cme-trading-challenge',
    imc: 'event-imc-prosperity',
    caseComps: 'event-case-competitions',
    springPitchEvent: 'event-spring-stock-pitch-2027',
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

// ---------------------------------------------------------------------------
// Canonical / locked constants — used in BOTH legacy snake_case AND new
// camelCase fields so both representations point at the same source of truth.
// ---------------------------------------------------------------------------

const LOCKED_DISCLAIMER =
  'Bruin Alpha Investment is a registered student organization at UCLA. Content on this site is educational only and does not constitute investment advice. BAI is not a registered investment adviser, broker-dealer, or financial advisor. This organization acts independently of UCLA and does not represent the University.';

const LOCKED_MISSION_TEXT =
  'Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application. The club brings together students interested in asset and wealth management, financial analysis, sales & trading, prediction markets, and those engaged in active investing across equities, options, futures, and cryptocurrency markets. Beyond discussion, members actively participate in real trading environments, applying arbitrage strategies and other advanced techniques to live markets. The organization emphasizes practical execution, disciplined risk management, and a deep understanding of market structure. Through a collaborative and performance-driven community, Bruin Alpha Investment equips members with the technical skills, strategic thinking, and real experience needed to succeed in competitive finance careers.';

const LOCKED_SLOGAN = 'Have Passion, Believe in Legacy, Believe in BAI';
const LOCKED_NAME = 'Bruin Alpha Investment at UCLA';
const BRAND_NAME = 'Bruin Alpha Investment';
const CLUB_EMAIL = 'bruinalphainvestment26@gmail.com';
const TITLE_SUFFIX = ' — Bruin Alpha Investment at UCLA';
const DEFAULT_META_DESCRIPTION =
  'Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application.';
const COMMITTEE_PLACEHOLDER_DESCRIPTION =
  'Curriculum in development — check back fall 2026.';
// Per docs/CUSTOM-DOMAIN.md — bruinalphainvestment.com expires 2027-05-14.
const DOMAIN_RENEWAL_DATE = '2027-05-14';
const APPLY_URL = 'https://tally.so/r/placeholder';

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

// ---------------------------------------------------------------------------
// siteSettings singleton — D10 deprecation pattern: legacy snake_case fields
// AND new camelCase fields both populated to identical canonical values so
// querysites can read either while we migrate the rendering layer.
// ---------------------------------------------------------------------------

const siteSettingsDoc = {
  _id: IDS.siteSettings,
  _type: 'siteSettings',
  // --- Legacy snake_case (Deprecated; readOnly in schema; do NOT remove yet) ---
  ucla_compliant_name: LOCKED_NAME,
  slogan: LOCKED_SLOGAN,
  mission_statement: portableText(LOCKED_MISSION_TEXT, 'mission-legacy'),
  disclaimer_text: LOCKED_DISCLAIMER,
  domain_renewal_date: DOMAIN_RENEWAL_DATE,
  // --- Existing fields kept as-is ---
  applyUrl: APPLY_URL,
  clubEmail: CLUB_EMAIL,
  // instagramUrl + linkedinUrl + slackInviteUrl left unset — editors fill once
  // real URLs exist.
  // --- New camelCase fields populated explicitly so editor sees real data on
  // Day 1 (schema defaults are not applied to existing docs during migration). ---
  brandName: BRAND_NAME,
  titleSuffix: TITLE_SUFFIX,
  defaultMetaDescription: DEFAULT_META_DESCRIPTION,
  foundedYear: 2026,
  foundedTerm: 'Spring 2026',
  navLinks: [
    { _key: 'nav-home', label: 'Home', href: '/' },
    { _key: 'nav-committees', label: 'Committees', href: '/committees' },
    { _key: 'nav-training', label: 'Training', href: '/training' },
    { _key: 'nav-team', label: 'Team', href: '/team' },
    { _key: 'nav-join', label: 'Join', href: '/join' },
  ],
  organizationDescription: DEFAULT_META_DESCRIPTION,
  sameAs: [] as string[],
  errorCopy: {
    notFoundHeading: 'Page not found',
    notFoundBody: "The page you're looking for doesn't exist.",
    errorHeading: 'Something went wrong',
    errorBody: 'Refresh the page or contact us if the problem persists.',
    loadingLabel: 'Loading…',
  },
  disclaimerText: LOCKED_DISCLAIMER,
  uclaCompliantName: LOCKED_NAME,
  missionStatement: portableText(LOCKED_MISSION_TEXT, 'mission'),
  domainRenewalDate: DOMAIN_RENEWAL_DATE,
} as const;

// ---------------------------------------------------------------------------
// homePage singleton — 8 sections in render order (hero → mission → stats →
// values → committees-teaser → founding-team → marquee → cta) matching the
// hardcoded layout in `app/(site)/page.tsx`. Source values lifted verbatim
// from the corresponding `app/_components/sections/*.tsx` components.
// ---------------------------------------------------------------------------

const homePageSections = [
  {
    _key: 'hero-0',
    _type: 'heroSection',
    headline: 'Bruin Alpha Investment',
    subheadline: LOCKED_SLOGAN,
    accentDark: true,
  },
  {
    _key: 'mission-1',
    _type: 'missionSection',
    heading: 'Our Mission',
    body: portableText(LOCKED_MISSION_TEXT, 'home-mission'),
  },
  {
    _key: 'stats-2',
    _type: 'statsSection',
    stats: [
      { _key: 'stat-est', value: '2026', label: 'Est.' },
      { _key: 'stat-members', value: '8', label: 'Founding Members' },
      { _key: 'stat-committees', value: '4', label: 'Committees' },
      { _key: 'stat-recruit', value: 'Fall 2026', label: 'Recruitment' },
    ],
  },
  {
    _key: 'values-3',
    _type: 'valuesSection',
    values: [
      {
        _key: 'val-01',
        title: 'Active Community',
        description: 'Project-driven cohort, not just a newsletter.',
      },
      {
        _key: 'val-02',
        title: 'Strong Dedicated Leadership',
        description: 'Accountability rituals from day one.',
      },
      {
        _key: 'val-03',
        title: 'Passion for Legacy and Mission',
        description: 'Built to outlive the founders.',
      },
      {
        _key: 'val-04',
        title: 'Real Engagements, Real Companies, Real Alumni',
        description: 'Hands-on work that compounds.',
      },
      {
        _key: 'val-05',
        title: 'Real Impact Projects',
        description:
          'Outcomes you can put on a resume — and defend in interviews.',
      },
      {
        _key: 'val-06',
        title: 'Strong Recruitment',
        description:
          'A pipeline calibrated to the most competitive UCLA finance careers.',
      },
      {
        _key: 'val-07',
        title: 'Active Brand Presence',
        description:
          'Discoverable across the channels prospective members already live on.',
      },
    ],
  },
  {
    _key: 'committees-teaser-4',
    _type: 'committeesTeaserSection',
    heading: 'Committees',
    subheading:
      'Four core committees — one rotational program. Specialize after you survey the full landscape.',
  },
  {
    _key: 'founding-team-5',
    _type: 'foundingTeamSection',
    heading: 'The Founding Class — Built in Spring 2026',
  },
  {
    _key: 'marquee-6',
    _type: 'marqueeSection',
    items: [
      'BAI',
      'REAL IMPACT',
      'LEGACY',
      'BRUIN ALPHA',
      'FOUNDED 2026',
    ],
  },
  {
    _key: 'cta-7',
    _type: 'ctaSection',
    heading: 'Join the Founding Cohort',
    body: 'Priority application closes early Fall 2026. Applications open to all current and incoming UCLA students.',
    ctaLabel: 'Apply Now',
    secondaryCtaLabel: 'Email Us',
    secondaryCtaHref: `mailto:${CLUB_EMAIL}`,
  },
] as const;

const homePageDoc = {
  _id: IDS.homePage,
  _type: 'homePage',
  title: 'Home Page',
  sections: homePageSections,
};

// ---------------------------------------------------------------------------
// 7 new page singletons — content lifted from current hardcoded sources.
// ---------------------------------------------------------------------------

const aboutPageDoc = {
  _id: IDS.aboutPage,
  _type: 'aboutPage',
  title: 'About Page',
  seo: {
    title: 'About — Bruin Alpha Investment at UCLA',
    description:
      'Bruin Alpha Investment was founded in Spring 2026 to provide blanket coverage across finance disciplines through specialized committees and real project work.',
  },
  hero: {
    heading: 'Our Story',
    subheading:
      "Founded in Spring 2026, Bruin Alpha Investment was built to bridge the gap in UCLA's finance club landscape by combining broad accessibility with deep, specialized training.",
  },
  mission: {
    heading: 'Our Mission',
    body: LOCKED_MISSION_TEXT,
  },
  history: {
    heading: 'Our History',
    body:
      'The vision for Bruin Alpha Investment began in the Spring of 2026. Mack Haymond and four co-founders recognized a clear gap in the existing financial organization landscape at UCLA. While other organizations focused heavily on single disciplines or maintained extremely narrow funnels for entry, there was a profound need for a community that offered both an inclusive starting point and a pathway to highly specialized expertise.\n\n' +
      "We realized that true financial education doesn't happen in silos. It happens when students are exposed to the full spectrum of the industry — from investment banking and wealth management to trading and accounting — before they are forced to specialize.\n\n" +
      'By establishing our multi-committee structure, we ensure that every member receives blanket coverage of the financial world during their rotational period, followed by rigorous, hands-on development within their chosen focus area. Our goal is not just to teach finance, but to execute real, meaningful projects that deliver tangible value to our members and the broader community.',
  },
  // Per plan D7: signature trip teaser scaffold — visible=false until Mack
  // finalises the trip itinerary. Existing hardcoded /about renders an
  // "In Development" panel; that maps to status="In Development".
  signatureTrip: {
    headline: 'Signature Trip',
    status: 'In Development',
    body: '',
    visible: false,
  },
  // Per Metis §1.15: 7 core values. These are the same values rendered by
  // the home page (`values.tsx`) — duplicated here so /about can render an
  // independent values section if/when an editor wants.
  values: [
    {
      _key: 'about-val-01',
      _type: 'value',
      title: 'Active Community',
      body: 'Project-driven cohort, not just a newsletter.',
    },
    {
      _key: 'about-val-02',
      _type: 'value',
      title: 'Strong Dedicated Leadership',
      body: 'Accountability rituals from day one.',
    },
    {
      _key: 'about-val-03',
      _type: 'value',
      title: 'Passion for Legacy and Mission',
      body: 'Built to outlive the founders.',
    },
    {
      _key: 'about-val-04',
      _type: 'value',
      title: 'Real Engagements, Real Companies, Real Alumni',
      body: 'Hands-on work that compounds.',
    },
    {
      _key: 'about-val-05',
      _type: 'value',
      title: 'Real Impact Projects',
      body: 'Outcomes you can put on a resume — and defend in interviews.',
    },
    {
      _key: 'about-val-06',
      _type: 'value',
      title: 'Strong Recruitment',
      body: 'A pipeline calibrated to the most competitive UCLA finance careers.',
    },
    {
      _key: 'about-val-07',
      _type: 'value',
      title: 'Active Brand Presence',
      body: 'Discoverable across the channels prospective members already live on.',
    },
  ],
  // Generic sections — the current /about hardcodes a "What Sets Us Apart"
  // 3-up that we model as 3 generic sections (heading/body each) so editors
  // can re-order or add additional differentiators without a schema change.
  sections: [
    {
      _key: 'about-blanket-coverage',
      _type: 'section',
      heading: 'Blanket Coverage',
      body:
        "We don't limit our focus to just one area of finance. Our structure is designed to expose members to the entire landscape, ensuring a well-rounded understanding of the markets before deep specialization.",
    },
    {
      _key: 'about-real-projects',
      _type: 'section',
      heading: 'Real Projects',
      body:
        'Theory only goes so far. Our committees operate through hands-on, deliverable-driven initiatives rather than passive lectures, ensuring every member builds a tangible track record.',
    },
    {
      _key: 'about-rotational-program',
      _type: 'section',
      heading: 'Rotational Program',
      body:
        'Our unique onboarding pipeline allows new analysts to experience every committee over a 10-week period, guaranteeing that their final placement aligns perfectly with their skills and interests.',
    },
  ],
};

const trainingPageDoc = {
  _id: IDS.trainingPage,
  _type: 'trainingPage',
  title: 'Training Page',
  seo: {
    title: 'Training & Rotational Program — Bruin Alpha Investment at UCLA',
    description:
      'Our 10-week rotational program exposes analysts to Wealth Management, Trading, Accounting & Consulting, and Investment Banking before specialization.',
  },
  hero: {
    heading: 'The Rotational Program',
    subheading:
      'A rigorous 10-week pipeline designed to build comprehensive financial acumen. Analysts rotate through every discipline before committing to a specialized committee.',
  },
  intro:
    'How It Works — rotate through every discipline before committing to a specialized committee.',
  curriculum: [
    {
      _key: 'tr-wk-1-2',
      _type: 'curriculumEntry',
      week: 'Wk 1-2',
      topic: 'Wealth Management',
      body: 'Personal finance fundamentals, portfolio allocation strategies, and risk assessment.',
    },
    {
      _key: 'tr-wk-3-4',
      _type: 'curriculumEntry',
      week: 'Wk 3-4',
      topic: 'Trading',
      body: 'Market mechanics, quantitative analysis, and event-contract modeling.',
    },
    {
      _key: 'tr-wk-5-6',
      _type: 'curriculumEntry',
      week: 'Wk 5-6',
      topic: 'Accounting & Consulting',
      body: 'Financial statement analysis, corporate strategy, and operational auditing.',
    },
    {
      _key: 'tr-wk-7-8',
      _type: 'curriculumEntry',
      week: 'Wk 7-8',
      topic: 'Investment Banking',
      body: 'Valuation methodologies, financial modeling, and strategic advisory.',
    },
    {
      _key: 'tr-wk-9-10',
      _type: 'curriculumEntry',
      week: 'Wk 9-10',
      topic: 'Selection & Commit',
      body: 'Final placement matching based on analyst preference and demonstrated aptitude.',
    },
  ],
  programs: [
    {
      _key: 'tr-prog-quarterly',
      _type: 'program',
      name: 'Quarterly All-Club Project',
      description:
        'Beyond committee work, the entire organization unites once per quarter for a comprehensive, cross-disciplinary project. This ensures continued collaboration between groups and reinforces the interconnected nature of the financial ecosystem.',
      format: 'Cross-committee project',
      duration: 'Once per quarter',
    },
    {
      _key: 'tr-prog-weekly',
      _type: 'program',
      name: 'Sample Week',
      description:
        '1 hr committee meeting (synchronous instruction, project alignment, and progress reviews) plus 2 hrs asynchronous work (independent research, modeling, and deliverable preparation).',
      format: 'Hybrid (sync + async)',
      duration: '3 hours / week',
    },
  ],
  signatureCertifications: [
    {
      _key: 'tr-cert-study-guide',
      _type: 'certification',
      title: '30-Page Consolidated Study Guide',
      body: 'Members complete a 30-page consolidated study guide prior to recruiting interviews, ensuring technical readiness across all major financial disciplines.',
    },
  ],
};

const joinPageDoc = {
  _id: IDS.joinPage,
  _type: 'joinPage',
  title: 'Join Page',
  seo: {
    title: 'Join — Bruin Alpha Investment at UCLA',
    description:
      'Apply to Bruin Alpha Investment. Learn about our recruitment timeline, application process, and FAQ.',
  },
  hero: {
    heading: 'Join the Cohort',
    subheading:
      'Four disciplines. One structured rotational program. Build your foundation in finance without locking into a single track on day one.',
  },
  intro:
    'Apply to BAI: review the timeline, complete the application, and meet the founding class through coffee chats.',
  // Per Metis §1.12: 4-step recruitment timeline. Lifted from the hardcoded
  // /join page's "Recruitment Timeline" list.
  timeline: [
    {
      _key: 'join-tl-1',
      _type: 'timelineStep',
      stepNumber: 1,
      title: 'Fall 2026 — Priority Application Deadline',
      body: 'Submit the application by the priority deadline for first consideration.',
    },
    {
      _key: 'join-tl-2',
      _type: 'timelineStep',
      stepNumber: 2,
      title: 'Through Week 5 — Rolling Applications & Coffee Chats',
      body: 'Rolling applications stay open through Week 5; meet founders in 1:1 coffee chats.',
    },
    {
      _key: 'join-tl-3',
      _type: 'timelineStep',
      stepNumber: 3,
      title: 'Weeks 5-6 — Interview Process (1x Technical + 1x Behavioral)',
      body: 'Selected applicants complete one technical and one behavioral interview.',
    },
    {
      _key: 'join-tl-4',
      _type: 'timelineStep',
      stepNumber: 4,
      title: 'Week 6 — Final Decisions Released',
      body: 'Final admit decisions are released by the end of Week 6.',
    },
  ],
  applicationForm: {
    heading: 'Application Form',
    body: 'Application opens Fall 2026. The form below is a Tally embed placeholder; the real form replaces it before launch.',
    formUrl: APPLY_URL,
  },
  // Per plan D11: inline FAQs on /join (separate from any shared FAQ doc
  // collection). 6 Q&A pairs lifted verbatim from the hardcoded /join page.
  faqs: [
    {
      _key: 'join-faq-1',
      _type: 'faq',
      question: 'Do I need finance experience?',
      answer:
        'No prior experience required for first-year applicants. We provide a structured rotational program covering all 4 verticals.',
    },
    {
      _key: 'join-faq-2',
      _type: 'faq',
      question: 'What year can I apply?',
      answer:
        'All current and incoming UCLA undergraduates are welcome to apply. First-years are encouraged.',
    },
    {
      _key: 'join-faq-3',
      _type: 'faq',
      question: 'How is BAI different from other UCLA finance clubs?',
      answer:
        'BAI combines blanket coverage of finance verticals with specialized committees and a rotational program — without requiring you to pick a single track on day one.',
    },
    {
      _key: 'join-faq-4',
      _type: 'faq',
      question: "What's the time commitment?",
      answer: '~3-5 hours per week during quarters, plus optional project work.',
    },
    {
      _key: 'join-faq-5',
      _type: 'faq',
      question: 'Is there a fee?',
      answer: 'No dues for general membership.',
    },
    {
      _key: 'join-faq-6',
      _type: 'faq',
      question: "What happens after I'm accepted?",
      answer:
        'You join the rotational program in Fall, cycle through all 4 committees over 8 weeks, then commit to one for the rest of the year.',
    },
  ],
  eligibilityHeading: 'Eligibility',
  eligibilityBullets: [
    'Current or incoming UCLA undergraduate',
    'No prior finance experience required',
    'Willing to commit ~3-5 hours/week during quarter',
    'Genuine interest in at least one of the four committee tracks',
  ],
};

const eventsPageDoc = {
  _id: IDS.eventsPage,
  _type: 'eventsPage',
  title: 'Events Page',
  seo: {
    title: 'Events — Bruin Alpha Investment at UCLA',
    description:
      'Find Bruin Alpha Investment at campus events, competitions, and speaker series.',
  },
  hero: {
    heading: 'Where to Find Us',
    subheading:
      'Connect with us across campus and track our participation in premier collegiate competitions.',
  },
  intro:
    'Connect with us across campus and track our participation in premier collegiate competitions.',
  upcomingEmptyState:
    'No upcoming events yet — recruitment dates announced soon.',
  pastEmptyState: 'Our first events run Fall 2026.',
};

const projectsPageDoc = {
  _id: IDS.projectsPage,
  _type: 'projectsPage',
  title: 'Projects Page',
  seo: {
    title: 'Projects & Research — Bruin Alpha Investment at UCLA',
    description:
      'Explore the hands-on initiatives, research, and engagements led by our specialized committees.',
  },
  hero: {
    heading: 'What We Build',
    subheading:
      'At Bruin Alpha Investment, theory is immediately put into practice. Our committees drive independent research and structured deliverables.',
  },
  intro:
    'Explore the hands-on initiatives, research, and engagements led by our specialized committees.',
  emptyState: 'Projects launching Fall 2026.',
  // Per plan D9: 3-entry status legend (planning, active, completed).
  // Wording lifted from the hardcoded /projects "Status Legend" footer.
  statusLegend: [
    {
      _key: 'status-planning',
      _type: 'statusLegendEntry',
      status: 'planning',
      description: 'Project being scoped and resourced.',
    },
    {
      _key: 'status-active',
      _type: 'statusLegendEntry',
      status: 'active',
      description: 'Currently being executed by members.',
    },
    {
      _key: 'status-completed',
      _type: 'statusLegendEntry',
      status: 'completed',
      description: 'Successfully delivered.',
    },
  ],
};

const teamPageDoc = {
  _id: IDS.teamPage,
  _type: 'teamPage',
  title: 'Team Page',
  seo: {
    title: 'Team — Bruin Alpha Investment at UCLA',
    description:
      'Meet the founding class, members, and alumni of Bruin Alpha Investment.',
  },
  hero: {
    heading: 'The Team',
    subheading:
      'Meet the minds behind Bruin Alpha Investment. A dedicated group of students pushing the boundaries of undergraduate finance.',
  },
  intro:
    'Meet the minds behind Bruin Alpha Investment. A dedicated group of students pushing the boundaries of undergraduate finance.',
  foundingClassHeading: 'Founding Class — Spring 2026',
  membersHeading: 'Members',
  membersPlaceholder:
    'Our first cohort joins Fall 2026 — check back after recruitment.',
  alumniHeading: 'Alumni',
  alumniPlaceholder: 'Our first alumni graduate in 2027.',
};

const committeesIndexPageDoc = {
  _id: IDS.committeesIndexPage,
  _type: 'committeesIndexPage',
  title: 'Committees Index Page',
  seo: {
    title: 'Committees — Bruin Alpha Investment at UCLA',
    description:
      'Explore our four core committees: Wealth Management, Trading, Accounting & Consulting, and Investment Banking.',
  },
  hero: {
    heading: 'Four Committees. One Club.',
    subheading:
      'Bruin Alpha Investment is structured around four core committees. While each has a distinct focus, they work together to provide a comprehensive financial education through our rotational program.',
  },
  intro:
    'Bruin Alpha Investment is structured around four core committees. While each has a distinct focus, they work together to provide a comprehensive financial education through our rotational program.',
  connectedByDesign: {
    heading: 'Connected by Design',
    body: "We don't believe in silos.",
    paragraphs: [
      "We don't believe in silos. Our unique rotational program ensures that every member gains exposure to all four disciplines during their early tenure. You might specialize in Wealth Management, but you'll understand how a trader sizes positions, how a consultant audits operations, and how an investment banker builds a DCF.",
      'This cross-pollination comes to life in our unified all-club projects, where members from different committees collaborate to tackle complex, multi-faceted financial challenges. We build well-rounded professionals who understand the entire financial ecosystem.',
    ],
  },
};

// ---------------------------------------------------------------------------
// Founding roster (real Spring 2026 club Slack roster — all class of 2029).
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 4 committee docs — populated with learn[], differentiator,
// directorPlaceholder, redirectsFrom[] (D6 + plan §1.13 expectations).
// Source: `app/(site)/committees/[slug]/page.tsx` hardcoded `committees`
// object literal.
// ---------------------------------------------------------------------------

const committees = [
  {
    _id: IDS.committees.wealth,
    _type: 'committee',
    name: 'Wealth Management',
    slug: { _type: 'slug', current: 'wealth-management' },
    director: { _type: 'reference', _ref: IDS.members.matt },
    tagline:
      'Soft skills, sales fundamentals, and the discipline behind a book of business.',
    description: portableText(
      COMMITTEE_PLACEHOLDER_DESCRIPTION,
      'desc-wealth',
    ),
    order: 1,
    accentColor: 'gold',
    learn: [
      'Rejection-resistance and emotional intelligence',
      'Relationship building and long-term client management',
      'SIE/Series exam awareness and preparation',
      'Wealth advisor career path fundamentals',
    ],
    differentiator:
      'The only finance club at UCLA emphasizing the wealth advisory career path with hands-on practice.',
    redirectsFrom: [] as string[],
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
    tagline:
      'Markets, mechanics, and the systematic edge — from chart reading to hedge fund recruiting.',
    description: portableText(
      COMMITTEE_PLACEHOLDER_DESCRIPTION,
      'desc-trading',
    ),
    order: 2,
    accentColor: 'navy',
    learn: [
      'Chart reading, price action, and order flow',
      'Volatility analysis and position sizing',
      'Systematic strategy basics and risk management',
      'Technical interview prep for trading roles and hedge fund coffee chats',
    ],
    differentiator:
      'A unique focus on hands-on quant and market structure across alternative asset classes.',
    redirectsFrom: [] as string[],
  },
  {
    _id: IDS.committees.accounting,
    _type: 'committee',
    name: 'Accounting & Consulting',
    slug: { _type: 'slug', current: 'accounting-consulting' },
    // Co-led by Ben + Michael. Ben listed first per Mack's roster note.
    director: { _type: 'reference', _ref: IDS.members.ben },
    tagline:
      'Where the numbers and the strategy meet — modeling, audit, and advisory thinking under one roof.',
    description: portableText(
      COMMITTEE_PLACEHOLDER_DESCRIPTION,
      'desc-accounting',
    ),
    order: 3,
    accentColor: 'gold',
    learn: [
      '3-statement modeling and financial statement analysis',
      'Discounted Cash Flow (DCF) and LBO basics',
      'Audit fundamentals and operational review',
      'Case frameworks and structured advisory thinking',
    ],
    differentiator:
      'Why Both? We explain the accounting-consulting overlap and why a unified committee best prepares you for both career paths.',
    redirectsFrom: [] as string[],
  },
  {
    _id: IDS.committees.ib,
    _type: 'committee',
    name: 'Investment Banking',
    slug: { _type: 'slug', current: 'investment-banking' },
    director: { _type: 'reference', _ref: IDS.members.maxHelmer },
    tagline: 'Modeling, networking, and the mental models behind every deal.',
    description: portableText(COMMITTEE_PLACEHOLDER_DESCRIPTION, 'desc-ib'),
    order: 4,
    accentColor: 'navy',
    learn: [
      'Advanced 3-statement modeling and DCF valuation',
      'M&A models, LBO mechanics, and accretion/dilution analysis',
      'Strategic networking, cold emailing, and coffee chat mastery',
      'Technical interview prep for top-tier banking groups',
    ],
    differentiator:
      'A rotational program first approach, transitioning to specialized IB prep with tight cohort camaraderie and access to a smaller community.',
    // Shown when director ref is unset / placeholder. IB director is "TBD"
    // in current hardcoded source.
    directorPlaceholder: 'TBD — announcement coming soon',
    redirectsFrom: [] as string[],
  },
] as const;

// ---------------------------------------------------------------------------
// 5 project docs — lifted from `app/(site)/projects/page.tsx`.
// All currently status="planning". committee ref maps the hardcoded
// "committee" string (e.g. "Trading (Aspirational)") to the closest doc.
// ---------------------------------------------------------------------------

const projects = [
  {
    _id: IDS.projects.eventContractModeling,
    _type: 'project',
    name: 'Event-Contract Modeling Research',
    slug: { _type: 'slug', current: 'event-contract-modeling-research' },
    summary:
      'A quantitative initiative focused on pricing and analyzing probability-based event contracts. Analysts will build predictive models to evaluate mispricings in event-driven markets.',
    narrative: portableText(
      'A quantitative initiative focused on pricing and analyzing probability-based event contracts. Analysts will build predictive models to evaluate mispricings in event-driven markets.',
      'proj-evtmod',
    ),
    committee: { _type: 'reference', _ref: IDS.committees.trading },
    status: 'planning',
    tags: ['research', 'quantitative', 'modeling'],
  },
  {
    _id: IDS.projects.uclaClubAudit,
    _type: 'project',
    name: 'UCLA Club Audit Initiative',
    slug: { _type: 'slug', current: 'ucla-club-audit-initiative' },
    summary:
      'Pro-bono financial reviews for other campus organizations. Members will assess cash flow, budget allocations, and operational efficiency, culminating in a formalized advisory report.',
    narrative: portableText(
      'Pro-bono financial reviews for other campus organizations. Members will assess cash flow, budget allocations, and operational efficiency, culminating in a formalized advisory report.',
      'proj-audit',
    ),
    committee: { _type: 'reference', _ref: IDS.committees.accounting },
    status: 'planning',
    tags: ['advisory', 'pro-bono', 'audit'],
  },
  {
    _id: IDS.projects.springStockPitch,
    _type: 'project',
    name: 'Spring Stock Pitch',
    slug: { _type: 'slug', current: 'spring-stock-pitch' },
    summary:
      'Our capstone event where analysts across all committees form teams to deliver comprehensive investment pitches, emphasizing rigorous valuation, market sizing, and strategic rationale.',
    narrative: portableText(
      'Our capstone event where analysts across all committees form teams to deliver comprehensive investment pitches, emphasizing rigorous valuation, market sizing, and strategic rationale.',
      'proj-pitch',
    ),
    committee: { _type: 'reference', _ref: IDS.committees.ib },
    status: 'planning',
    tags: ['capstone', 'all-club', 'pitch'],
  },
  {
    _id: IDS.projects.wealthAdvisoryMock,
    _type: 'project',
    name: 'Wealth Advisory Mock Engagement',
    slug: { _type: 'slug', current: 'wealth-advisory-mock-engagement' },
    summary:
      'Simulated client engagements requiring analysts to construct diversified portfolios based on specific risk profiles, tax considerations, and long-term financial objectives.',
    narrative: portableText(
      'Simulated client engagements requiring analysts to construct diversified portfolios based on specific risk profiles, tax considerations, and long-term financial objectives.',
      'proj-wealth',
    ),
    committee: { _type: 'reference', _ref: IDS.committees.wealth },
    status: 'planning',
    tags: ['simulation', 'portfolio'],
  },
  {
    _id: IDS.projects.uclaTradingComp,
    _type: 'project',
    name: 'UCLA-Wide Stock Trading Competition',
    slug: { _type: 'slug', current: 'ucla-wide-stock-trading-competition' },
    summary:
      'A campus-wide initiative currently in the planning phase. The goal is to democratize market access and test trading strategies in a competitive, simulated environment.',
    narrative: portableText(
      'A campus-wide initiative currently in the planning phase. The goal is to democratize market access and test trading strategies in a competitive, simulated environment.',
      'proj-tradecomp',
    ),
    committee: { _type: 'reference', _ref: IDS.committees.trading },
    status: 'planning',
    tags: ['competition', 'aspirational'],
  },
] as const;

// ---------------------------------------------------------------------------
// 6 event docs — lifted from `app/(site)/events/page.tsx`. The hardcoded
// page renders 2 upcoming + 4 competitions. Dates are TBD-style stand-ins
// (placeholder ISO dates within the relevant quarter); editors update once
// confirmed. externalUrl is the new camelCase field (per T0.8 deprecation).
// ---------------------------------------------------------------------------

const events = [
  {
    _id: IDS.events.eaf,
    _type: 'event',
    name: 'Enormous Activities Fair (EAF)',
    date: '2026-09-30T12:00:00.000Z',
    location: 'TBD — UCLA Campus',
    description:
      'Bruin Alpha Investment will be tabling at the annual UCLA Enormous Activities Fair. Come meet our founding class, learn about the rotational program, and ask questions about our four verticals before applications close.',
    type: 'fair',
    status: 'tbd',
  },
  {
    _id: IDS.events.speakers,
    _type: 'event',
    name: 'Speakers & Workshops',
    date: '2026-10-15T18:00:00.000Z',
    location: 'UCLA Campus',
    description:
      'Coming soon — speaker series in development. We are actively coordinating with industry professionals across trading, investment banking, and consulting.',
    type: 'speaker',
    status: 'tbd',
  },
  {
    _id: IDS.events.cme,
    _type: 'event',
    name: 'CME Trading Challenge',
    date: '2026-11-01T00:00:00.000Z',
    description:
      "Participation in the premier electronic trading competition utilizing CME Group's real-time professional trading platform.",
    type: 'comp',
    status: 'tbd',
    committee: { _type: 'reference', _ref: IDS.committees.trading },
  },
  {
    _id: IDS.events.imc,
    _type: 'event',
    name: 'IMC Prosperity',
    date: '2027-04-01T00:00:00.000Z',
    description:
      'Global trading challenge combining algorithmic trading, market making, and quantitative finance.',
    type: 'comp',
    status: 'tbd',
    committee: { _type: 'reference', _ref: IDS.committees.trading },
  },
  {
    _id: IDS.events.caseComps,
    _type: 'event',
    name: 'Case Competitions',
    date: '2026-11-15T00:00:00.000Z',
    description:
      'Targeted participation in regional and national accounting and investment banking case competitions.',
    type: 'comp',
    status: 'tbd',
    committee: { _type: 'reference', _ref: IDS.committees.accounting },
  },
  {
    _id: IDS.events.springPitchEvent,
    _type: 'event',
    name: 'Spring Stock Pitch',
    date: '2027-04-15T00:00:00.000Z',
    description:
      'Internal cross-committee competition synthesizing market research, financial modeling, and strategic presentation.',
    type: 'comp',
    status: 'tbd',
    committee: { _type: 'reference', _ref: IDS.committees.ib },
  },
] as const;

// ---------------------------------------------------------------------------
// Write helpers — mode-aware (Metis §2.13).
// ---------------------------------------------------------------------------

type WriteStatus = 'created' | 'replaced' | 'exists';

async function writeDoc(
  doc: Record<string, unknown> & { _id: string; _type: string },
): Promise<{ id: string; status: WriteStatus }> {
  if (seedMode === 'replace') {
    await client.createOrReplace(
      doc as Parameters<typeof client.createOrReplace>[0],
    );
    return { id: doc._id, status: 'replaced' };
  }
  // preserve: only create when missing — protects editor edits post-cutover.
  const existing = await client.getDocument(doc._id);
  if (existing) return { id: doc._id, status: 'exists' };
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
    `\n  🌱  Seeding Sanity\n` +
      `       project:  ${projectId}\n` +
      `       dataset:  ${dataset}\n` +
      `       mode:     ${seedMode}\n` +
      `       apiVer:   ${apiVersion}\n`,
  );

  const removed = await deleteStaleDocs(IDS.stale);
  if (removed > 0) {
     
    console.log(`  🧹  Removed ${removed} stale doc(s) from prior schema.\n`);
  }

  const results: Array<{ id: string; status: WriteStatus }> = [];

  // Order matters: members must exist BEFORE committees (committee.director
  // refs members). Committees must exist BEFORE projects/events (those ref
  // committees). Singletons and content docs can land in any order after
  // those foreign-key tiers.
  for (const member of foundingMembers) {
     
    results.push(await writeDoc(member));
  }

  for (const cmt of committees) {
     
    results.push(await writeDoc(cmt));
  }

  for (const proj of projects) {
     
    results.push(await writeDoc(proj));
  }

  for (const evt of events) {
     
    results.push(await writeDoc(evt));
  }

  // Singletons
  results.push(await writeDoc(siteSettingsDoc));
  results.push(await writeDoc(homePageDoc));
  results.push(await writeDoc(aboutPageDoc));
  results.push(await writeDoc(trainingPageDoc));
  results.push(await writeDoc(joinPageDoc));
  results.push(await writeDoc(eventsPageDoc));
  results.push(await writeDoc(projectsPageDoc));
  results.push(await writeDoc(teamPageDoc));
  results.push(await writeDoc(committeesIndexPageDoc));

   
  console.log('  Results:');
  for (const r of results) {
    const icon =
      r.status === 'created'
        ? '✨'
        : r.status === 'replaced'
        ? '♻️ '
        : '✓ ';
     
    console.log(`    ${icon} ${r.id} (${r.status})`);
  }

  const createdCount = results.filter((r) => r.status === 'created').length;
  const replacedCount = results.filter((r) => r.status === 'replaced').length;
  const existsCount = results.filter((r) => r.status === 'exists').length;
   
  console.log(
    `\n  ✅  Done. ${createdCount} created, ${replacedCount} replaced, ${existsCount} already existed.\n`,
  );
   
  console.log(
    `  Next: open https://www.sanity.io/manage → your project, or run \`bun run dev\`\n  and visit http://localhost:3000/studio to verify and continue editing.\n`,
  );
}

main().catch((err: unknown) => {
   
  console.error('\n  ❌  Seed failed:\n', err);
  process.exit(1);
});
