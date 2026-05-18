/**
 * One-shot: append " & Founder" to every `foundingMember.role` in the
 * configured Sanity dataset. Idempotent — re-running is safe: any member
 * whose role already contains the word "Founder" (case-insensitive,
 * matching "Founder", "Co-Founder", "President & Founder", etc.) is
 * skipped untouched. Only the `role` field is mutated.
 *
 * Why: only Mack's doc currently surfaces founder status. Every founding
 * member should reflect that they're a founder in their displayed role
 * string while keeping their individual title intact, e.g.
 *   "President"            -> "President & Founder"
 *   "Trading Co-Director"  -> "Trading Co-Director & Founder"
 *
 * Usage (mirrors `bun run seed` — bun auto-loads .env.local):
 *   bun run sanity/scripts/append-founder-to-roles.ts
 *   # or
 *   bunx tsx sanity/scripts/append-founder-to-roles.ts
 *
 * Required env (read from `.env.local` or shell — same pattern as
 * sanity/seed/seed.ts):
 *   - NEXT_PUBLIC_SANITY_PROJECT_ID
 *   - NEXT_PUBLIC_SANITY_DATASET (defaults to "production")
 *   - NEXT_PUBLIC_SANITY_API_VERSION (defaults to "2025-01-01")
 *   - SANITY_API_WRITE_TOKEN (Editor+ scope)
 */

import { createClient, type SanityClient } from 'next-sanity';

const SUFFIX = ' & Founder';
const FOUNDER_PATTERN = /founder/i;

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
    'Missing real NEXT_PUBLIC_SANITY_PROJECT_ID. Set it in .env.local first.',
  );
}

if (!writeToken) {
  exitWithError(
    'Missing SANITY_API_WRITE_TOKEN.\n' +
      '     1) sanity.io/manage → your project → API → Tokens\n' +
      '     2) Create a token with Editor permissions\n' +
      '     3) Add SANITY_API_WRITE_TOKEN=... to .env.local (server-only,\n' +
      '        NEVER prefix with NEXT_PUBLIC_)',
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

interface FoundingMemberDoc {
  _id: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function displayName(member: FoundingMemberDoc): string {
  const name = [member.firstName, member.lastName].filter(Boolean).join(' ');
  return name || member._id;
}

async function main(): Promise<void> {
  console.log(
    `\n  🛠   Appending "${SUFFIX.trim()}" to foundingMember.role\n` +
      `       project:  ${projectId}\n` +
      `       dataset:  ${dataset}\n` +
      `       apiVer:   ${apiVersion}\n`,
  );

  const members = await client.fetch<FoundingMemberDoc[]>(
    `*[_type == "foundingMember"] | order(lastName asc) {
       _id, firstName, lastName, role
     }`,
  );

  if (members.length === 0) {
    console.log('  ⚠   No foundingMember documents found. Nothing to do.\n');
    return;
  }

  console.log(`  Found ${members.length} foundingMember doc(s).\n`);

  const updated: Array<{ name: string; before: string; after: string }> = [];
  const skipped: Array<{ name: string; role: string; reason: string }> = [];
  const errored: Array<{ name: string; error: string }> = [];

  for (const member of members) {
    const name = displayName(member);
    const currentRole = member.role;

    if (typeof currentRole !== 'string' || currentRole.length === 0) {
      console.log(`  ⚠   ${name} — role is missing/empty, skipping.`);
      skipped.push({
        name,
        role: String(currentRole ?? ''),
        reason: 'empty role',
      });
      continue;
    }

    if (FOUNDER_PATTERN.test(currentRole)) {
      console.log(
        `  ✓   ${name} — already contains "Founder" (role: "${currentRole}"), skipping.`,
      );
      skipped.push({
        name,
        role: currentRole,
        reason: 'already contains "Founder"',
      });
      continue;
    }

    const nextRole = `${currentRole}${SUFFIX}`;

    try {
      await client.patch(member._id).set({ role: nextRole }).commit();
      console.log(`  ✨  ${name}`);
      console.log(`        before: "${currentRole}"`);
      console.log(`        after:  "${nextRole}"`);
      updated.push({ name, before: currentRole, after: nextRole });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ❌  ${name} — patch failed: ${message}`);
      errored.push({ name, error: message });
    }

    // Throttle to stay well under Sanity's mutation rate limit when we
    // commit patches individually rather than as a single transaction.
    await sleep(100);
  }

  console.log('\n  ──────────────  Summary  ──────────────');
  console.log(`  Updated:        ${updated.length}`);
  console.log(`  Skipped:        ${skipped.length}`);
  console.log(`  Errored:        ${errored.length}`);
  console.log(`  Total scanned:  ${members.length}`);

  if (skipped.length > 0) {
    console.log('\n  Skipped detail:');
    for (const s of skipped) {
      console.log(`    • ${s.name} — "${s.role}" (${s.reason})`);
    }
  }

  if (errored.length > 0) {
    console.log('\n  Errors:');
    for (const e of errored) {
      console.log(`    • ${e.name} — ${e.error}`);
    }
    process.exit(1);
  }

  console.log('\n  ✅  Done.\n');
}

main().catch((err: unknown) => {
  console.error('\n  ❌  Script failed:\n', err);
  process.exit(1);
});
