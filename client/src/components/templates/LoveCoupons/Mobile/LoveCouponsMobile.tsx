"use client";

/**
 * LoveCouponsMobile Component
 * Mobile layout — full-width ticket-style coupons, compact spacing
 */

import { motion } from "framer-motion";
import type { CouponsViewProps } from "../types";
import { useCoupons } from "../hooks/useCoupons";
import { CouponCard } from "../components";
import { FooterBranding } from "@/components/templates/components";

export function LoveCouponsMobile({ data }: CouponsViewProps) {
  const { coupons, handleRedeem } = useCoupons(data.coupons);

  return (
    <div className="min-h-screen bg-[#1e2633] dark:bg-gray-900 py-8 px-4 relative">
      <div className="max-w-lg mx-auto">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center text-white mb-6 text-hebrew-heading"
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
            />
          ))}
        </div>
      </div>

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-3 left-1/2 -translate-x-1/2" />
    </div>
  );
}
