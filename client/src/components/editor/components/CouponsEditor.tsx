"use client";

/**
 * CouponsEditor Component
 * Timeline-style editor for love coupons — up to 8 items
 * Each item: emoji, color, title (headline), description
 */

import { Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { LoveCoupon } from "@/components/templates/types";
import { LimitedInput, CHAR_LIMITS } from "./LimitedInput";

const EMOJI_OPTIONS = [
  "💆", "🍽️", "🎬", "🧹", "💤", "🍫",
  "☕", "🎁", "💋", "🌹", "🏖️", "🎵",
];

const COLOR_OPTIONS = [
  { key: "emerald", label: "ירוק", dot: "bg-emerald-400" },
  { key: "sky", label: "כחול", dot: "bg-sky-400" },
  { key: "amber", label: "כתום", dot: "bg-amber-400" },
  { key: "rose", label: "ורוד", dot: "bg-rose-400" },
  { key: "violet", label: "סגול", dot: "bg-violet-400" },
  { key: "cyan", label: "תכלת", dot: "bg-cyan-400" },
];

const MAX_COUPONS = 6;

interface CouponsEditorProps {
  coupons: LoveCoupon[];
  onChange: (coupons: LoveCoupon[]) => void;
}

export function CouponsEditor({ coupons = [], onChange }: CouponsEditorProps) {
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
          <CouponItem
            key={coupon.id}
            coupon={coupon}
            index={index}
            onRemove={removeCoupon}
            onUpdate={updateCoupon}
          />
        ))}
      </AnimatePresence>

      {canAddMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addCoupon}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-[#d4826f] bg-[#d4826f]/10 hover:bg-[#d4826f]/20 rounded-xl transition-colors text-hebrew-body"
        >
          <Plus size={16} />
          <span>הוסף קופון ({coupons.length}/{MAX_COUPONS})</span>
        </motion.button>
      )}
    </div>
  );
}

/** Single coupon editing card */
interface CouponItemProps {
  coupon: LoveCoupon;
  index: number;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof LoveCoupon, value: string) => void;
}

function CouponItem({ coupon, index, onRemove, onUpdate }: CouponItemProps) {
  const inputClass =
    "w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#d4826f]/50 text-hebrew-body";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 space-y-2"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 text-hebrew-body">
          קופון {index + 1}
        </span>
        <button
          onClick={() => onRemove(coupon.id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
          title="מחק קופון"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Emoji Picker */}
      <div className="flex gap-1 flex-wrap">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onUpdate(coupon.id, "icon", emoji)}
            className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
              coupon.icon === emoji
                ? "bg-[#d4826f] shadow-sm scale-110"
                : "bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500"
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Color Picker */}
      <div className="flex gap-1.5 flex-wrap">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c.key}
            onClick={() => onUpdate(coupon.id, "color", c.key)}
            className={`w-6 h-6 rounded-full ${c.dot} transition-all ${
              coupon.color === c.key
                ? "ring-2 ring-[#d4826f] ring-offset-1 scale-110"
                : "opacity-60 hover:opacity-100"
            }`}
            title={c.label}
          />
        ))}
      </div>

      {/* Title */}
      <LimitedInput
        value={coupon.title}
        onChange={(v) => onUpdate(coupon.id, "title", v)}
        maxLength={CHAR_LIMITS.TITLE}
        placeholder="כותרת הקופון"
        className={inputClass}
      />

      {/* Description */}
      <LimitedInput
        value={coupon.description || ""}
        onChange={(v) => onUpdate(coupon.id, "description", v)}
        maxLength={CHAR_LIMITS.BODY}
        placeholder="תיאור קצר (אופציונלי)"
        className={inputClass}
      />
    </motion.div>
  );
}
