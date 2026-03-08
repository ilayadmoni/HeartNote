/**
 * protectedAction — Server-side wrapper for authenticated Server Actions.
 *
 * Usage:
 *   export async function myAction(input: Input) {
 *     return protectedAction<Output>(async (user, supabase) => {
 *       // user is already verified — go straight to business logic
 *       const { data, error } = await supabase.from("table").select("*");
 *       if (error) throw new ActionError(error.message, 500);
 *       return data;
 *     });
 *   }
 *
 * The wrapper:
 *   1. Creates a Supabase server client
 *   2. Verifies the session via getUser()
 *   3. If invalid → returns { success: false, error: "UNAUTHORIZED", code: 401 }
 *   4. Otherwise runs `fn(user, supabase)` inside a try/catch
 *   5. Returns { success: true, data } or { success: false, error, code }
 */

import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { ActionError, type ActionResult } from "@/lib/action-response";

export async function protectedAction<T>(
  fn: (user: User, supabase: SupabaseClient) => Promise<T>,
): Promise<ActionResult<T>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "UNAUTHORIZED", code: 401 };
    }

    const data = await fn(user, supabase);
    return { success: true, data };
  } catch (e) {
    if (e instanceof ActionError) {
      return { success: false, error: e.message, code: e.code };
    }

    const message =
      e instanceof Error ? e.message : "An unexpected error occurred";
    return { success: false, error: message, code: 500 };
  }
}
