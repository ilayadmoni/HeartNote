"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HolidaySukkotInteractiveDesktop } from "./Desktop/HolidaySukkotInteractiveDesktop";
import { HolidaySukkotInteractiveMobile } from "./Mobile/HolidaySukkotInteractiveMobile";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidaySukkotInteractive(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <HolidaySukkotInteractiveMobile {...props} />
    : <HolidaySukkotInteractiveDesktop {...props} />;
}
