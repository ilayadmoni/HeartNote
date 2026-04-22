"use client";

/**
 * OpenWhenMobile Component
 * 2-column grid of envelope cards, optimised for small screens
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { OpenWhenViewProps, OpenWhenEnvelope } from "../types";
import { EnvelopeCard, LetterModal, FloatingIcons } from "../components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import {
  FooterBranding,
} from "@/components/templates/components";

export function OpenWhenMobile({ data }: OpenWhenViewProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');
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
    <div className={`bg-transparent py-8 px-4 relative isolate flex flex-col justify-between items-center ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[650px]'
    }`}>
      <FloatingIcons />

      <div className="flex-1 max-w-md mx-auto relative z-10 flex flex-col justify-center items-center">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center dark:text-white mb-6 text-hebrew-heading"
            style={{ color: primaryColor }}
          >
            {data.title}
          </motion.h1>
        )}

        {/* Envelopes Grid — 2 columns on mobile */}
        <div className="grid grid-cols-2 gap-4">
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
      <FooterBranding className="mt-6 shrink-0 z-10" />

      {/* Letter Modal */}
      <LetterModal
        envelope={selectedEnvelope}
        onClose={handleClose}
        primaryColor={primaryColor}
      />
    </div>
  );
}
