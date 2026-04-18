/**
 * PunchingBag Types
 */

import type { PunchingBagData } from "@/components/templates/types";

export interface PunchingBagBaseProps {
  data: PunchingBagData;
  hits: number;
  hitsRequired: number;
  isDone: boolean;
  isTilting: boolean;
  bagColor: string;
  primaryColor: string;
  onHit: () => void;
  onReset: () => void;
}

export type PunchingBagDesktopProps = PunchingBagBaseProps;
export type PunchingBagMobileProps = PunchingBagBaseProps;
