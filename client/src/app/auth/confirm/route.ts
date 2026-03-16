/**
 * Auth Confirm Compatibility Route
 * Keeps old email links working by forwarding to /auth/callback,
 * where both code exchange and token hash verification are centralized.
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const callbackUrl = new URL("/auth/callback", request.url);
  const params = request.nextUrl.searchParams;

  const tokenHash = params.get("token_hash");
  const type = params.get("type");
  const next = params.get("next");

  if (tokenHash) callbackUrl.searchParams.set("token_hash", tokenHash);
  if (type) callbackUrl.searchParams.set("type", type);
  if (next) callbackUrl.searchParams.set("next", next);

  return NextResponse.redirect(callbackUrl);
}
