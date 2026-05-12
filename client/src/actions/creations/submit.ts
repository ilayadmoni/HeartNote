/**
 * submitGenericCreation — FormData-based creation for ANY template.
 *
 * Orchestrator: validates input, then persists the creation. All
 * substantive logic lives in the helpers under `./helpers/`.
 */

"use server";

import { protectedAction } from "@/lib/protectedAction";
import { validateSubmitInput } from "./helpers/validateSubmit";
import { persistCreation } from "./helpers/persistCreation";
import { type CreationActionResult } from "@/lib/creation-flow/errors";

export async function submitGenericCreation(
  formData: FormData,
): Promise<CreationActionResult> {
  return protectedAction(async (user, supabase) => {
    const input = await validateSubmitInput(formData);
    return persistCreation(user, supabase, input);
  });
}
