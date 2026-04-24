import "server-only";
import { headers } from "next/headers";

export interface RequestMeta {
  ip: string;
  userAgent: string | null;
}

export async function getRequestMeta(): Promise<RequestMeta> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown";
  const userAgent = h.get("user-agent");
  return { ip, userAgent };
}
