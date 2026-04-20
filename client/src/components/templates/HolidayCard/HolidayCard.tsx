"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { HolidayCardDesktop } from "./Desktop/HolidayCardDesktop";
import { HolidayCardMobile } from "./Mobile/HolidayCardMobile";
import type { TemplateComponentProps, HolidayCardData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

export function HolidayCard({ data }: TemplateComponentProps<HolidayCardData>) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryColor = data.primaryColor || DEFAULT_PRIMARY_COLOR;

  const sharedProps = {
    data,
    primaryColor,
  };

  if (!mounted) return null;

  return isMobile ? (
    <HolidayCardMobile {...sharedProps} />
  ) : (
    <HolidayCardDesktop {...sharedProps} />
  );
}
