'use client';

import { ReactLenis } from 'lenis/react';

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ anchors: true, stopInertiaOnNavigate: true, syncTouch: false, lerp: 0.1 }}>
      {children}
    </ReactLenis>
  );
}
