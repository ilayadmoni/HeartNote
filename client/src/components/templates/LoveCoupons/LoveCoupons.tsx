"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { LoveCouponsDesktop } from "./Desktop/LoveCouponsDesktop";
import { LoveCouponsMobile } from "./Mobile/LoveCouponsMobile";
import type { TemplateComponentProps, LoveCouponsData } from "./types";

interface LoveCouponsProps extends TemplateComponentProps<LoveCouponsData> {
  creationId?: string;
  verificationCode?: string | null;
}

export function LoveCoupons({ data, creationId, verificationCode }: LoveCouponsProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <LoveCouponsMobile data={data} creationId={creationId} verificationCode={verificationCode} />
  ) : (
    <LoveCouponsDesktop data={data} creationId={creationId} verificationCode={verificationCode} />
  );
}
