import { draftMode } from 'next/headers';
import { createClient, type SanityClient } from 'next-sanity';

import {
  apiVersion,
  dataset,
  projectId,
  readToken,
  revalidateSeconds,
  studioBasePath,
  useCdn,
} from '../env';

export const client: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
  stega: { studioUrl: studioBasePath },
});

export const sanityClient = client;

export const draftClient: SanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token: readToken,
  stega: { studioUrl: studioBasePath, enabled: true },
});

export async function getClient(): Promise<SanityClient> {
  const draft = await draftMode();
  return draft.isEnabled ? draftClient : client;
}

export const defaultFetchOptions = {
  next: { revalidate: revalidateSeconds },
} as const;
