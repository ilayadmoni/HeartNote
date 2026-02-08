"use client";

/**
 * LoveCoupons Component
 * Ticket-style redeemable coupons with perforated edge and COUPON stub
 */

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type {
  TemplateComponentProps,
  LoveCouponsData,
  LoveCoupon,
} from "./types";

// Alternating coupon background colors
const COUPON_COLORS = [
  "bg-emerald-100 dark:bg-emerald-900/30",
  "bg-sky-100 dark:bg-sky-900/30",
  "bg-amber-100 dark:bg-amber-900/30",
  "bg-rose-100 dark:bg-rose-900/30",
  "bg-violet-100 dark:bg-violet-900/30",
];

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
    <div className="min-h-screen bg-[#1e2633] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Title */}
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-center text-white mb-8 text-hebrew-heading"
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
              colorClass={COUPON_COLORS[index % COUPON_COLORS.length]}
              onRedeem={handleRedeem}
            />
          ))}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500">
          Created using <span className="font-bold">HeartNote</span> 💖
        </p>
      </div>
    </div>
  );
}

interface CouponCardProps {
  coupon: LoveCoupon;
  index: number;
  colorClass: string;
  onRedeem: (id: string) => void;
}

function CouponCard({ coupon, index, colorClass, onRedeem }: CouponCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex ${coupon.isRedeemed ? "opacity-60" : ""}`}
    >
      {/* Main Coupon Body */}
      <div
        className={`flex-1 ${colorClass} rounded-l-xl p-4 relative ${
          coupon.isRedeemed ? "grayscale" : ""
        }`}
      >
        {/* Redeem Button */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          {!coupon.isRedeemed ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRedeem(coupon.id)}
              className="px-4 py-1.5 bg-white text-[#2e3c52] text-sm font-bold rounded-md border border-gray-200 shadow-sm hover:shadow transition-shadow text-hebrew-heading"
            >
              ממש
            </motion.button>
          ) : (
            <div className="px-4 py-1.5 bg-gray-200 text-gray-500 text-sm font-bold rounded-md border-2 border-dashed border-gray-400 text-hebrew-heading -rotate-6">
              מומש
            </div>
          )}
        </div>

        {/* Content - Right aligned for RTL */}
        <div className="text-right pr-2 pl-24">
          <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading">
            {coupon.title}
          </h3>
          {coupon.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-hebrew-body">
              {coupon.description}
            </p>
          )}
        </div>
      </div>

      {/* Perforated Edge - Dots */}
      <div className="relative w-4 flex flex-col items-center justify-around py-2 bg-[#2e3c52] dark:bg-gray-700">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-[#1e2633] dark:bg-gray-900"
          />
        ))}
      </div>

      {/* COUPON Stub */}
      <div className="w-10 bg-[#2e3c52] dark:bg-gray-700 rounded-r-xl flex items-center justify-center">
        <span
          className="text-[10px] font-bold text-gray-400 tracking-wider"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          COUPON
        </span>
      </div>

      {/* Redeemed Stamp Overlay */}
      {coupon.isRedeemed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
          animate={{ opacity: 1, scale: 1, rotate: -12 }}
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="px-5 py-1.5 border-4 border-red-600/60 rounded-lg bg-white/20">
            <span className="text-xl font-black text-red-600/80 text-hebrew-heading">
              מומש
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
