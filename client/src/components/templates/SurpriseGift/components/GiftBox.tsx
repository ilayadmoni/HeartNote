"use client";

/**
 * GiftBox SVG Component
 * Animated gift box with lid that flies off on open.
 * Shake animation is driven by parent via framer-motion.
 */

import { motion, type Variants } from "framer-motion";

interface GiftBoxProps {
  boxColor: string;
  ribbonColor: string;
  isOpen: boolean;
  size?: number;
}

const lidVariants: Variants = {
  closed: { y: 0, rotate: 0, opacity: 1 },
  open: {
    y: -160,
    x: 40,
    rotate: -35,
    opacity: 0,
    transition: { type: "spring", stiffness: 300, damping: 12, mass: 0.8 },
  },
};

export function GiftBox({
  boxColor,
  ribbonColor,
  isOpen,
  size = 200,
}: GiftBoxProps) {
  const half = size / 2;

  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={size * 1.1}
      className="select-none"
      aria-hidden="true"
    >
      {/* Box body */}
      <rect
        x="20"
        y="100"
        width="160"
        height="110"
        rx="8"
        fill={boxColor}
        stroke={boxColor}
        strokeWidth="2"
      />

      {/* Vertical ribbon on body */}
      <rect x={half - 12} y="100" width="24" height="110" fill={ribbonColor} />

      {/* Lid group — animates off */}
      <motion.g
        variants={lidVariants}
        animate={isOpen ? "open" : "closed"}
        style={{ originX: `${half}px`, originY: "100px" }}
      >
        {/* Lid rectangle */}
        <rect
          x="10"
          y="80"
          width="180"
          height="30"
          rx="6"
          fill={boxColor}
          stroke={boxColor}
          strokeWidth="2"
        />

        {/* Horizontal ribbon on lid */}
        <rect x={half - 12} y="80" width="24" height="30" fill={ribbonColor} />

        {/* Bow — two loops + knot */}
        <ellipse cx={half - 18} cy="78" rx="18" ry="14" fill={ribbonColor} />
        <ellipse cx={half + 18} cy="78" rx="18" ry="14" fill={ribbonColor} />
        <circle cx={half} cy="80" r="8" fill={ribbonColor} />
      </motion.g>
    </svg>
  );
}
