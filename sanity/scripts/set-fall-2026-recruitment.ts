/**
 * One-shot: publish the Fall 2026 recruitment schedule to the configured
 * Sanity dataset without re-seeding. Only these fields are touched:
 *   - joinPage.timeline, joinPage.applicationForm.body
 *   - eventsPage.upcomingEmptyState
 *   - the EAF event's date/status/description
 *   - four recruitment event docs (created or replaced by fixed ID)
 * Idempotent — re-running writes the same values.
 *
 * Mirrors the matching content in sanity/seed/seed.ts.
 *
 * Usage (bun auto-loads .env.local):
 *   bun run sanity/scripts/set-fall-2026-recruitment.ts
 */

import { createClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2025-01-01';
const token = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

// Room not confirmed yet — update here (and in seed.ts) once booked.
const MEETING_LOCATION = 'TBD';

const timeline = [
  ['Tue, Sept 22 — EAF & Applications Open', 'Meet us at the Enormous Activities Fair. The application opens the same day.'],
  ['Wed, Sept 30 — Info Session & Applications Close', 'Info session from 6:00–7:50 PM. Applications close at the end of the day.'],
  ['Fri–Sat, Oct 2–3 — Coffee Chats', 'Selected applicants meet members in 1:1 coffee chats.'],
  ['Wed–Fri, Oct 7–9 — Final Rounds', 'Final round interviews (1x technical + 1x behavioral).'],
  ['Sat–Mon, Oct 10–12 — Decisions Released', 'Admit decisions go out over the weekend.'],
  ['Wed, Oct 14 — First New Member Meeting', 'The new cohort’s first general meeting, 6:00–7:50 PM.'],
].map(([title, body], i) => ({
  _key: `join-tl-${i + 1}`,
  _type: 'timelineStep',
  stepNumber: i + 1,
  title,
  body,
}));

// Times are stored in UTC; 01:00Z / 02:50Z = 6:00 / 7:50 PM PDT the prior day.
const newEvents: Array<{ _id: string; _type: string; [field: string]: unknown }> = [
  {
    _id: 'event-info-session-fall-2026',
    _type: 'event',
    name: 'Recruitment Info Session',
    date: '2026-10-01T01:00:00Z',
    endDate: '2026-10-01T02:50:00Z',
    location: MEETING_LOCATION,
    description:
      'Learn about BAI, our four committees, and the recruitment process. Applications close at the end of the day.',
    type: 'recruitment',
    status: 'scheduled',
  },
  {
    _id: 'event-coffee-chats-fall-2026',
    _type: 'event',
    name: 'Coffee Chats',
    date: '2026-10-02T19:00:00Z',
    endDate: '2026-10-03T19:00:00Z',
    description: 'Selected applicants meet members in 1:1 coffee chats.',
    type: 'recruitment',
    status: 'scheduled',
  },
  {
    _id: 'event-final-rounds-fall-2026',
    _type: 'event',
    name: 'Final Round Interviews',
    date: '2026-10-07T19:00:00Z',
    endDate: '2026-10-09T19:00:00Z',
    description:
      'Final round interviews (1x technical + 1x behavioral). Decisions are released Oct 10–12.',
    type: 'recruitment',
    status: 'scheduled',
  },
  {
    _id: 'event-first-new-member-meeting-fall-2026',
    _type: 'event',
    name: 'First New Member Meeting',
    date: '2026-10-15T01:00:00Z',
    endDate: '2026-10-15T02:50:00Z',
    location: MEETING_LOCATION,
    description: 'The new cohort’s first general meeting.',
    type: 'recruitment',
    status: 'scheduled',
  },
];

const tx = client
  .transaction()
  .patch('joinPage', (p) =>
    p.set({
      timeline,
      'applicationForm.body':
        'Applications open Tuesday, September 22 and close Wednesday, September 30.',
    }),
  )
  .patch('eventsPage', (p) =>
    p.set({ upcomingEmptyState: 'No upcoming events right now. Check back soon.' }),
  )
  .patch('event-enormous-activities-fair-2026', (p) =>
    p.set({
      date: '2026-09-22T19:00:00Z',
      status: 'scheduled',
      description:
        'Bruin Alpha Investment will be tabling at the annual UCLA Enormous Activities Fair. Come meet our founding class, learn about the rotational program, and ask questions about our four verticals. Applications open the same day.',
    }),
  );
for (const doc of newEvents) tx.createOrReplace(doc);

const result = await tx.commit();
console.log(`✓ ${dataset}: committed transaction ${result.transactionId} (${result.results.length} mutations)`);
