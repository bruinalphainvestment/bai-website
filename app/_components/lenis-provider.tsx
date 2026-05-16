'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect, useState } from 'react';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const [isIframed, setIsIframed] = useState(false);

  useEffect(() => {
    // Detect if rendered inside an iframe (e.g., Sanity Presentation tool).
    // Skip Lenis initialization in that case so native browser scroll works.
    if (typeof window !== 'undefined' && window.self !== window.top) {
      setIsIframed(true);
    }
  }, []);

  // If iframed, skip Lenis and use native browser scroll.
  if (isIframed) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        syncTouch: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
