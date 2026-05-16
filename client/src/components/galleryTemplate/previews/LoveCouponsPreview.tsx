"use client";

import { motion } from "framer-motion";

const COUPONS = [
  { emoji: "💆", label: "עיסוי רומנטי", redeemed: false },
  { emoji: "🍽️", label: "ארוחה רומנטית", redeemed: true },
  { emoji: "🎬", label: "סרט ביחד", redeemed: false },
];

export function LoveCouponsPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-2">
      <div className="flex flex-col gap-1 w-full max-w-[110px]">
        {COUPONS.map((coupon, i) => (
          <motion.div
            key={i}
            initial={{ x: -8, opacity: 0 }}
            animate={{ x: 0, opacity: coupon.redeemed ? 0.5 : 1 }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border-2 border-dashed ${
              coupon.redeemed
                ? "border-stone-300 bg-stone-100 dark:bg-stone-800 dark:border-stone-600"
                : "border-coral-400 bg-coral-50 dark:bg-coral-900/20"
            }`}
          >
            <span className="text-[10px]">{coupon.emoji}</span>
            <span className="text-[5px] flex-1 text-stone-600 dark:text-stone-300 leading-tight">
              {coupon.label}
            </span>
            {coupon.redeemed && (
              <span className="text-[6px] text-green-600 font-bold">✓</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
