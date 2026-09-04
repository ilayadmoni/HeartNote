"use client";

/**
 * DecisionWheelMobile Component
 * Mobile layout — compact wheel with stacked layout
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import type { DecisionWheelViewProps } from "../types";
import { WheelCanvas } from "../components";

import {
  FooterBranding,
} from "@/components/templates/components";
import { FloatingIcons } from "../../OpenWhen/components";

export function DecisionWheelMobile({ data }: DecisionWheelViewProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes('/create/');
  const t = useTranslations("templates");
  const options =
    data.options?.length >= 2
      ? data.options
      : [t("decisionWheel.optionDefault1"), t("decisionWheel.optionDefault2")];

  return (
    <div className={`bg-transparent px-4 relative isolate overflow-hidden flex flex-col justify-between items-center gap-6 py-6 ${
      isCreateRoute ? 'min-h-[450px]' : 'min-h-[100dvh]'
    }`}>
      <FloatingIcons />
      {/* Decorative blobs */}
      <div className="absolute top-5 start-0 w-28 h-28 bg-accent-soft/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 end-0 w-36 h-36 bg-accent-soft/40 rounded-full blur-2xl pointer-events-none" />

      {/* Main Content - Top */}
      <div className="flex-1 max-w-sm mx-auto flex flex-col items-center justify-center w-full">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-title-lg font-bold text-center mb-2"
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
            className="text-sm text-ink-muted text-center mb-6" dir="auto"
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
            size={280}
            primaryColor={data.primaryColor}
            noTakeBacksText={data.noTakeBacksText}
          />
        </motion.div>
      </div>

      {/* Branding - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}
