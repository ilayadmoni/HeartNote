"use client";

import { useState, useCallback } from "react";
import type { BlockedModal } from "@/lib/creation-flow/errors";

export type ActiveModal = "none" | "confirm" | "upgrade" | "quota" | "paid-quota";

export interface SuccessData {
  url: string;
  expiresAt: string | null;
  verificationCode: string | null;
}

export function useEditorModals(templateId: string) {
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSlideOverOpen, setIsSlideOverOpen] = useState(false);
  const [loginRedirect, setLoginRedirect] = useState(`/create/${templateId}`);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  const showBlockingModal = useCallback((modal: BlockedModal) => {
    setActiveModal(modal as ActiveModal);
  }, []);

  return {
    activeModal,
    setActiveModal,
    isLoginModalOpen,
    setIsLoginModalOpen,
    isSlideOverOpen,
    setIsSlideOverOpen,
    loginRedirect,
    setLoginRedirect,
    successData,
    setSuccessData,
    showBlockingModal,
  };
}

export type EditorModalState = ReturnType<typeof useEditorModals>;
