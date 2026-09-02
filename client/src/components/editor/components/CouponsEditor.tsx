"use client";

/**
 * CouponsEditor Component
 * Timeline-style editor for love coupons — up to 6 items.
 * Each item: emoji, color, title (headline), description.
 * The single-item card lives in CouponItem.tsx (150-line file cap).
 */

import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import type { LoveCoupon } from "@/components/templates/types";
import { CouponItem } from "./CouponItem";
import { EMOJI_OPTIONS, COLOR_OPTIONS } from "./couponsEditor.constants";

const MAX_COUPONS = 6;

interface CouponsEditorProps {
  coupons: LoveCoupon[];
  onChange: (coupons: LoveCoupon[]) => void;
}

export function CouponsEditor({ coupons = [], onChange }: CouponsEditorProps): JSX.Element {
  const t = useTranslations("editor");
  const canAddMore = coupons.length < MAX_COUPONS;

  const addCoupon = () => {
    if (!canAddMore) return;
    const newCoupon: LoveCoupon = {
      id: `coupon-${Date.now()}`,
      title: "",
      description: "",
      icon: EMOJI_OPTIONS[coupons.length % EMOJI_OPTIONS.length],
      color: COLOR_OPTIONS[coupons.length % COLOR_OPTIONS.length].key,
      isRedeemed: false,
    };
    onChange([...coupons, newCoupon]);
  };

  const removeCoupon = (id: string) => {
    onChange(coupons.filter((c) => c.id !== id));
  };

  const updateCoupon = (id: string, field: keyof LoveCoupon, value: string) => {
    onChange(coupons.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {coupons.map((coupon, index) => (
          <CouponItem key={coupon.id} coupon={coupon} index={index} onRemove={removeCoupon} onUpdate={updateCoupon} />
        ))}
      </AnimatePresence>

      {canAddMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addCoupon}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-body-sm font-bold text-accent bg-accent-soft hover:bg-accent-soft/70 rounded-control transition-colors"
        >
          <Plus size={16} />
          <span>{t("coupons.addCoupon", { count: coupons.length, max: MAX_COUPONS })}</span>
        </motion.button>
      )}
    </div>
  );
}
