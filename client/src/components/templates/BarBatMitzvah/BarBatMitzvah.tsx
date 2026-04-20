"use client";

import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BarBatMitzvahDesktop } from "./Desktop/BarBatMitzvahDesktop";
import { BarBatMitzvahMobile } from "./Mobile/BarBatMitzvahMobile";
import type { TemplateComponentProps, BarBatMitzvahData } from "../types";
import { DEFAULT_PRIMARY_COLOR } from "../types";

export function BarBatMitzvah({ data }: TemplateComponentProps<BarBatMitzvahData>) {
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
    <BarBatMitzvahMobile {...sharedProps} />
  ) : (
    <BarBatMitzvahDesktop {...sharedProps} />
  );
}
