'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useLenis } from 'lenis/react';

export function RouteChangeHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    ScrollTrigger.refresh();
  }, [pathname, lenis]);

  return null;
}
