"use client";

/**
 * LoveCoupons Component
 * Responsive wrapper — delegates to Desktop or Mobile layout
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LoveCouponsDesktop } from "./Desktop/LoveCouponsDesktop";
import { LoveCouponsMobile } from "./Mobile/LoveCouponsMobile";
import type { TemplateComponentProps, LoveCouponsData } from "./types";

export function LoveCoupons({ data }: TemplateComponentProps<LoveCouponsData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <LoveCouponsMobile data={data} />
  ) : (
    <LoveCouponsDesktop data={data} />
  );
}
