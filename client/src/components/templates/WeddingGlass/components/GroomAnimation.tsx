"use client";

import { motion } from "framer-motion";

interface GroomAnimationProps {
  isStomping: boolean;
  tinted?: boolean;
}

const STOMP_TIMES = [0, 0.07, 0.5, 0.93, 1];
const STOMP_DURATION = 0.7;

export function GroomAnimation({ isStomping, tinted = false }: GroomAnimationProps) {
  const tilt   = isStomping ? [0, -2, 3, 1, 0]   : [0];
  const legY   = isStomping ? [0, -28, 18, 4, 0]  : [0];
  const legRot = isStomping ? [0, -22, 14, 2, 0]  : [0];
  const transition = { duration: STOMP_DURATION, times: STOMP_TIMES };

  return (
    // PLACEHOLDER: SVG replaced for WebKit crash isolation test
    <motion.div
      className="relative flex flex-col items-center justify-end"
      style={{ width: "100%", height: "100%", opacity: tinted ? 0.6 : 1 }}
      animate={{ rotate: tilt }}
      transition={transition}
    >
      {/* Body */}
      <div className="w-16 h-28 bg-blue-500 rounded-md mb-0" />
      {/* Animated leg */}
      <motion.div
        className="w-8 h-12 bg-blue-700 rounded-sm absolute bottom-0 right-6"
        animate={{ y: legY, rotate: legRot }}
        transition={transition}
        style={{ transformOrigin: "top center" }}
      />
    </motion.div>
  );
}
