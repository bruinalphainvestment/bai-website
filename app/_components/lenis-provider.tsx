'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const LenisRuntime = dynamic(
  () => import('./lenis-runtime').then((m) => m.LenisRuntime),
  { ssr: false, loading: () => null },
);

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isIframed, setIsIframed] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsIframed(true);
      return;
    }

    // Defer Lenis (and its dynamic chunk + GSAP) until the user actually
    // tries to scroll/navigate. The first wheel/touchstart/keydown lands
    // as native scroll; Lenis takes over on the next event. Saves the
    // Lenis bundle from initial TTI for users who land + immediately leave.
    const trigger = () => setHasInteracted(true);
    const opts = { once: true, passive: true } as const;
    window.addEventListener('wheel', trigger, opts);
    window.addEventListener('touchstart', trigger, opts);
    window.addEventListener('keydown', trigger, opts);
    window.addEventListener('mousedown', trigger, opts);
    return () => {
      window.removeEventListener('wheel', trigger);
      window.removeEventListener('touchstart', trigger);
      window.removeEventListener('keydown', trigger);
      window.removeEventListener('mousedown', trigger);
    };
  }, []);

  if (isIframed || !hasInteracted) {
    return <>{children}</>;
  }

  return <LenisRuntime>{children}</LenisRuntime>;
}
