"use client";

/**
 * LoveCouponsDesktop Component
 * Desktop layout — centered list of ticket-style coupons
 */

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import type { CouponsViewProps } from "../types";
import { useCoupons } from "../hooks/useCoupons";
import { CouponCard } from "../components";
import { FooterBranding, BackToGallery } from "@/components/templates/components";

export function LoveCouponsDesktop({ data }: CouponsViewProps) {
  const { coupons, handleRedeem, handleReset } = useCoupons(data.coupons);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-6 relative">
      {/* Back to Gallery */}
      <BackToGallery className="absolute top-4 right-4 z-20" />

      <div className="max-w-xl mx-auto">
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

        {/* Coupons List */}
        <div className="space-y-4">
          {coupons.map((coupon, index) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              index={index}
              onRedeem={handleRedeem}
            />
          ))}
        </div>

        {/* Reset/Replay Button */}
        {coupons.some((c) => c.isRedeemed) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-hebrew-body"
              aria-label="איפוס כל הקופונים"
            >
              <RotateCcw size={16} />
              <span>איפוס הכל</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-4 left-1/2 -translate-x-1/2" />
    </div>
  );
}
