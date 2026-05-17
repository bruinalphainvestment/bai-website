import type { SanityImageSource } from '@sanity/image-url';
import type { Metadata } from 'next';

import { urlForImage } from '@/sanity/lib/imageUrl';
import type { Seo, SiteSettingsQueryResult } from '@/sanity/types/generated';

type OgImageInput = SanityImageSource | null | undefined;
type OgImage = { url: string; width: number; height: number; alt: string };
type OgImages = OgImage[];
type SiteSettings = NonNullable<SiteSettingsQueryResult>;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'http://localhost:3000';

export function absoluteUrl(path: string): string {
  if (!path.startsWith('/')) return `${SITE_URL}/${path}`;
  return `${SITE_URL}${path}`;
}

export function resolveOgImages(
  pageOgImage: OgImageInput,
  defaultOgImage: OgImageInput,
  alt: string,
): OgImages | undefined {
  const source = pageOgImage ?? defaultOgImage;
  if (!source) return undefined;
  const url = urlForImage(source).width(1200).height(630).url();
  return [{ url, width: 1200, height: 630, alt }];
}

type BuildPageMetadataArgs = {
  path: string;
  seo?: Seo | null;
  settings: SiteSettings;
  fallbackTitle: string;
  fallbackDescription?: string;
  noIndex?: boolean;
};

export function buildPageMetadata({
  path,
  seo,
  settings,
  fallbackTitle,
  fallbackDescription,
  noIndex,
}: BuildPageMetadataArgs): Metadata {
  const brand = settings.brandName ?? 'Bruin Alpha Investment';
  const suffix = settings.titleSuffix ?? ' — Bruin Alpha Investment at UCLA';

  const title = seo?.title ?? `${fallbackTitle}${suffix}`;
  const description =
    seo?.description ??
    settings.defaultMetaDescription ??
    fallbackDescription ??
    `${brand} — UCLA's student-led investment club.`;

  const canonical = absoluteUrl(path);
  const images = resolveOgImages(seo?.ogImage, settings.defaultOgImage, title);

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: brand,
      locale: 'en_US',
      type: 'website',
      ...(images ? { images } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
