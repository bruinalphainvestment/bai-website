'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

const HEADING = 'Something went wrong';
const BODY =
  'An unexpected error interrupted this page. You can try again, or head back to the homepage.';

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[app/error] caught:', error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="min-h-screen bg-cream text-navy flex items-center justify-center px-6 py-24"
    >
      <div className="max-w-2xl text-center">
        <p className="text-sm tracking-widest uppercase text-gold-start mb-6">
          500
        </p>
        <h1 className="font-serif text-5xl md:text-6xl font-light tracking-tight mb-6">
          {HEADING}
        </h1>
        <p className="font-sans text-lg md:text-xl text-navy/80 mb-10 leading-relaxed">
          {BODY}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-block bg-navy text-cream font-semibold py-3 px-8 rounded-full hover:bg-navy/90 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-block border border-navy text-navy font-semibold py-3 px-8 rounded-full hover:bg-navy hover:text-cream transition-colors"
          >
            Return Home
          </a>
        </div>
        {error.digest ? (
          <p className="font-mono text-xs text-navy/40 mt-10">
            Reference: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}
