/**
 * One-shot migration: bare-rename snake_case fields to camelCase + delete
 * orphan documents whose schema types were removed.
 *
 * Why: previous deprecation pattern kept snake_case fields alive in schema +
 * data while we shipped. Now schemas are pure camelCase; this script aligns
 * existing data so queries can drop the coalesce() shims.
 *
 * Operations (transactional, per doc type):
 *   - committee: signature_projects -> signatureProjects, director_quote ->
 *     directorQuote, unset comp_calendar.
 *   - project: unset narrative, hero_image.
 *   - event: unset external_url.
 *   - siteSettings: unset ucla_compliant_name, mission_statement,
 *     disclaimer_text, domain_renewal_date.
 *   - delete orphan documents with _type == 'faq' (6 standalone seeded docs;
 *     schema removed; replaced by inline joinPage.faqs[]).
 *   - delete orphan documents with _type == 'page' (none expected; schema
 *     removed).
 *
 * Usage:
 *   NEXT_PUBLIC_SANITY_DATASET=production bun run migrate:camelcase
 *   NEXT_PUBLIC_SANITY_DATASET=migration bun run migrate:camelcase  # rehearsal
 *
 * Requires SANITY_API_WRITE_TOKEN with Editor or higher.
 */

import { createClient, type SanityClient } from 'next-sanity';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || 'production';
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || '2025-01-01';
const writeToken = process.env.SANITY_API_WRITE_TOKEN?.trim();

if (!projectId || projectId === 'pPLACEHOLDR') {
  console.error('❌ Missing real NEXT_PUBLIC_SANITY_PROJECT_ID');
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
  perspective: 'raw',
});

type CommitteeDoc = {
  _id: string;
  signature_projects?: unknown;
  director_quote?: unknown;
  comp_calendar?: unknown;
};

type ProjectDoc = {
  _id: string;
  narrative?: unknown;
  hero_image?: unknown;
};

type EventDoc = {
  _id: string;
  external_url?: unknown;
};

type SiteSettingsDoc = {
  _id: string;
  ucla_compliant_name?: unknown;
  mission_statement?: unknown;
  disclaimer_text?: unknown;
  domain_renewal_date?: unknown;
};

async function migrateCommittees(): Promise<void> {
  const docs = await client.fetch<CommitteeDoc[]>(
    `*[_type == "committee"]{ _id, signature_projects, director_quote, comp_calendar }`,
  );
  if (docs.length === 0) {
    console.log('  • committee: no docs');
    return;
  }
  const tx = client.transaction();
  let touched = 0;
  for (const doc of docs) {
    const set: Record<string, unknown> = {};
    const unset: string[] = [];
    if (doc.signature_projects !== undefined) {
      set.signatureProjects = doc.signature_projects;
      unset.push('signature_projects');
    }
    if (doc.director_quote !== undefined) {
      set.directorQuote = doc.director_quote;
      unset.push('director_quote');
    }
    if (doc.comp_calendar !== undefined) {
      unset.push('comp_calendar');
    }
    if (unset.length === 0) continue;
    let patch = client.patch(doc._id);
    if (Object.keys(set).length > 0) patch = patch.set(set);
    patch = patch.unset(unset);
    tx.patch(patch);
    touched++;
  }
  if (touched === 0) {
    console.log('  • committee: nothing to migrate');
    return;
  }
  await tx.commit();
  console.log(`  ✓ committee: migrated ${touched}/${docs.length}`);
}

async function migrateProjects(): Promise<void> {
  const docs = await client.fetch<ProjectDoc[]>(
    `*[_type == "project"]{ _id, narrative, hero_image }`,
  );
  if (docs.length === 0) {
    console.log('  • project: no docs');
    return;
  }
  const tx = client.transaction();
  let touched = 0;
  for (const doc of docs) {
    const unset: string[] = [];
    if (doc.narrative !== undefined) unset.push('narrative');
    if (doc.hero_image !== undefined) unset.push('hero_image');
    if (unset.length === 0) continue;
    tx.patch(client.patch(doc._id).unset(unset));
    touched++;
  }
  if (touched === 0) {
    console.log('  • project: nothing to migrate');
    return;
  }
  await tx.commit();
  console.log(`  ✓ project: migrated ${touched}/${docs.length}`);
}

async function migrateEvents(): Promise<void> {
  const docs = await client.fetch<EventDoc[]>(
    `*[_type == "event"]{ _id, external_url }`,
  );
  if (docs.length === 0) {
    console.log('  • event: no docs');
    return;
  }
  const tx = client.transaction();
  let touched = 0;
  for (const doc of docs) {
    if (doc.external_url === undefined) continue;
    tx.patch(client.patch(doc._id).unset(['external_url']));
    touched++;
  }
  if (touched === 0) {
    console.log('  • event: nothing to migrate');
    return;
  }
  await tx.commit();
  console.log(`  ✓ event: migrated ${touched}/${docs.length}`);
}

async function migrateSiteSettings(): Promise<void> {
  const doc = await client.fetch<SiteSettingsDoc | null>(
    `*[_type == "siteSettings"][0]{ _id, ucla_compliant_name, mission_statement, disclaimer_text, domain_renewal_date }`,
  );
  if (!doc) {
    console.log('  • siteSettings: no doc');
    return;
  }
  const unset: string[] = [];
  if (doc.ucla_compliant_name !== undefined) unset.push('ucla_compliant_name');
  if (doc.mission_statement !== undefined) unset.push('mission_statement');
  if (doc.disclaimer_text !== undefined) unset.push('disclaimer_text');
  if (doc.domain_renewal_date !== undefined) unset.push('domain_renewal_date');
  if (unset.length === 0) {
    console.log('  • siteSettings: nothing to migrate');
    return;
  }
  await client.patch(doc._id).unset(unset).commit();
  console.log(`  ✓ siteSettings: unset ${unset.length} legacy fields`);
}

async function deleteOrphans(orphanType: 'faq' | 'page'): Promise<void> {
  const ids = await client.fetch<string[]>(
    `*[_type == $orphanType]._id`,
    { orphanType },
  );
  if (ids.length === 0) {
    console.log(`  • ${orphanType}: no orphan docs`);
    return;
  }
  const tx = client.transaction();
  for (const id of ids) tx.delete(id);
  await tx.commit();
  console.log(`  ✓ ${orphanType}: deleted ${ids.length} orphan docs`);
}

async function main(): Promise<void> {
  console.log(`\nMigrating dataset='${dataset}' projectId='${projectId}'\n`);
  await migrateCommittees();
  await migrateProjects();
  await migrateEvents();
  await migrateSiteSettings();
  await deleteOrphans('faq');
  await deleteOrphans('page');
  console.log('\n✓ Migration complete.\n');
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
