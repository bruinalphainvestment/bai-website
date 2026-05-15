import { ImageResponse } from 'next/og';
import { stegaClean } from 'next-sanity';

import { sanityFetch } from '@/sanity/lib/live';
import { siteSettingsQuery } from '@/sanity/lib/queries';

export const alt = 'Bruin Alpha Investment at UCLA';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

const FALLBACK = {
  brandName: 'Bruin Alpha Investment',
  slogan: 'Have Passion, Believe in Legacy, Believe in BAI',
};

export default async function Image() {
  const { brandName, slogan } = await loadCopy();

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(180deg, #0A1428 0%, #002147 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #1A2A4A',
            borderRadius: '24px',
            width: '100%',
            height: '100%',
            padding: '40px',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontFamily: 'serif',
              color: '#F5F5F0',
              textAlign: 'center',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '24px',
            }}
          >
            {brandName}
          </div>
          <div
            style={{
              width: '120px',
              height: '4px',
              background: 'linear-gradient(90deg, #C5A059 0%, #8B6F38 100%)',
              marginBottom: '32px',
            }}
          />
          <div
            style={{
              fontSize: 32,
              fontFamily: 'sans-serif',
              color: '#FAF7F2',
              textAlign: 'center',
              fontWeight: 400,
            }}
          >
            {slogan}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

async function loadCopy(): Promise<{ brandName: string; slogan: string }> {
  if (process.env.NEXT_PUBLIC_USE_SANITY !== 'true') return FALLBACK;
  try {
    const { data } = await sanityFetch({ query: siteSettingsQuery });
    if (!data) return FALLBACK;
    const clean = stegaClean(data);
    return {
      brandName: clean.brandName ?? FALLBACK.brandName,
      slogan: clean.slogan ?? FALLBACK.slogan,
    };
  } catch (error) {
    console.error('[opengraph-image] siteSettings fetch failed; using fallback:', error);
    return FALLBACK;
  }
}
