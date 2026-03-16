"use client";

export interface PendingCreationPayload {
  templateId: string;
  data: Record<string, unknown>;
  returnPath: string;
  createdAt: number;
}

const PENDING_CREATION_KEY = "heartnote.pendingCreation";
const DRAFT_PREFIX = "heartnote.createDraft:";

export function getDraftKey(templateId: string): string {
  return `${DRAFT_PREFIX}${templateId}`;
}

export function saveDraft(templateId: string, data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(getDraftKey(templateId), JSON.stringify(data));
}

export function loadDraft(templateId: string): Record<string, unknown> | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(getDraftKey(templateId));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function clearDraft(templateId: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(getDraftKey(templateId));
}

export function setPendingCreation(payload: PendingCreationPayload): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PENDING_CREATION_KEY, JSON.stringify(payload));
}

export function getPendingCreation(): PendingCreationPayload | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PENDING_CREATION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingCreationPayload;
  } catch {
    return null;
  }
}

export function clearPendingCreation(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_CREATION_KEY);
}
