import type { CommitteeBySlugQueryResult } from '@/sanity/types/generated';

type CommitteeDetail = NonNullable<CommitteeBySlugQueryResult>;

export const committeeDetailFallback: Record<string, CommitteeDetail> = {};
