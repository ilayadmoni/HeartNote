"use client";

import { motion } from "framer-motion";

export function LoveCouponsPreview() {
  return (
    <div className="h-full w-full flex items-center justify-center p-3">
      <div className="space-y-1">
        {[
          { emoji: "💆", redeemed: false },
          { emoji: "🍽️", redeemed: true },
        ].map((coupon, i) => (
          <motion.div
            key={i}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.15 }}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg border-2 border-dashed ${
              coupon.redeemed
                ? "border-gray-300 bg-gray-100 dark:bg-gray-700 opacity-60"
                : "border-[#d4826f] bg-white dark:bg-gray-600"
            }`}
          >
            <span className="text-sm">{coupon.emoji}</span>
            {coupon.redeemed && (
              <span className="text-[8px] text-red-500 font-bold">✓</span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
