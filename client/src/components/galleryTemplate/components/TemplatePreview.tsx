"use client";

import {
  DecisionWheelPreview,
  SurpriseGiftPreview,
  SlotMachinePreview,
  PunchingBagPreview,
  ApologySearchPreview,
  BirthdayCandlesPreview,
  ExcuseGeneratorPreview,
  WeddingGlassPreview,
  HolidayCardPreview,
  BarBatMitzvahPreview,
  DateInvitePreview,
  ScratchCardPreview,
  TimelinePreview,
  LoveCouponsPreview,
  RelationshipQuizPreview,
  OpenWhenPreview,
} from "./MorePreviews";
import { LivePreview } from "./LivePreview";
import type { TemplateComponentKey } from "../types";

interface TemplatePreviewProps {
  componentKey: TemplateComponentKey;
}

export function TemplatePreview({ componentKey }: TemplatePreviewProps) {
  switch (componentKey) {
    case "DateInvite":
      return <DateInvitePreview />;
    case "ScratchCard":
      return <ScratchCardPreview />;
    case "Timeline":
      return <TimelinePreview />;
    case "LoveCoupons":
      return <LoveCouponsPreview />;
    case "RelationshipQuiz":
      return <RelationshipQuizPreview />;
    case "OpenWhen":
      return <OpenWhenPreview />;
    case "DecisionWheel":
      return <DecisionWheelPreview />;
    case "SurpriseGift":
      return <SurpriseGiftPreview />;
    case "SlotMachine":
      return <SlotMachinePreview />;
    case "PunchingBag":
      return <PunchingBagPreview />;
    case "ApologySearch":
      return <ApologySearchPreview />;
    case "BirthdayCandles":
      return <BirthdayCandlesPreview />;
    case "ExcuseGenerator":
      return <ExcuseGeneratorPreview />;
    case "WeddingGlass":
      return <WeddingGlassPreview />;
    case "HolidayCard":
      return <HolidayCardPreview />;
    case "BarBatMitzvah":
      return <BarBatMitzvahPreview />;
    default:
      return <LivePreview componentKey={componentKey} />;
  }
}
