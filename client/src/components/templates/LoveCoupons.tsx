"use client";

/**
 * LoveCoupons Component
 * Ticket-style redeemable coupons with perforated edge design
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type {
  TemplateComponentProps,
  LoveCouponsData,
  LoveCoupon,
} from "./types";

export function LoveCoupons({ data }: TemplateComponentProps<LoveCouponsData>) {
  const [coupons, setCoupons] = useState<LoveCoupon[]>(data.coupons);

  const handleRedeem = useCallback((couponId: string) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === couponId
          ? {
              ...coupon,
              isRedeemed: true,
              redeemedAt: new Date().toISOString(),
            }
          : coupon,
      ),
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#faf7f5] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
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

        {/* Coupons Grid */}
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
    </div>
  );
}

interface CouponCardProps {
  coupon: LoveCoupon;
  index: number;
  onRedeem: (id: string) => void;
}

function CouponCard({ coupon, index, onRedeem }: CouponCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative ${coupon.isRedeemed ? "grayscale" : ""}`}
    >
      {/* Coupon Container with perforated edges */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        style={{
          // Perforated edge effect using radial gradient
          background: coupon.isRedeemed
            ? undefined
            : `radial-gradient(circle at 0 50%, transparent 8px, white 8px) left,
               radial-gradient(circle at 100% 50%, transparent 8px, white 8px) right`,
          backgroundSize: "12px 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex">
          {/* Left Section - Icon */}
          <div className="w-20 bg-gradient-to-br from-[#d4826f] to-[#e8917a] flex items-center justify-center">
            <span className="text-3xl">{coupon.icon || "🎁"}</span>
          </div>

          {/* Perforated Divider */}
          <div className="w-px border-r-2 border-dashed border-gray-200 dark:border-gray-600" />

          {/* Right Section - Content */}
          <div className="flex-1 p-4">
            <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
              {coupon.title}
            </h3>
            {coupon.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-hebrew-body">
                {coupon.description}
              </p>
            )}

            {/* Redeem Button or Status */}
            {!coupon.isRedeemed ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onRedeem(coupon.id)}
                className="mt-3 px-4 py-1.5 bg-[#d4826f] hover:bg-[#c4735f] text-white text-sm font-bold rounded-full transition-colors text-hebrew-heading"
              >
                מימוש
              </motion.button>
            ) : (
              <span className="inline-block mt-3 px-3 py-1 text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 rounded-full text-hebrew-body">
                מומש ✓
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Redeemed Stamp Overlay */}
      {coupon.isRedeemed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="px-6 py-2 border-4 border-red-500/70 rounded-lg">
            <span className="text-2xl font-black text-red-500/70 text-hebrew-heading">
              מומש
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
