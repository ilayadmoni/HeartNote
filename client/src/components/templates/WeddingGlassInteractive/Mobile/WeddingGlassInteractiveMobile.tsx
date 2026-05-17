"use client";

import { WeddingGlassCore } from "../components/WeddingGlassCore";
import type { WeddingInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function WeddingGlassInteractiveMobile(
  props: TemplateComponentProps<WeddingInteractiveData>,
) {
  return <WeddingGlassCore {...props} />;
}
