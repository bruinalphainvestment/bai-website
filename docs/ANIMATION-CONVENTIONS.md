# Animation Conventions

This document outlines the animation strategy for the Bruin Alpha Investment (BAI) website. To maintain high performance and accessible experiences, we follow a strict "separation of concerns" between GSAP and Motion (Framer Motion).

## The Rule: GSAP vs. Motion

We use two primary animation libraries, each with a specific purpose:

1.  **GSAP + ScrollTrigger**: Used for **scroll-linked timelines** and heavy orchestration.
    *   *Examples*: Hero section pinning, complex staggered entrance sequences triggered by scroll, infinite marquees, and count-up stats.
    *   *Why*: GSAP is the industry standard for precise timeline control and integrates seamlessly with `Lenis` for smooth scrolling.
2.  **Motion (motion/react)**: Used for **component micro-interactions** and layout transitions.
    *   *Examples*: Button hovers, focus states, page-to-page transitions (Framer Motion `AnimatePresence`), and simple entrance animations for small UI elements.
    *   *Why*: Motion offers a declarative, React-friendly API that excels at simple state-based animations.

---

## Pattern Catalog

### 1. Pinned Hero
*Reference: `app/_components/sections/hero.tsx`*

The hero section uses GSAP to pin the container while fading out the background or scaling text as the user scrolls.

```tsx
'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.to(containerRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          scrub: true,
        },
        opacity: 0.5,
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return <section ref={containerRef}>...</section>
}
```

### 2. Numbered List Staggered Reveals
*Reference: `app/_components/sections/values.tsx`*

Entrance animations for lists should use a stagger to guide the eye.

```tsx
// Using Motion for simpler staggered entry
import { motion } from 'motion/react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export function Values() {
  return (
    <motion.div variants={container} initial="hidden" whileInView="show">
      {items.map(i => <motion.div variants={item} key={i.id} />)}
    </motion.div>
  )
}
```

### 3. Doubled-Text Hover
*Reference: `app/_components/sections/committees-teaser.tsx`*

For links, we often use a "doubled text" effect where the original text slides up and a gold version slides in from below.

```tsx
// CSS-driven for performance, or Motion for ease
<motion.span whileHover={{ y: -20 }}>
  <span className="block">Text</span>
  <span className="block text-gold">Text</span>
</motion.span>
```

### 4. Marquee Infinite Scroll
*Reference: `app/_components/sections/marquee.tsx`*

While currently handled via CSS keyframes for simplicity, complex marquees (pausing on hover, variable speed) should use GSAP.

```tsx
gsap.to(marqueeRef.current, {
  xPercent: -50,
  repeat: -1,
  duration: 20,
  ease: "none",
})
```

### 5. Count-up on Scroll
*Reference: `app/_components/sections/stats.tsx`*

Numbers should animate from 0 to their value only when they enter the viewport.

```tsx
const [count, setCount] = useState(0)
useEffect(() => {
  if (isInView) {
    gsap.to({ val: 0 }, {
      val: targetValue,
      duration: 2,
      onUpdate: function() { setCount(Math.floor(this.targets()[0].val)) }
    })
  }
}, [isInView])
```

---

## Reduced-Motion Contract

Every animated component **MUST** honor the user's system preference for reduced motion.

```tsx
'use client'
import { useReducedMotion } from 'motion/react'

export function AnimatedComponent() {
  const prefersReduced = useReducedMotion()

  if (prefersReduced) {
    return <StaticFallback /> // Or a simplified version with only opacity fades
  }

  return <ComplexAnimation />
}
```

---

## Performance Best Practices

1.  **GPU Acceleration**: Only animate `transform` (translate, scale, rotate) and `opacity`.
2.  **Layout Thrashes**: Avoid animating `width`, `height`, `top`, `left`, or `margin`. These force the browser to recalculate the layout of the entire page.
3.  **Will-Change**: Use `will-change: transform` sparingly on elements with heavy animations to hint to the browser to promote them to their own layer.

## Future Contributors

When adding a new animation:
1.  **Categorize**: Is it scroll-linked or a timeline? Use GSAP. Is it a UI micro-interaction? Use Motion.
2.  **Check the Catalog**: Does a similar pattern already exist?
3.  **Test Accessibility**: Ensure it feels natural with `Lenis` and respects `prefers-reduced-motion`.
