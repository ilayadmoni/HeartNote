"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

/** Perforated dots between body and stub — dots pop/fade to sell the tear on redeem */
export function PerforatedEdge({
  primaryColor,
  isRedeemed,
}: {
  primaryColor?: string;
  isRedeemed?: boolean;
}) {
  return (
    <div
      className="relative w-4 flex flex-col items-center justify-around py-2 bg-ink"
      style={primaryColor ? { backgroundColor: primaryColor } : undefined}
    >
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-surface"
          animate={isRedeemed ? { scale: 1.25 } : { scale: 1 }}
          transition={{ delay: 0.3 + i * 0.03, duration: 0.25 }}
        />
      ))}
    </div>
  );
}

/** Redeemed stamp overlay - centered on coupon */
export function RedeemedStamp() {
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
