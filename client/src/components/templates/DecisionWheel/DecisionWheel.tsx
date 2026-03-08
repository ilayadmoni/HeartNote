"use client";

/**
 * DecisionWheel Component
 * Responsive wrapper — delegates to Desktop or Mobile layout
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DecisionWheelDesktop } from "./Desktop/DecisionWheelDesktop";
import { DecisionWheelMobile } from "./Mobile/DecisionWheelMobile";
import type { TemplateComponentProps, DecisionWheelData } from "./types";

export function DecisionWheel({
  data,
}: TemplateComponentProps<DecisionWheelData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <DecisionWheelMobile data={data} />
  ) : (
    <DecisionWheelDesktop data={data} />
  );
}
