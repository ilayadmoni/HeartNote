"use client";

/** Single coupon editing card — extracted from CouponsEditor.tsx (150-line file cap). */

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LoveCoupon } from "@/components/templates/types";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";
import { EMOJI_OPTIONS, COLOR_OPTIONS } from "./couponsEditor.constants";

interface CouponItemProps {
  coupon: LoveCoupon;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof LoveCoupon, value: string) => void;
}

const inputClass =
  "w-full px-3 py-2 text-body-sm rounded-control border border-line-strong bg-surface-raised text-ink " +
  "placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/25";

export function CouponItem({ coupon, index, onRemove, onUpdate }: CouponItemProps): JSX.Element {
  const t = useTranslations("editor");

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-surface-sunken rounded-card p-3 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-caption font-bold text-ink-muted">{t("coupons.couponLabel", { num: index + 1 })}</span>
        <button
          onClick={() => onRemove(coupon.id)}
          className="p-1 text-ink-subtle hover:text-red-500 transition-colors rounded-control hover:bg-red-50 dark:hover:bg-red-900/20"
          title={t("coupons.deleteCoupon")}
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onUpdate(coupon.id, "icon", emoji)}
            className={`w-7 h-7 rounded-control text-body-sm flex items-center justify-center transition-colors ${
              coupon.icon === emoji ? "bg-accent shadow-soft scale-110" : "bg-surface-raised hover:bg-surface-sunken"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c.key}
            onClick={() => onUpdate(coupon.id, "color", c.key)}
            className={`w-6 h-6 rounded-full ${c.dot} transition-transform ${
              coupon.color === c.key ? "ring-2 ring-accent ring-offset-1 scale-110" : "opacity-60 hover:opacity-100"
            }`}
            title={t(c.labelKey)}
          />
        ))}
      </div>

      <LimitedInput
        value={coupon.title}
        onChange={(v) => onUpdate(coupon.id, "title", v)}
        maxLength={CHAR_LIMITS.TITLE}
        placeholder={t("coupons.titlePlaceholder")}
        className={inputClass}
      />

      <LimitedInput
        value={coupon.description || ""}
        onChange={(v) => onUpdate(coupon.id, "description", v)}
        maxLength={CHAR_LIMITS.BODY}
        placeholder={t("coupons.descriptionPlaceholder")}
        className={inputClass}
      />
    </motion.div>
  );
}
