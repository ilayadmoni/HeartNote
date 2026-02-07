"use client";

/**
 * OpenWhen Component
 * Grid of envelopes with modal letter reveal
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type {
  TemplateComponentProps,
  OpenWhenData,
  OpenWhenEnvelope,
} from "./types";

export function OpenWhen({ data }: TemplateComponentProps<OpenWhenData>) {
  const [selectedEnvelope, setSelectedEnvelope] =
    useState<OpenWhenEnvelope | null>(null);

  const handleOpen = useCallback((envelope: OpenWhenEnvelope) => {
    if (!envelope.isLocked) {
      setSelectedEnvelope(envelope);
    }
  }, []);

  const handleClose = useCallback(() => {
    setSelectedEnvelope(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-[#2e3c52] dark:text-white mb-8 text-hebrew-heading"
          >
            {data.title}
          </motion.h1>
        )}

        {/* Envelopes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {data.envelopes.map((envelope, index) => (
            <EnvelopeCard
              key={envelope.id}
              envelope={envelope}
              index={index}
              onOpen={handleOpen}
            />
          ))}
        </div>
      </div>

      {/* Letter Modal */}
      <LetterModal envelope={selectedEnvelope} onClose={handleClose} />
    </div>
  );
}

interface EnvelopeCardProps {
  envelope: OpenWhenEnvelope;
  index: number;
  onOpen: (envelope: OpenWhenEnvelope) => void;
}

function EnvelopeCard({ envelope, index, onOpen }: EnvelopeCardProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!envelope.isLocked ? { scale: 1.05, y: -5 } : undefined}
      whileTap={!envelope.isLocked ? { scale: 0.95 } : undefined}
      onClick={() => onOpen(envelope)}
      disabled={envelope.isLocked}
      className={`relative aspect-[4/3] rounded-xl overflow-hidden shadow-lg transition-all ${
        envelope.isLocked
          ? "opacity-60 cursor-not-allowed"
          : "cursor-pointer hover:shadow-xl"
      }`}
    >
      {/* Envelope Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f5e6d3] to-[#e8d4c0] dark:from-gray-700 dark:to-gray-800" />

      {/* Envelope Flap (Triangle) */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2"
        style={{
          background: "linear-gradient(135deg, #e8d4c0 50%, transparent 50%)",
          clipPath: "polygon(0 0, 100% 0, 50% 100%)",
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-end p-4 pt-12">
        {/* Emoji */}
        <span className="text-3xl mb-2">
          {envelope.isLocked ? "🔒" : envelope.emoji || "💌"}
        </span>

        {/* Title */}
        <p className="text-sm font-bold text-[#2e3c52] dark:text-white text-center text-hebrew-heading leading-tight">
          {envelope.title}
        </p>

        {/* Locked Overlay */}
        {envelope.isLocked && (
          <div className="absolute inset-0 bg-gray-500/20 backdrop-blur-[1px]" />
        )}
      </div>
    </motion.button>
  );
}

interface LetterModalProps {
  envelope: OpenWhenEnvelope | null;
  onClose: () => void;
}

function LetterModal({ envelope, onClose }: LetterModalProps) {
  return (
    <AnimatePresence>
      {envelope && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Letter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:max-h-[80vh] z-50 overflow-auto"
          >
            {/* Paper Effect */}
            <div
              className="bg-[#fffef8] dark:bg-gray-800 rounded-lg shadow-2xl p-6 md:p-8 min-h-[400px]"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(
                    transparent,
                    transparent 31px,
                    #e5e5e5 31px,
                    #e5e5e5 32px
                  )
                `,
                backgroundPosition: "0 24px",
              }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="סגור"
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-xl font-bold text-[#2e3c52] dark:text-white mb-2 text-hebrew-heading text-center">
                {envelope.emoji} {envelope.title}
              </h2>

              {/* Divider */}
              <div className="w-16 h-0.5 bg-[#d4826f] mx-auto mb-6" />

              {/* Letter Content */}
              <div
                className="text-[#2e3c52] dark:text-gray-200 text-lg leading-relaxed whitespace-pre-wrap text-hebrew-body"
                style={{
                  fontFamily: "'Segoe Script', 'Brush Script MT', cursive",
                }}
              >
                {envelope.content}
              </div>

              {/* Heart signature */}
              <div className="text-center mt-8 text-3xl">💕</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
