'use client';

import { ReactLenis } from 'lenis/react';

import { GsapLenisBridge } from './gsap-lenis-bridge';

export function LenisRuntime({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
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
