"use client";

import { LoginModal } from "@/components/auth";
import { UpgradeSlideOver } from "@/components/ui/UpgradeSlideOver";
import { SuccessModal } from "./SuccessModal";
import { QuotaModal } from "./QuotaModal";
import { PaidQuotaModal } from "./PaidQuotaModal";
import { PremiumTemplateUpgradeModal } from "./PremiumTemplateUpgradeModal";
import { CreationConfirmModal } from "./CreationConfirmModal";
import type { EditorState } from "../hooks/useEditorState";

type FieldRendererProps = Pick<
  EditorState,
  | "successData"
  | "activeModal"
  | "isLoginModalOpen"
  | "isSlideOverOpen"
  | "loginRedirect"
  | "isPremiumTemplate"
  | "templateFreeDays"
  | "profile"
  | "setActiveModal"
  | "setSuccessData"
  | "setIsLoginModalOpen"
  | "setIsSlideOverOpen"
  | "handleConfirmCreation"
> & { templateId: string; templateName: string };

export function FieldRenderer({
  successData,
  activeModal,
  isLoginModalOpen,
  isSlideOverOpen,
  loginRedirect,
  isPremiumTemplate,
  templateFreeDays,
  profile,
  setActiveModal,
  setSuccessData,
  setIsLoginModalOpen,
  setIsSlideOverOpen,
  handleConfirmCreation,
  templateId,
  templateName,
}: FieldRendererProps) {
  const closeModal = () => setActiveModal("none");

  return (
    <>
      <SuccessModal
        isOpen={!!successData}
        onClose={() => setSuccessData(null)}
        url={successData?.url || ""}
        expiresAt={successData?.expiresAt || ""}
        verificationCode={successData?.verificationCode ?? null}
      />

      <QuotaModal isOpen={activeModal === "quota"} onClose={closeModal} />

      <PaidQuotaModal
        isOpen={activeModal === "paid-quota"}
        onClose={closeModal}
        onRequestUpgrade={() => { closeModal(); setIsSlideOverOpen(true); }}
      />

      <PremiumTemplateUpgradeModal isOpen={activeModal === "upgrade"} onClose={closeModal} />

      <CreationConfirmModal
        isOpen={activeModal === "confirm"}
        onClose={closeModal}
        onConfirm={handleConfirmCreation}
        templateSlug={templateId}
        templateName={templateName}
        isPremiumTemplate={isPremiumTemplate}
        templateFreeDays={templateFreeDays}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectTo={loginRedirect}
      />

      <UpgradeSlideOver
        isOpen={isSlideOverOpen}
        onClose={() => setIsSlideOverOpen(false)}
        tier={profile?.subscription.tier === "premium" ? "premium" : "lite"}
        creationLimit={
          profile
            ? (profile.subscription.creation_limit ?? 0) + (profile.subscription.additional_creation_pro ?? 0)
            : 0
        }
        expiryDate={profile?.subscription.premium_expiry ?? null}
      />
    </>
  );
}
