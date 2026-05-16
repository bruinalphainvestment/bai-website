import { sanityFetch } from '@/sanity/lib/live';
import { siteSettingsQuery } from '@/sanity/lib/queries';

import { headerFallback, type HeaderNavLink } from './fallbacks/header';
import { SiteHeaderClient } from './site-header-client';

export async function SiteHeader() {
  const { brandAlt, navLinks } = await loadHeaderData();
  return <SiteHeaderClient brandAlt={brandAlt} navLinks={navLinks} />;
}

async function loadHeaderData(): Promise<{
  brandAlt: string;
  navLinks: HeaderNavLink[];
}> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') {
    return {
      brandAlt: headerFallback.brandAlt,
      navLinks: headerFallback.navLinks,
    };
  }

  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    if (!data) return { brandAlt: headerFallback.brandAlt, navLinks: headerFallback.navLinks };

    const brandAlt = data.uclaName ?? data.brandName ?? headerFallback.brandAlt;
    const fetchedLinks = (data.navLinks ?? []).flatMap<HeaderNavLink>((link) =>
      link.label && link.href
        ? [{ _key: link._key, label: link.label, href: link.href }]
        : [],
    );
    const navLinks = fetchedLinks.length > 0 ? fetchedLinks : headerFallback.navLinks;
    return { brandAlt, navLinks };
  } catch (error) {
    console.error('[SiteHeader] sanityFetch failed; using fallback:', error);
    return { brandAlt: headerFallback.brandAlt, navLinks: headerFallback.navLinks };
  }
}
