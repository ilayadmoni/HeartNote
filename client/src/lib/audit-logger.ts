import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
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

    const admin = createAdminClient();
    const { error } = await admin.from("audit_logs").insert({
      user_id: userId,
      event_type: eventType,
      metadata,
      ip_address: meta.ip,
      user_agent: meta.userAgent,
    });

    if (error) {
      logger.error("[audit] insert failed", {
        eventType,
        code: error.code,
        message: error.message,
      });
    }
  } catch (e) {
    logger.error("[audit] unexpected failure", {
      error: e instanceof Error ? e.message : String(e),
    });
  }
}
