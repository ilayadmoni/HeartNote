"use client";

/**
 * CouponCard Component
 * Ticket-style coupon with perforated edge, redeem button, and stamp overlay
 */

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { LoveCoupon } from "../types";
import { getCouponColorClasses } from "../constants";
import { PerforatedEdge, RedeemedStamp } from "./CouponCardParts";

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
  const locale = useLocale();
  const isRtl = locale === "he";
  const bgClass = getCouponColorClasses(coupon.color, index);

  return (
    <motion.div
      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex ${coupon.isRedeemed ? "opacity-60" : ""}`}
    >
      {/* Main Coupon Body */}
      <div
        className={`flex-1 ${bgClass} rounded-s-card p-4 relative overflow-hidden ${
          coupon.isRedeemed ? "grayscale" : ""
        }`}
      >
        {/* Redeem Button */}
        <div className="absolute start-4 top-1/2 -translate-y-1/2 z-[1]">
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
        <div className="text-end pe-2 ps-28 min-w-0">
          {coupon.icon && (
            <span className="text-2xl mb-1 block opacity-40">
              {coupon.icon}
            </span>
          )}
          <h3
            className="text-lg font-bold text-ink break-words" dir="auto"
            style={primaryColor ? { color: primaryColor } : undefined}
          >
            {coupon.title}
          </h3>
          {coupon.description && (
            <p className="text-xs text-ink-muted mt-0.5 break-words" dir="auto">
              {coupon.description}
            </p>
          )}
        </div>
      </div>

      {/* Perforated Edge */}
      <PerforatedEdge primaryColor={primaryColor} isRedeemed={coupon.isRedeemed} />

      {/* COUPON Stub */}
      <motion.div
        className="w-10 bg-ink rounded-e-card flex items-center justify-center"
        style={primaryColor ? { backgroundColor: primaryColor } : undefined}
        animate={
          coupon.isRedeemed
            ? { x: isRtl ? -6 : 6, rotate: isRtl ? -3 : 3, opacity: 0.5 }
            : { x: 0, rotate: 0, opacity: 1 }
        }
        transition={{ delay: 0.35, duration: 0.3, ease: "easeOut" }}
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
      </motion.div>

      {/* Redeemed Stamp Overlay */}
      {coupon.isRedeemed && <RedeemedStamp />}
    </motion.div>
  );
}
