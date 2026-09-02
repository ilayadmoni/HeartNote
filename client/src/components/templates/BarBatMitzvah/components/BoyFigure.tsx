"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface BoyFigureProps {
  onClick?: () => void;
}

export function BoyFigure({ onClick }: BoyFigureProps) {
  const t = useTranslations("templates");
  return (
    <Image
      src="/assets/images/BarBatMitzva/bar_mitzvah_boy.png"
      alt={t("barBatMitzvah.boyAlt")}
      width={280}
      height={360}
      priority
      draggable={false}
      onClick={onClick}
      className="object-contain pointer-events-auto cursor-pointer drop-shadow-md select-none"
      unoptimized
    />
  );
}
