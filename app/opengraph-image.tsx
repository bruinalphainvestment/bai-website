import { ImageResponse } from 'next/og';

export const alt = 'Bruin Alpha Investment at UCLA';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
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
            Bruin Alpha Investment
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
            Have Passion, Believe in Legacy, Believe in BAI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}