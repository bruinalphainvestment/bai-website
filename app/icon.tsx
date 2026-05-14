import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#002147',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#C5A059',
          fontSize: 14,
          fontWeight: 'bold',
          fontFamily: 'serif',
          letterSpacing: '-0.5px',
        }}
      >
        BAI
      </div>
    ),
    { ...size }
  );
}
