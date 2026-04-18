/**
 * SlotMachine Types
 */

import type { SlotMachineData } from "@/components/templates/types";

export interface SlotMachineBaseProps {
  data: SlotMachineData;
  spinCount: number;
  isSpinning: boolean;
  reelTexts: [string, string, string];
  hasWon: boolean;
  primaryColor: string;
  spinsRequired: number;
  onSpin: () => void;
}

export type SlotMachineDesktopProps = SlotMachineBaseProps;
export type SlotMachineMobileProps = SlotMachineBaseProps;
