"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HolidayHanukkahInteractiveDesktop } from "./Desktop/HolidayHanukkahInteractiveDesktop";
import { HolidayHanukkahInteractiveMobile } from "./Mobile/HolidayHanukkahInteractiveMobile";
import type { InteractiveGreetingData, TemplateComponentProps } from "@/components/templates/types";

export function HolidayHanukkahInteractive(
  props: TemplateComponentProps<InteractiveGreetingData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <HolidayHanukkahInteractiveMobile {...props} />
    : <HolidayHanukkahInteractiveDesktop {...props} />;
}
