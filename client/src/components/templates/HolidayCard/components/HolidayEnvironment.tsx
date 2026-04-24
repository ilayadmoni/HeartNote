"use client";

import { AnimatePresence, motion } from "framer-motion";
import { HOLIDAY_PRESETS } from "../constants/holidays";
import { HOLIDAY_REGISTRY } from "../holidays/registry";
import { GlassCard } from "./GlassCard";
import type { HolidayCardData } from "../../types";
import type { HolidayVariant } from "../holidays/types";

interface HolidayEnvironmentProps {
  data: HolidayCardData;
  primaryColor: string;
  variant: HolidayVariant;
}

export function HolidayEnvironment({
  data,
  primaryColor,
  variant,
}: HolidayEnvironmentProps) {
  const preset = HOLIDAY_PRESETS[data.holidayKind];
  const theme = HOLIDAY_REGISTRY[data.holidayKind];
  const Decorations = theme.Decorations;

  const title = data.customTitle || preset.defaultTitle;
  const greeting = data.customGreeting || preset.defaultGreeting;

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-3xl overflow-hidden">
      {/* Animated scene swaps when holidayKind changes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={data.holidayKind}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Decorations variant={variant} />
        </motion.div>
      </AnimatePresence>

      {/* Message card */}
      <div className="relative w-full h-full flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={data.holidayKind}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <GlassCard
              title={title}
              greeting={greeting}
              theme={theme}
              primaryColor={primaryColor}
              variant={variant}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
