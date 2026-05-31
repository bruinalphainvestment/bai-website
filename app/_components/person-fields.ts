import { stegaClean } from 'next-sanity';

const COMMITTEE_LABELS: Record<string, string> = {
  'accounting-consulting': 'Consulting',
  'investment-banking': 'Investment Banking',
  operations: 'Operations',
  president: 'President',
  trading: 'Trading',
  'wealth-management': 'Wealth Management',
};

export function formatCommitteeLabel(committee: string | null | undefined): string | null {
  const value = stegaClean(committee ?? '').trim();
  if (!value) return null;
  return COMMITTEE_LABELS[value] ?? titleizeSlug(value);
}

export function formatGraduationYear(gradYear: number | null | undefined): string | null {
  if (!Number.isInteger(gradYear)) return null;
  return `Class of ${gradYear}`;
}

export function normalizeExternalUrl(url: string | null | undefined): string | null {
  const value = stegaClean(url ?? '').trim();
  if (!value || value === '#') return null;

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function titleizeSlug(value: string): string {
  return value
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
