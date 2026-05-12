"use client";

import { MotionConfig } from "framer-motion";
import { useReducedMotion } from "../AccessibilityProvider";

export function MotionGuard({ children }: { children: React.ReactNode }) {
  const shouldReduce = useReducedMotion();
  return (
    <MotionConfig reducedMotion={shouldReduce ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}
