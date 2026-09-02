"use client";

/**
 * GalleryHeader Component
 * Hero section with animated title and subtitle for the gallery page
 */

import { motion } from "framer-motion";
import { fadeUp, transitions, useMotionOk } from "@/lib/motion";
import type { GalleryHeaderProps } from "../types";

export function GalleryHeader({ title, subtitle, className = "" }: GalleryHeaderProps): JSX.Element {
  const motionOk = useMotionOk();

  return (
    <div className={`text-center ${className}`}>
      <motion.div
        initial={motionOk ? "hidden" : false}
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-display-md text-ink mb-4">{title}</h1>
      </motion.div>

      <motion.p
        initial={motionOk ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ ...transitions.enter, delay: 0.15 }}
        className="text-body-lg text-ink-muted max-w-prose mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}
