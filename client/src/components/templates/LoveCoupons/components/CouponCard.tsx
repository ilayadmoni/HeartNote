"use client";

/**
 * CouponCard Component
 * Ticket-style coupon with perforated edge, redeem button, and stamp overlay
 */

import { motion } from "framer-motion";
import type { LoveCoupon } from "../types";
import { getCouponColorClasses } from "../constants";

interface CouponCardProps {
  coupon: LoveCoupon;
  index: number;
  onRedeem: (id: string) => void;
}

export function CouponCard({ coupon, index, onRedeem }: CouponCardProps) {
  const bgClass = getCouponColorClasses(coupon.color, index);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex ${coupon.isRedeemed ? "opacity-60" : ""}`}
    >
      {/* Main Coupon Body */}
      <div
        className={`flex-1 ${bgClass} rounded-l-xl p-4 relative ${
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
              aria-label={`ממש קופון: ${coupon.title}`}
            >
              ממש
            </motion.button>
          ) : (
            <div className="px-4 py-1.5 bg-gray-200 text-gray-500 text-sm font-bold rounded-md border-2 border-dashed border-gray-400 text-hebrew-heading -rotate-6">
              מומש
            </div>
          )}
        </div>

        {/* Content — Right aligned for RTL */}
        <div className="text-right pr-2 pl-24">
          {coupon.icon && (
            <span className="text-2xl mb-1 block opacity-40">
              {coupon.icon}
            </span>
          )}
          <h3 className="text-lg font-bold text-[#2e3c52] dark:text-white text-hebrew-heading break-words max-w-[200px]">
            {coupon.title}
          </h3>
          {coupon.description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-hebrew-body break-words max-w-[200px]">
              {coupon.description}
            </p>
          )}
        </div>
      </div>

      {/* Perforated Edge */}
      <PerforatedEdge />

      {/* COUPON Stub */}
      <div className="w-10 bg-[#2e3c52] dark:bg-gray-700 rounded-r-xl flex items-center justify-center">
        <span
          className="text-[10px] font-bold text-gray-400 tracking-wider text-english-heading"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          COUPON
        </span>
      </div>

      {/* Redeemed Stamp Overlay */}
      {coupon.isRedeemed && <RedeemedStamp />}
    </motion.div>
  );
}

/** Perforated dots between body and stub */
function PerforatedEdge() {
  return (
    <div className="relative w-4 flex flex-col items-center justify-around py-2 bg-[#2e3c52] dark:bg-gray-700">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-white dark:bg-gray-900"
        />
      ))}
    </div>
  );
}

/** "מומש" stamp overlay - centered on coupon */
function RedeemedStamp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: -8 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
    >
      <div className="px-6 py-2 border-4 border-red-500/70 rounded-lg bg-white/30 dark:bg-black/20 backdrop-blur-[1px]">
        <span className="text-2xl font-black text-red-500/80 text-hebrew-heading">
          מומש
        </span>
      </div>
    </motion.div>
  );
}
