"use client";

import {
  DecisionWheelPreview,
  SurpriseGiftPreview,
  SlotMachinePreview,
  PunchingBagPreview,
  ApologySearchPreview,
  ExcuseGeneratorPreview,
  BarBatMitzvahPreview,
  BirthdayCandlesInteractivePreview,
  WeddingGlassInteractivePreview,
  HolidayHanukkahInteractivePreview,
  HolidayPassoverInteractivePreview,
  HolidayPurimInteractivePreview,
  HolidayRoshHashanahInteractivePreview,
  HolidayShavuotInteractivePreview,
  HolidaySukkotInteractivePreview,
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
    case "ExcuseGenerator":
      return <ExcuseGeneratorPreview />;
    case "BarBatMitzvah":
      return <BarBatMitzvahPreview />;
    case "BirthdayCandlesInteractive":
      return <BirthdayCandlesInteractivePreview />;
    case "WeddingGlassInteractive":
      return <WeddingGlassInteractivePreview />;
    case "HolidayRoshHashanahInteractive":
      return <HolidayRoshHashanahInteractivePreview />;
    case "HolidayPassoverInteractive":
      return <HolidayPassoverInteractivePreview />;
    case "HolidayPurimInteractive":
      return <HolidayPurimInteractivePreview />;
    case "HolidayShavuotInteractive":
      return <HolidayShavuotInteractivePreview />;
    case "HolidaySukkotInteractive":
      return <HolidaySukkotInteractivePreview />;
    case "HolidayHanukkahInteractive":
      return <HolidayHanukkahInteractivePreview />;
    default:
      return <LivePreview componentKey={componentKey} />;
  }
}
