"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HolidayPassoverInteractiveDesktop } from "./Desktop/HolidayPassoverInteractiveDesktop";
import { HolidayPassoverInteractiveMobile } from "./Mobile/HolidayPassoverInteractiveMobile";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayPassoverInteractive(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <HolidayPassoverInteractiveMobile {...props} />
    : <HolidayPassoverInteractiveDesktop {...props} />;
}
