"use client";

/**
 * Shared Framer Motion primitives so every screen moves the same way.
 * Ease-out quint for entrances, short springs for presses, and a single
 * `useMotionOk` gate that respects the a11y toggle and prefers-reduced-motion.
 */

import { useReducedMotion, type Transition, type Variants } from "framer-motion";
import { useAccessibility } from "@/components/accessibility";

export const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATION = {
  fast: 0.16,
  base: 0.32,
  slow: 0.55,
} as const;

export const transitions = {
  enter: { duration: DURATION.slow, ease: EASE_OUT_QUINT } satisfies Transition,
  fast: { duration: DURATION.fast, ease: EASE_OUT_QUINT } satisfies Transition,
  spring: { type: "spring", stiffness: 420, damping: 30, mass: 0.6 } satisfies Transition,
};

/** Fade + rise entrance. Use with `initial="hidden" animate="visible"`. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: transitions.enter },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.enter },
};

/** Parent wrapper that staggers `fadeUp` children. */
export const stagger = (gap = 0.07, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

/** Tactile press feedback for CTAs and cards. */
export const pressable = {
  whileHover: { y: -2 },
  whileTap: { scale: 0.98, y: 0 },
  transition: transitions.spring,
} as const;

export const viewportOnce = { once: true, amount: 0.25 } as const;

/**
 * True when motion should play: user hasn't stopped animations in the
 * accessibility widget and the OS doesn't request reduced motion.
 */
export function useMotionOk(): boolean {
  const { settings } = useAccessibility();
  const reduced = useReducedMotion();
  return !settings.stopAnimations && !reduced;
}
