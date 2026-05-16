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
    <ReactLenis root options={{ anchors: true, stopInertiaOnNavigate: true, syncTouch: false, lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}
