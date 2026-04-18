import type { ApologySearchData } from "@/components/templates/types";

export type SearchPhase = "idle" | "typing" | "loading" | "result";

export interface ApologySearchBaseProps {
  data: ApologySearchData;
  phase: SearchPhase;
  typedText: string;
  primaryColor: string;
  onStart: () => void;
  onReset: () => void;
}

export type ApologySearchDesktopProps = ApologySearchBaseProps;
export type ApologySearchMobileProps = ApologySearchBaseProps;
