"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { WeddingGlassInteractiveDesktop } from "./Desktop/WeddingGlassInteractiveDesktop";
import { WeddingGlassInteractiveMobile } from "./Mobile/WeddingGlassInteractiveMobile";
import type { WeddingInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function WeddingGlassInteractive(
  props: TemplateComponentProps<WeddingInteractiveData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <WeddingGlassInteractiveMobile {...props} />
    : <WeddingGlassInteractiveDesktop {...props} />;
}
