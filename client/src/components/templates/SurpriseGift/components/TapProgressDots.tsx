"use client";

import { motion } from "framer-motion";

interface TapProgressDotsProps {
  clicks: number;
  needed: number;
  primaryColor: string;
  className?: string;
}

export function TapProgressDots({ clicks, needed, primaryColor, className = "" }: TapProgressDotsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-hidden="true">
      {Array.from({ length: needed }).map((_, i) => (
        <motion.span
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          animate={{
            backgroundColor: i < clicks ? primaryColor : `${primaryColor}33`,
            scale: i < clicks ? 1.15 : 1,
          }}
          transition={{ duration: 0.25 }}
        />
      ))}
    </div>
  );
}
