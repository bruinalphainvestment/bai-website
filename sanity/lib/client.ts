import { createClient } from 'next-sanity';

import {
  apiVersion,
  dataset,
  projectId,
  revalidateSeconds,
  studioBasePath,
  useCdn,
} from '../env';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: 'published',
  stega: { studioUrl: studioBasePath },
});

export const defaultFetchOptions = {
  next: { revalidate: revalidateSeconds },
} as const;
