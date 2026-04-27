"use client";

/**
 * GalleryLoadingGate — Full-Screen Loading Guard
 * Displays the HeartNote loader while templates are fetching,
 * then smoothly transitions to gallery content.
 */

import { AnimatePresence, motion } from "framer-motion";
import Loading from "@/app/(main)/loading";
import type { ReactNode } from "react";

interface GalleryLoadingGateProps {
  isLoading: boolean;
  children: ReactNode;
}

export function GalleryLoadingGate({
  isLoading,
  children,
}: GalleryLoadingGateProps) {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Loading />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
