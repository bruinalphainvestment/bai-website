'use client';

import { useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';

export function ReducedMotionGuard() {
  const prefersReducedMotion = useReducedMotion();
  const lenis = useLenis();

  useEffect(() => {
    if (prefersReducedMotion) {
      if (lenis) {
        lenis.stop();
      }
      gsap.globalTimeline.pause();
    } else {
      if (lenis) {
        lenis.start();
      }
      gsap.globalTimeline.play();
    }
  }, [prefersReducedMotion, lenis]);

  return null;
}
