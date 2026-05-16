import type { SanityImageSource } from '@sanity/image-url';
import type { Metadata } from 'next';

import { urlForImage } from '@/sanity/lib/imageUrl';

type OgImageInput = SanityImageSource | null | undefined;
type OgImages = NonNullable<NonNullable<Metadata['openGraph']>['images']>;

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
