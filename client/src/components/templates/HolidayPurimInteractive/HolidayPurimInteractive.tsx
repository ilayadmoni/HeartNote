"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HolidayPurimInteractiveDesktop } from "./Desktop/HolidayPurimInteractiveDesktop";
import { HolidayPurimInteractiveMobile } from "./Mobile/HolidayPurimInteractiveMobile";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayPurimInteractive(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <HolidayPurimInteractiveMobile {...props} />
    : <HolidayPurimInteractiveDesktop {...props} />;
}
