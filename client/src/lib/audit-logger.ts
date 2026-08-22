import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { logger } from "@/lib/utils/logger";
import { getRequestMeta } from "@/lib/utils/request-meta";

export type AuditEventType =
  | "user.registered"
  | "user.password_reset_requested"
  | "user.account_deleted"
  | "user.profile_updated"
  | "user.name_changed"
  | "creation.created"
  | "subscription.purchased";

export interface AuditInput {
  eventType: AuditEventType;
  userId?: string | null;
  metadata?: Record<string, unknown>;
  /** default true — pulls IP + UA from Next.js headers() */
  captureRequest?: boolean;
}

export async function logAudit(input: AuditInput): Promise<void> {
  try {
    const {
      eventType,
      userId = null,
      metadata = {},
      captureRequest = true,
    } = input;

    const meta = captureRequest
      ? await getRequestMeta()
      : { ip: "unknown", userAgent: null };

    await prisma.auditLog.create({
      data: {
        userId,
        eventType,
        metadata: metadata as Prisma.InputJsonValue,
        ipAddress: meta.ip,
        userAgent: meta.userAgent,
      },
    });
  } catch (e) {
    logger.error("[audit] unexpected failure", {
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
