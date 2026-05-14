import { test, expect } from '@playwright/test';
import { PLACEHOLDER_PROJECT_ID } from '../sanity/env';

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ?? '';
const isPlaceholderProject =
  rawProjectId.length === 0 || rawProjectId === PLACEHOLDER_PROJECT_ID;

test.describe('Sanity CMS client', () => {
  test.skip(
    isPlaceholderProject,
    `Skipping CMS integration: NEXT_PUBLIC_SANITY_PROJECT_ID is unset or placeholder (${PLACEHOLDER_PROJECT_ID}).`,
  );

  test('sanity/lib/client exports a configured client', async () => {
    const mod = await import('../sanity/lib/client');
    expect(mod.client, 'sanity/lib/client must export `client`').toBeDefined();
    expect(typeof mod.client.fetch).toBe('function');
    expect(typeof mod.client.config).toBe('function');

    const cfg = mod.client.config();
    expect(cfg.projectId).toBe(rawProjectId);
  });
});
