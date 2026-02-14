"use client";

/**
 * LoveCouponsMobile Component
 * Mobile layout — full-width ticket-style coupons, compact spacing
 */

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { CouponsViewProps } from "../types";
import { useCoupons } from "../hooks/useCoupons";
import { CouponCard } from "../components";
import {
  FooterBranding,
  BackToGallery,
} from "@/components/templates/components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { FloatingIcons } from "../../OpenWhen/components";


export function LoveCouponsMobile({ data }: CouponsViewProps) {
  const { coupons, handleRedeem, handleReset } = useCoupons(data.coupons);
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  return (
    <div className="min-h-[420px] bg-[#faf7f5] dark:bg-gray-900 px-4 py-6 relative flex flex-col justify-between gap-6">
    <FloatingIcons />
      {/* Main Content - Top */}
      <div className="max-w-lg mx-auto w-full">
        <BackToGallery className="mb-3" />

        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center mb-6 text-hebrew-heading break-words max-w-[280px] mx-auto"
            style={{ color: primaryColor }}
          >
            {data.title}
          </motion.h1>
        )}

        {/* Coupons List */}
        <div className="space-y-3">
          {coupons.map((coupon, index) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              index={index}
              onRedeem={handleRedeem}
              primaryColor={primaryColor}
            />
          ))}
        </div>

        {/* Reset/Replay Button */}
        {coupons.some((c) => c.isRedeemed) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium text-hebrew-body"
              aria-label="איפוס כל הקופונים"
            >
              <RotateCcw size={14} />
              <span>איפוס הכל</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Footer Credit - Bottom */}
      <FooterBranding className="mx-auto" />
    </div>
  );
}
