"use client";

/**
 * OpenWhenDesktop Component
 * 3-column grid of envelope cards with floating background icons
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { OpenWhenViewProps, OpenWhenEnvelope } from "../types";
import { EnvelopeCard, LetterModal, FloatingIcons } from "../components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { FooterBranding, BackToGallery } from "@/components/templates/components";

export function OpenWhenDesktop({ data }: OpenWhenViewProps) {
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
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-12 px-6 relative">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-4 right-4 z-20" />

      <FloatingIcons />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-[#2e3c52] dark:text-white mb-10 text-hebrew-heading"
          >
            {data.title}
          </motion.h1>
        )}

        {/* Envelopes Grid — 3 columns on desktop */}
        <div className="grid grid-cols-3 gap-5">
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
      <FooterBranding className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10" />

      {/* Letter Modal */}
      <LetterModal
        envelope={selectedEnvelope}
        onClose={handleClose}
        primaryColor={primaryColor}
      />
    </div>
  );
}
