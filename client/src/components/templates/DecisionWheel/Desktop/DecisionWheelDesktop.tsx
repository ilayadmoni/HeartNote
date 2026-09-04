"use client";

/**
 * DecisionWheelDesktop Component
 * Desktop layout — centered wheel with decorative background
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { DecisionWheelViewProps } from "../types";
import { WheelCanvas } from "../components";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";


export function DecisionWheelDesktop({ data }: DecisionWheelViewProps) {
  const t = useTranslations("templates");
  const options =
    data.options?.length >= 2
      ? data.options
      : [t("decisionWheel.optionDefault1"), t("decisionWheel.optionDefault2")];

  return (
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate">
      <FloatingIcons/>
      <BackToGallery className="top-4 end-4 absolute" />
      {/* Decorative blobs */}
      <div className="absolute top-10 start-10 w-40 h-40 bg-accent-soft/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 end-10 w-56 h-56 bg-accent-soft/40 rounded-full blur-3xl pointer-events-none" />

      {/* Content Area */}
      <div className="flex-1 flex flex-col items-center w-full max-w-md mx-auto px-6 py-8">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-display-md font-bold text-center mb-3"
            style={{ color: data.primaryColor || "rgb(var(--ink))" }}
            dir="auto"
          >
            {data.title}
          </motion.h1>
        )}

        {/* Subtitle */}
        {data.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-base text-ink-muted text-center mb-8" dir="auto"
          >
            {data.subtitle}
          </motion.p>
        )}

        {/* Wheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          <WheelCanvas
            options={options}
            size={340}
            primaryColor={data.primaryColor}
            noTakeBacksText={data.noTakeBacksText}
          />
        </motion.div>
      </div>

      {/* Footer Credit */}
      <FooterBranding className="shrink-0 pb-4" />
    </div>
  );
}
