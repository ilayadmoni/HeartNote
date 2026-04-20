"use client";

import { motion } from "framer-motion";
import type { SVGProps } from "react";

interface GroomFigureProps extends SVGProps<SVGSVGElement> {
  isAnimating?: boolean;
}

export function GroomFigure({ isAnimating = false, ...props }: GroomFigureProps) {
  const stompKeyframes = {
    initial: { rotate: 0 },
    stomp: {
      rotate: [0, -35, -35, 5, 0],
      y: [0, -10, -10, 5, 0],
    },
  };

  return (
    <svg viewBox="0 0 150 250" className="w-full h-full overflow-visible" {...props}>
      {/* Static Left Leg */}
      <path d="M 60,140 L 60,230 L 75,230 L 75,140 Z" fill="#1b263b" />
      <path d="M 60,230 C 50,230 45,235 45,240 L 75,240 C 75,235 75,230 60,230 Z" fill="#000" />

      {/* Animated Right Leg (Stomps) */}
      <motion.g
        style={{ transformOrigin: "85px 140px" }}
        initial="initial"
        animate={isAnimating ? "stomp" : "initial"}
        variants={stompKeyframes}
        transition={{
          duration: 1.2,
          ease: "easeInOut",
        }}
      >
        <path d="M 80,140 L 80,230 L 95,230 L 95,140 Z" fill="#1b263b" />
        <path d="M 80,230 C 80,225 105,225 110,240 L 80,240 Z" fill="#000" />
      </motion.g>

      {/* Groom Body & Suit */}
      <path d="M 50,65 Q 40,140 55,150 L 95,150 Q 110,140 100,65 Z" fill="#1b263b" />
      <path d="M 60,65 L 75,110 L 90,65 Z" fill="#fffcfa" />
      <path d="M 75,75 L 70,95 L 80,95 Z" fill="#000" />
      <path d="M 85,85 L 95,85 L 90,95 Z" fill="#fffcfa" />

      {/* Groom Head */}
      <circle cx="75" cy="35" r="22" fill="#f2e9e4" />
      <path d="M 53,25 Q 75,-5 97,25 Q 95,40 85,35 Q 75,30 65,35 Q 55,40 53,25 Z" fill="#415a77" />

      {/* Face */}
      <circle cx="68" cy="33" r="2" fill="#1b263b" />
      <circle cx="82" cy="33" r="2" fill="#1b263b" />
      <path
        d="M 70,43 Q 75,48 80,43"
        fill="none"
        stroke="#cb8e7c"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
