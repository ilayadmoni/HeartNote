"use client";

import { HolidayAssetLayer } from "./HolidayAssetLayer";
import { HolidayReferenceLayer } from "./HolidayReferenceLayer";
import type { HolidaySceneProps } from "../holiday-scene-types";

const BASE = "/assets/images/holiday-interactive/passover";
const REFERENCE = "/assets/images/holiday-interactive/reference/passover.svg";

export function PassoverScene({ status, reduceMotion }: HolidaySceneProps) {
  const open = status !== "idle";
  const duration = reduceMotion ? 0.12 : 0.82;

  return (
    <div className="absolute inset-0">
      <HolidayReferenceLayer
        src={REFERENCE}
        alt="ברכת פסח עם מצה ופרחים"
        animate={open ? { opacity: 0.5, scale: 1.01 } : { opacity: 1 }}
      />
      <HolidayAssetLayer
        src={`${BASE}/passover-matzah-left.svg`}
        alt="מצה נפתחת"
        className="absolute left-[17%] top-[17%] h-[62%] w-[44%] origin-right opacity-0"
        animate={open ? { opacity: 1, x: -36, rotate: -7, scale: 0.98 } : { opacity: 0 }}
        transition={{ duration, ease: "easeInOut" }}
      />
      <HolidayAssetLayer
        src={`${BASE}/passover-matzah-right.svg`}
        className="absolute right-[17%] top-[17%] h-[62%] w-[44%] origin-left opacity-0"
        animate={open ? { opacity: 1, x: 36, rotate: 7, scale: 0.98 } : { opacity: 0 }}
        transition={{ duration, ease: "easeInOut" }}
      />
    </div>
  );
}
