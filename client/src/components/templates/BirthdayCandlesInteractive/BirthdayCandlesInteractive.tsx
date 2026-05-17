"use client";

import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BirthdayCandlesInteractiveDesktop } from "./Desktop/BirthdayCandlesInteractiveDesktop";
import { BirthdayCandlesInteractiveMobile } from "./Mobile/BirthdayCandlesInteractiveMobile";
import type { BirthdayInteractiveData, TemplateComponentProps } from "@/components/templates/types";

export function BirthdayCandlesInteractive(
  props: TemplateComponentProps<BirthdayInteractiveData>,
) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return isMobile
    ? <BirthdayCandlesInteractiveMobile {...props} />
    : <BirthdayCandlesInteractiveDesktop {...props} />;
}
