/**
 * BirthdayCandles Types
 */

import type { BirthdayCandlesData } from "@/components/templates/types";

export interface BirthdayCandlesBaseProps {
  data: BirthdayCandlesData;
  litCandles: boolean[];
  isDone: boolean;
  candleCount: number;
  cakeColor: string;
  flameColor: string;
  primaryColor: string;
  onBlow: (index: number) => void;
  onRelight: () => void;
}

export type BirthdayCandlesDesktopProps = BirthdayCandlesBaseProps;
export type BirthdayCandlesMobileProps = BirthdayCandlesBaseProps;
