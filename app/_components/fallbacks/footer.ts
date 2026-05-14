import type { SiteSettingsQueryResult } from '@/sanity/types/generated';

/**
 * Hardcoded fallback for SiteFooter when NEXT_PUBLIC_USE_SANITY !== 'true'.
 * Values match what main currently ships so production rendering is byte-identical
 * with the flag OFF. Shape matches `siteSettingsQuery` result so the same render
 * branch works whether data came from Sanity or this module.
 */
export const footerFallback: NonNullable<SiteSettingsQueryResult> = {
  brandName: 'Bruin Alpha Investment',
  titleSuffix: ' — Bruin Alpha Investment at UCLA',
  slogan: 'Investing in Bruin excellence.',
  disclaimer:
    'Bruin Alpha Investment is a registered student organization at UCLA. Content on this site is educational only and does not constitute investment advice. BAI is not a registered investment adviser, broker-dealer, or financial advisor. This organization acts independently of UCLA and does not represent the University.',
  uclaName: 'Bruin Alpha Investment at UCLA',
  mission: null,
  applyUrl: 'https://tally.so/r/placeholder',
  clubEmail: 'bruinalphainvestment26@gmail.com',
  instagramUrl: 'https://instagram.com',
  linkedinUrl: 'https://linkedin.com',
  slackInviteUrl: null,
  navLinks: [
    { _key: 'nav-home', _type: 'navLink', label: 'Home', href: '/#home' },
    { _key: 'nav-committees', _type: 'navLink', label: 'Committees', href: '/#committees' },
    { _key: 'nav-training', _type: 'navLink', label: 'Training', href: '/#training' },
    { _key: 'nav-team', _type: 'navLink', label: 'Team', href: '/#team' },
    { _key: 'nav-join', _type: 'navLink', label: 'Join', href: '/#join' },
  ],
  foundedYear: 2026,
  foundedTerm: 'Spring 2026',
  defaultMetaDescription:
    'Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application.',
  defaultOgImage: null,
  organizationDescription:
    'Bruin Alpha Investment is a student-led organization dedicated to bridging academic finance with real-world market application.',
  sameAs: null,
  errorCopy: null,
  domainRenewal: null,
};
