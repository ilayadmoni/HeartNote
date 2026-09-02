"use client";

/**
 * CouponCard Component
 * Ticket-style coupon with perforated edge, redeem button, and stamp overlay
 */

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { LoveCoupon } from "../types";
import { getCouponColorClasses } from "../constants";

interface CouponCardProps {
  coupon: LoveCoupon;
  index: number;
  onRedeem: (id: string) => void;
  primaryColor?: string;
}

export function CouponCard({
  coupon,
  index,
  onRedeem,
  primaryColor,
}: CouponCardProps) {
  const t = useTranslations("templates");
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
        className={`flex-1 ${bgClass} rounded-s-card p-4 relative ${
          coupon.isRedeemed ? "grayscale" : ""
        }`}
      >
        {/* Redeem Button */}
        <div className="absolute start-4 top-1/2 -translate-y-1/2">
          {!coupon.isRedeemed ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onRedeem(coupon.id)}
              className="px-4 py-1.5 bg-surface-raised text-ink text-sm font-bold rounded-control border border-line shadow-sm hover:shadow transition-shadow"
              aria-label={t("loveCoupons.redeemAria", { title: coupon.title })}
            >
              {t("loveCoupons.redeem")}
            </motion.button>
          ) : (
            <div className="px-4 py-1.5 bg-surface-sunken text-ink-subtle text-sm font-bold rounded-control border-2 border-dashed border-line-strong -rotate-6">
              {t("loveCoupons.redeemed")}
            </div>
          )}
        </div>

        {/* Content — Right aligned for RTL */}
        <div className="text-end pe-2 ps-24">
          {coupon.icon && (
            <span className="text-2xl mb-1 block opacity-40">
              {coupon.icon}
            </span>
          )}
          <h3
            className="text-lg font-bold text-ink break-words max-w-[200px]" dir="auto"
            style={primaryColor ? { color: primaryColor } : undefined}
          >
            {coupon.title}
          </h3>
          {coupon.description && (
            <p className="text-xs text-ink-muted mt-0.5 break-words max-w-[200px]" dir="auto">
              {coupon.description}
            </p>
          )}
        </div>
      </div>

      {/* Perforated Edge */}
      <PerforatedEdge primaryColor={primaryColor} />

      {/* COUPON Stub */}
      <div
        className="w-10 bg-ink rounded-e-card flex items-center justify-center"
        style={primaryColor ? { backgroundColor: primaryColor } : undefined}
      >
        <span
          className="text-[10px] font-bold tracking-wider"
          dir="ltr"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            color: "rgba(255,255,255,0.7)",
          }}
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
function PerforatedEdge({ primaryColor }: { primaryColor?: string }) {
  return (
    <div
      className="relative w-4 flex flex-col items-center justify-around py-2 bg-ink"
      style={primaryColor ? { backgroundColor: primaryColor } : undefined}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-surface"
        />
      ))}
    </div>
  );
}

/** Redeemed stamp overlay - centered on coupon */
function RedeemedStamp() {
  const t = useTranslations("templates");
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
      animate={{ opacity: 1, scale: 1, rotate: -8 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
    >
      <div className="px-6 py-2 border-4 border-red-500/70 rounded-control bg-surface-raised/30 backdrop-blur-[1px]">
        <span className="text-2xl font-black text-red-500/80">{t("loveCoupons.redeemed")}</span>
      </div>
    </motion.div>
  );
}
