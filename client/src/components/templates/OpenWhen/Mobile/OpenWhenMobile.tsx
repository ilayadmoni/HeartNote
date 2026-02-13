"use client";

/**
 * OpenWhenMobile Component
 * 2-column grid of envelope cards, optimised for small screens
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { OpenWhenViewProps, OpenWhenEnvelope } from "../types";
import { EnvelopeCard, LetterModal, FloatingIcons } from "../components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

export function OpenWhenMobile({ data }: OpenWhenViewProps) {
  const [selectedEnvelope, setSelectedEnvelope] =
    useState<OpenWhenEnvelope | null>(null);
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  const handleOpen = useCallback((envelope: OpenWhenEnvelope) => {
    setSelectedEnvelope(envelope);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedEnvelope(null);
  }, []);

  return (
    <div className="min-h-[420px] bg-[#faf7f5] dark:bg-gray-900 py-8 px-4 relative">
      <FloatingIcons />

      <div className="max-w-md mx-auto relative z-10">
        <BackToGallery className="mb-3" />

        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center text-[#2e3c52] dark:text-white mb-6 text-hebrew-heading"
          >
            {data.title}
          </motion.h1>
        )}

        {/* Envelopes Grid — 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-3">
          {data.envelopes.map((envelope, index) => (
            <EnvelopeCard
              key={envelope.id}
              envelope={envelope}
              index={index}
              onOpen={handleOpen}
              primaryColor={primaryColor}
            />
          ))}
        </div>
      </div>

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10" />

      {/* Letter Modal */}
      <LetterModal
        envelope={selectedEnvelope}
        onClose={handleClose}
        primaryColor={primaryColor}
      />
    </div>
  );
}
