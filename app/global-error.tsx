'use client';

import { useEffect } from 'react';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const HEADING = 'Something went wrong';
const BODY =
  'A fatal error interrupted the application. You can try again, or head back to the homepage.';

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[app/global-error] caught:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#FAF7F2',
          color: '#0A1428',
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div style={{ maxWidth: '640px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#C5A059',
              marginBottom: '24px',
            }}
          >
            500
          </p>
          <h1
            style={{
              fontFamily: "'Fraunces', 'Times New Roman', serif",
              fontSize: '48px',
              fontWeight: 300,
              lineHeight: 1.1,
              marginBottom: '24px',
            }}
          >
            {HEADING}
          </h1>
          <p
            style={{
              fontSize: '18px',
              lineHeight: 1.6,
              color: 'rgba(10, 20, 40, 0.8)',
              marginBottom: '40px',
            }}
          >
            {BODY}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={reset}
              style={{
                background: '#0A1428',
                color: '#FAF7F2',
                fontWeight: 600,
                padding: '12px 32px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
            <a
              href="/"
              style={{
                border: '1px solid #0A1428',
                color: '#0A1428',
                fontWeight: 600,
                padding: '12px 32px',
                borderRadius: '999px',
                textDecoration: 'none',
              }}
            >
              Return Home
            </a>
          </div>
          {error.digest ? (
            <p
              style={{
                fontFamily: 'ui-monospace, monospace',
                fontSize: '11px',
                color: 'rgba(10, 20, 40, 0.4)',
                marginTop: '40px',
              }}
            >
              Reference: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}
