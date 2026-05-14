export type HeaderNavLink = {
  _key: string;
  label: string;
  href: string;
};

export type HeaderFallback = {
  brandName: string;
  brandAlt: string;
  navLinks: HeaderNavLink[];
};

/**
 * Hardcoded fallback for SiteHeader when NEXT_PUBLIC_USE_SANITY !== 'true'.
 * Values mirror what main currently ships so the flag-OFF rendering stays
 * byte-identical to production. Used as the source for both the in-memory
 * fallback render branch AND as the default-prop shape consumed by the client
 * component (so the client never has to deal with null/undefined).
 */
export const headerFallback: HeaderFallback = {
  brandName: 'Bruin Alpha Investment',
  brandAlt: 'Bruin Alpha Investment at UCLA',
  navLinks: [
    { _key: 'nav-home', label: 'Home', href: '/#home' },
    { _key: 'nav-committees', label: 'Committees', href: '/#committees' },
    { _key: 'nav-training', label: 'Training', href: '/#training' },
    { _key: 'nav-team', label: 'Team', href: '/#team' },
    { _key: 'nav-join', label: 'Join', href: '/#join' },
  ],
};
