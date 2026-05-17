"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HolidayRoshHashanahInteractiveDesktop } from "./Desktop/HolidayRoshHashanahInteractiveDesktop";
import { HolidayRoshHashanahInteractiveMobile } from "./Mobile/HolidayRoshHashanahInteractiveMobile";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayRoshHashanahInteractive(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <HolidayRoshHashanahInteractiveMobile {...props} />
    : <HolidayRoshHashanahInteractiveDesktop {...props} />;
}
