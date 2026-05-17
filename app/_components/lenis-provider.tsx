'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const LenisRuntime = dynamic(
  () => import('./lenis-runtime').then((m) => m.LenisRuntime),
  { ssr: false, loading: () => null },
);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isIframed, setIsIframed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsIframed(true);
    }
    setMounted(true);
  }, []);

  if (!mounted || isIframed) {
    return <>{children}</>;
  }

  return <LenisRuntime>{children}</LenisRuntime>;
}
