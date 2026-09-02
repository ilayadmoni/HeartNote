"use client";

import { useTranslations } from "next-intl";

interface CouponCodeInputProps {
  enteredCode?: string;
  onEnteredCodeChange?: (code: string) => void;
  isSubmitting: boolean;
  codeError?: string | null;
}

export function CouponCodeInput({
  enteredCode,
  onEnteredCodeChange,
  isSubmitting,
  codeError,
}: CouponCodeInputProps) {
  const t = useTranslations("templates");
  return (
    <div className="mb-5">
      <label
        htmlFor="coupon-verification-code"
        className="block text-xs font-medium text-ink-muted mb-2 text-center"
      >
        {t("loveCoupons.codeLabel")}
      </label>
      <input
        id="coupon-verification-code"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        autoComplete="off"
        value={enteredCode ?? ""}
        onChange={(e) => {
          const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
          onEnteredCodeChange?.(digits);
        }}
        disabled={isSubmitting}
        dir="ltr"
        className={`w-full mx-auto text-center text-2xl font-mono font-bold tracking-[0.6em] py-3 rounded-control border-2 bg-surface-raised focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors ${
          codeError ? "border-rose-400 focus:ring-rose-300" : "border-line focus:ring-accent-soft"
        }`}
        placeholder="••••"
        aria-invalid={!!codeError}
        aria-describedby={codeError ? "coupon-code-error" : undefined}
      />
      {codeError && (
        <p id="coupon-code-error" className="mt-2 text-center text-xs text-rose-500">
          {codeError}
        </p>
      )}
    </div>
  );
}
