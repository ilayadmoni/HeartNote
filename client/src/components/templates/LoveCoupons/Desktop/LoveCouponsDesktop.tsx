"use client";

import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import type { CouponsViewProps } from "../types";
import { useCoupons } from "../hooks/useCoupons";
import { CouponCard, CouponRedeemModal } from "../components";
import { FooterBranding, BackToGallery } from "@/components/templates/components";
import { DEFAULT_PRIMARY_COLOR } from "@/components/templates/types";
import { FloatingIcons } from "../../OpenWhen/components";

export function LoveCouponsDesktop({ data, creationId, verificationCode }: CouponsViewProps) {
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
    <div className="flex flex-col min-h-[390px] bg-transparent relative isolate">
      <FloatingIcons />
      <BackToGallery className="top-4 right-4 absolute" />
      <div className="flex-1 w-full max-w-sm mx-auto px-6 py-8">
        {data.title && (
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center mb-8 text-hebrew-heading break-words max-w-[300px] mx-auto"
            style={{ color: primaryColor }}
          >
            {data.title}
          </motion.h1>
        )}

        <div className="space-y-4">
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
            className="flex justify-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-hebrew-body"
              aria-label="איפוס כל הקופונים"
            >
              <RotateCcw size={16} />
              <span>איפוס הכל</span>
            </motion.button>
          </motion.div>
        )}
      </div>

      <FooterBranding className="shrink-0 pb-4" />

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
