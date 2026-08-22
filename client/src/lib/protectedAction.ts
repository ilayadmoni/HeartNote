/**
 * protectedAction — Server-side wrapper for authenticated Server Actions.
 *
 * Usage:
 *   export async function myAction(input: Input) {
 *     return protectedAction<Output>(async (user) => {
 *       // user is already verified — go straight to business logic
 *       const rows = await prisma.table.findMany();
 *       return rows;
 *     });
 *   }
 *
 * The wrapper:
 *   1. Reads the NextAuth session via auth()
 *   2. If invalid → returns { success: false, error: "UNAUTHORIZED", code: 401 }
 *   3. Otherwise runs `fn(user)` inside a try/catch
 *   4. Returns { success: true, data } or { success: false, error, code }
 */

import { auth } from "@/lib/auth";
import { ActionError, type ActionResult } from "@/lib/action-response";
import { logger } from "@/lib/utils/logger";

export interface ProtectedActionUser {
  id: string;
  email: string;
  name: string | null;
}

export async function protectedAction<T>(
  fn: (user: ProtectedActionUser) => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return { success: false, error: "UNAUTHORIZED", code: 401 };
    }

    const user: ProtectedActionUser = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
    };

    const data = await fn(user);
    return { success: true, data };
  } catch (e) {
    if (e instanceof ActionError) {
      return { success: false, error: e.message, code: e.code };
    }

    // MED-5: Log the real error server-side, return generic message to client
    logger.error("[protectedAction] Unexpected error", { error: e });
    return { success: false, error: "An unexpected error occurred", code: 500 };
  }
}
