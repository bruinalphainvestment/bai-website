/**
 * One-shot: upload a local image file to Sanity as an asset and set it as
 * siteSettings.defaultOgImage. Idempotent — re-running uploads a new asset
 * each time (Sanity dedupes by hash, so identical files reuse the same _id).
 *
 * Usage:
 *   bun run --bun sanity/seed/seed-og-image.ts <path-to-image>
 *
 * Requires SANITY_API_WRITE_TOKEN with Editor or higher.
 */

import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createClient, type SanityClient } from 'next-sanity';

function requireArg(): string {
  const value = process.argv[2];
  if (!value) {
    throw new Error('Usage: bun run --bun sanity/seed/seed-og-image.ts <path>');
  }
  return value;
}

const imagePath = requireArg();

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

async function main(): Promise<void> {
  console.log(`\n▶ Uploading ${imagePath} to dataset "${dataset}"\n`);

  const fileBuffer = readFileSync(imagePath);
  const filename = basename(imagePath);

  const asset = await client.assets.upload('image', fileBuffer, {
    filename,
    contentType: 'image/png',
  });
  console.log(`  ✓ Uploaded asset → ${asset._id}`);
  console.log(`    URL: ${asset.url}`);

  await client
    .patch('siteSettings')
    .set({
      defaultOgImage: {
        _type: 'image',
        asset: { _type: 'reference', _ref: asset._id },
      },
    })
    .commit({ autoGenerateArrayKeys: true });
  console.log(`  ✓ siteSettings.defaultOgImage → references ${asset._id}`);

  console.log('\n✅ OG image seed complete.\n');
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
