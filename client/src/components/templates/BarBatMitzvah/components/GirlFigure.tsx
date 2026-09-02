"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

interface GirlFigureProps {
  onClick?: () => void;
}

export function GirlFigure({ onClick }: GirlFigureProps) {
  const t = useTranslations("templates");
  return (
    <Image
      src="/assets/images/BarBatMitzva/bat_mitzvah_girl.svg"
      alt={t("barBatMitzvah.girlAlt")}
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
