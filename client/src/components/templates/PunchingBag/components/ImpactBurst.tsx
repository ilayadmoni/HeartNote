"use client";

import { motion } from "framer-motion";

interface ImpactBurstProps {
  color?: string;
}

const SPARK_ANGLES = [-60, -30, 0, 30, 60];

export function ImpactBurst({ color = "#fbbf24" }: ImpactBurstProps) {
  return (
    <div
      className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
      aria-hidden="true"
    >
      <motion.span
        initial={{ scale: 0.3, opacity: 0.9 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2"
        style={{ borderColor: color }}
      />
      {SPARK_ANGLES.map((angle) => (
        <motion.span
          key={angle}
          initial={{ scale: 0.2, opacity: 1 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-1/2 start-1/2 w-6 h-0.5 rounded-full"
          style={{ backgroundColor: color, rotate: `${angle}deg`, transformOrigin: "0% 50%" }}
        />
      ))}
    </div>
  );
}
