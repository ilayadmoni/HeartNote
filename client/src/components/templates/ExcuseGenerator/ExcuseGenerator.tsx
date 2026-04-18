"use client";

/**
 * ExcuseGenerator Component
 * Responsive wrapper — delegates to Desktop or Mobile layout
 */

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ExcuseGeneratorDesktop } from "./Desktop/ExcuseGeneratorDesktop";
import { ExcuseGeneratorMobile } from "./Mobile/ExcuseGeneratorMobile";
import type { TemplateComponentProps, ExcuseGeneratorData } from "./types";

export function ExcuseGenerator({
  data,
}: TemplateComponentProps<ExcuseGeneratorData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile ? (
    <ExcuseGeneratorMobile data={data} />
  ) : (
    <ExcuseGeneratorDesktop data={data} />
  );
}
