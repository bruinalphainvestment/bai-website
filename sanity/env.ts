/**
 * Centralised access to Sanity env vars with safe fallbacks.
 *
 * The fallback `pPLACEHOLDR` is intentionally a 10-char syntactically valid
 * projectId so the Studio + client modules don't crash at build/import time
 * before the real project is provisioned. See `docs/SETUP-CHECKLIST.md`
 * Section D — Mack swaps the real ID in once Sanity org+project exist.
 */

function readEnv(name: string): string | undefined {
  const raw = (process.env as Record<string, string | undefined>)[name];
  if (typeof raw !== 'string') return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export const PLACEHOLDER_PROJECT_ID = 'pPLACEHOLDR';

export const projectId =
  readEnv('NEXT_PUBLIC_SANITY_PROJECT_ID') ?? PLACEHOLDER_PROJECT_ID;

export const dataset = readEnv('NEXT_PUBLIC_SANITY_DATASET') ?? 'production';

export const apiVersion =
  readEnv('NEXT_PUBLIC_SANITY_API_VERSION') ?? '2025-01-01';

/**
 * Server-only. Used by webhook handlers + on-demand revalidation. NEVER
 * expose via NEXT_PUBLIC_*.
 */
export const writeToken = readEnv('SANITY_API_WRITE_TOKEN');

export const readToken = readEnv('SANITY_API_READ_TOKEN');

/**
 * CDN-cached client by default for prod RSC fetches. Disabled when a write
 * token is present (mutations/preview paths bypass cache).
 */
export const useCdn = writeToken === undefined;

export const studioBasePath = '/studio';

/**
 * ISR revalidate window in seconds. Metis-mandated 1-hour cadence; Sanity
 * webhooks can also trigger on-demand revalidation via `app/api/revalidate`.
 */
export const revalidateSeconds = 3600;

export const isPlaceholderProject = projectId === PLACEHOLDER_PROJECT_ID;

export function placeholderWarning(context: string): string | null {
  if (!isPlaceholderProject) return null;
  return `[sanity:${context}] Using placeholder projectId. Update NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local + Vercel once the real Sanity project is created (see docs/SETUP-CHECKLIST.md Section D).`;
}
