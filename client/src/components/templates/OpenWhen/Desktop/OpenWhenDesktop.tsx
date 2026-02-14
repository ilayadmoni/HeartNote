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
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";

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
    <div className="flex flex-col min-h-[390px] bg-[#faf7f5] dark:bg-gray-900 relative">
      <FloatingIcons />
      <BackToGallery className="top-4 right-4 absolute" />

      <div className="flex-1 w-full max-w-md mx-auto relative z-10 px-6 py-8">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center dark:text-white mb-10 text-hebrew-heading"
            style={{ color: primaryColor }}
          >
            {data.title}
          </motion.h1>
        )}

        {/* Envelopes Grid — 3 columns on desktop */}
        <div className="grid grid-cols-3 gap-5 w-full">
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
      <FooterBranding className="shrink-0 pb-4 z-10" />

      {/* Letter Modal */}
      <LetterModal
        envelope={selectedEnvelope}
        onClose={handleClose}
        primaryColor={primaryColor}
      />
    </div>
  );
}
