"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CouponsViewProps } from "../types";
import { useCoupons } from "@/hooks/useCoupons";
import { CouponCard, CouponRedeemModal } from "../components";
import { FooterBranding } from "@/components/templates/components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { FloatingIcons } from "../../OpenWhen/components";

export function LoveCouponsMobile({ data, creationId, verificationCode }: CouponsViewProps) {
  const pathname = usePathname();
  const isCreateRoute = pathname?.includes("/create/");
  const {
    coupons,
    pendingCoupon,
    isSubmitting,
    requestRedeem,
    confirmRedeem,
    cancelRedeem,
    handleReset,
    needsCodeInput,
    enteredCode,
    setEnteredCode,
    codeError,
  } = useCoupons(data.coupons, creationId, verificationCode);
  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  return (
    <div
      className={`bg-transparent px-4 py-6 relative isolate flex flex-col justify-between items-center gap-6 ${
        isCreateRoute ? "min-h-[450px]" : "min-h-[650px]"
      }`}
    >
      <FloatingIcons />
      <div className="flex-1 max-w-lg mx-auto w-full flex flex-col justify-center">
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center mb-6 text-hebrew-heading break-words max-w-[280px] mx-auto"
            style={{ color: primaryColor }}
          >
            {data.title}
          </motion.h1>
        )}

        <div className="space-y-3">
          {coupons.map((coupon, index) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              index={index}
              onRedeem={requestRedeem}
              primaryColor={primaryColor}
            />
          ))}
        </div>

        {/* Reset button — only visible in the editor/creation route */}
        {isCreateRoute && coupons.some((c) => c.isRedeemed) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-6"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium text-hebrew-body"
              aria-label="איפוס כל הקופונים"
            >
              <RotateCcw size={14} />
              <span>איפוס הכל</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      <FooterBranding className="mx-auto" />

      <CouponRedeemModal
        open={!!pendingCoupon}
        couponTitle={pendingCoupon?.title ?? ""}
        isSubmitting={isSubmitting}
        onConfirm={confirmRedeem}
        onCancel={cancelRedeem}
        primaryColor={primaryColor}
        needsCodeInput={needsCodeInput}
        enteredCode={enteredCode}
        onEnteredCodeChange={setEnteredCode}
        codeError={codeError}
      />
    </div>
  );
}
