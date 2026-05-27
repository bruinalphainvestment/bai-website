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

export const headerFallback: HeaderFallback = {
  brandName: '',
  brandAlt: 'Brand logo',
  navLinks: [],
};
