"use client";

/**
 * LoveCouponsDesktop Component
 * Desktop layout — centered list of ticket-style coupons
 */

import { motion } from "framer-motion";
import type { CouponsViewProps } from "../types";
import { useCoupons } from "../hooks/useCoupons";
import { CouponCard } from "../components";
import { FooterBranding } from "@/components/templates/components";

export function LoveCouponsDesktop({ data }: CouponsViewProps) {
  const { coupons, handleRedeem } = useCoupons(data.coupons);

  return (
    <div className="min-h-screen bg-[#1e2633] dark:bg-gray-900 py-12 px-6 relative">
      <div className="max-w-xl mx-auto">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-white mb-10 text-hebrew-heading"
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
      </div>

      {/* Footer Credit */}
      <FooterBranding className="absolute bottom-4 left-1/2 -translate-x-1/2" />
    </div>
  );
}
