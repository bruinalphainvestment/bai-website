'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useInView, animate, type UseInViewOptions } from 'motion/react';

const easeOutQuart = [0.165, 0.84, 0.44, 1] as const;
const defaultDuration = 0.6;
const defaultStagger = 0.08;
const viewportSettings: UseInViewOptions = { once: true, margin: '-80px' };

type Tag = 'div' | 'section' | 'ul' | 'li' | 'span' | 'article';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  trigger?: 'scroll' | 'mount';
  as?: Tag;
}

// Static lookup map so component references are stable across renders.
// (Calling motion.{tag} inside the component body returns a new component
// reference each render, which trips `react-hooks/static-components` and
// resets internal state on every re-render.)
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  ul: motion.ul,
  li: motion.li,
  span: motion.span,
  article: motion.article,
} as const satisfies Record<Tag, unknown>;

function pickMotionTag(tag: Tag = 'div') {
  return MOTION_TAGS[tag];
}

function pickStaticTag(tag: Tag = 'div'): React.ElementType {
  return tag;
}

export function FadeUp({ children, className, trigger = 'scroll', as = 'div' }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = pickStaticTag(as);
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = pickMotionTag(as);

  const motionProps =
    trigger === 'mount'
      ? {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: defaultDuration, ease: easeOutQuart },
        }
      : {
          initial: { opacity: 0, y: 16 },
          whileInView: { opacity: 1, y: 0 },
          viewport: viewportSettings,
          transition: { duration: defaultDuration, ease: easeOutQuart },
        };

  return (
    <MotionTag className={className} {...motionProps}>
      {children}
    </MotionTag>
  );
}

export function StaggerGroup({ children, className, trigger = 'scroll', as = 'div' }: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = pickStaticTag(as);
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = pickMotionTag(as);

  const variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: defaultStagger,
      },
    },
  };

  const motionProps =
    trigger === 'mount'
      ? {
          initial: 'hidden' as const,
          animate: 'visible' as const,
        }
      : {
          initial: 'hidden' as const,
          whileInView: 'visible' as const,
          viewport: viewportSettings,
        };

  return (
    <MotionTag className={className} variants={variants} {...motionProps}>
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  as?: Tag;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    const Tag = pickStaticTag(as);
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = pickMotionTag(as);

  const variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: defaultDuration, ease: easeOutQuart },
    },
  };

  return (
    <MotionTag className={className} variants={variants}>
      {children}
    </MotionTag>
  );
}

export function CountUp({ value, className }: { value: string | number; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, viewportSettings);

  const stringValue = value.toString();
  const match = stringValue.match(/^([+-]?\d+(?:\.\d+)?)(.*)$/);
  const isAnimatable = match !== null;

  useEffect(() => {
    if (shouldReduceMotion || !isAnimatable || !isInView || !ref.current || !match?.[1]) return;

    const targetNumber = parseFloat(match[1]);
    const suffix = match[2] ?? '';

    const controls = animate(0, targetNumber, {
      duration: 1.5,
      ease: easeOutQuart,
      onUpdate: (latest) => {
        if (ref.current) {
          const isInteger = targetNumber % 1 === 0;
          const displayNum = isInteger ? Math.round(latest) : latest.toFixed(1);
          ref.current.textContent = displayNum + suffix;
        }
      },
    });

    return () => controls.stop();
  }, [isInView, isAnimatable, match, shouldReduceMotion]);

  if (shouldReduceMotion || !isAnimatable) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={className}>
      {match ? '0' + (match[2] || '') : value}
    </span>
  );
}
