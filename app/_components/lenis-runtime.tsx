'use client';

import { ReactLenis } from 'lenis/react';

import { GsapLenisBridge } from './gsap-lenis-bridge';

export function LenisRuntime({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        syncTouch: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      }}
    >
      <GsapLenisBridge />
      {children}
    </ReactLenis>
  );
}
