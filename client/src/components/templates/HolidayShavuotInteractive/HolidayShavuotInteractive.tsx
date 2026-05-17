"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HolidayShavuotInteractiveDesktop } from "./Desktop/HolidayShavuotInteractiveDesktop";
import { HolidayShavuotInteractiveMobile } from "./Mobile/HolidayShavuotInteractiveMobile";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayShavuotInteractive(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <HolidayShavuotInteractiveMobile {...props} />
    : <HolidayShavuotInteractiveDesktop {...props} />;
}
