/**
 * Auth action types — kept in a separate file so the "use server"
 * module (auth.ts) only exports async functions.
 */

export type LoginState = {
  error: string | null;
  success: boolean;
};

export const initialLoginState: LoginState = { error: null, success: false };
