/**
 * Shared Framer Motion transition vocabulary for templates.
 * Additive only — importing these is opt-in per template; nothing here is wired
 * into any existing component. A template that never imports this file behaves
 * exactly as before.
 */

export const ENTER = { duration: 0.42, ease: [0.22, 1, 0.36, 1] } as const;

export const EXIT = { duration: 0.18, ease: "easeIn" } as const;

export const REVEAL = { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.1 } as const;

export const TAP = { type: "spring", stiffness: 400, damping: 22 } as const;

export const PLAYFUL = { type: "spring", stiffness: 300, damping: 14, mass: 0.8 } as const;

export const SNAPPY = { type: "spring", stiffness: 700, damping: 18, mass: 0.4 } as const;

export const STAGGER_STEP = 0.07;
