/**
 * Email verification landing route.
 * Replaces Supabase Auth's built-in signup-confirmation link handling.
 */

import { NextRequest, NextResponse } from "next/server";
import { consumeVerificationToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/utils/logger";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const siteUrl = request.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(new URL("/?verify_error=1", siteUrl));
  }

  try {
    const email = await consumeVerificationToken(token, "email_verification");
    if (!email) {
      return NextResponse.redirect(new URL("/?verify_error=1", siteUrl));
    }

    await prisma.user.update({ where: { email }, data: { emailVerified: new Date() } });

    return NextResponse.redirect(new URL("/?verified=true&modal=login", siteUrl));
  } catch (err) {
    logger.error("[auth/verify] Verification failed", { error: err });
    return NextResponse.redirect(new URL("/?verify_error=1", siteUrl));
  }
}
