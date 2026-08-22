/**
 * Edge-safe partial NextAuth config — used ONLY by middleware.ts.
 *
 * Next.js 14 middleware runs on the Edge runtime, which can't load Prisma's
 * native query engine or bcrypt. This instance has zero providers/adapter —
 * it exists solely so `auth()` can decode the already-issued JWT session
 * cookie (pure crypto, no DB) to read the claims the real config's `jwt()`
 * callback embedded at sign-in time (id, profileComplete). The full config
 * with Credentials/Google/PrismaAdapter lives in ./index.ts and only ever
 * runs in the Node.js runtime (API routes, server actions, RSCs).
 */

import NextAuth from "next-auth";

export const { auth: middlewareAuth } = NextAuth({
  providers: [],
  // Without a matching session() callback, NextAuth's default session
  // shaping only copies sub/name/email/picture from the token — it silently
  // drops custom claims like `id` and `profileComplete` that the full
  // config's jwt() callback embedded at sign-in time. This must mirror
  // ./index.ts's session callback exactly, or middleware will always see
  // profileComplete as undefined.
  callbacks: {
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      session.profileComplete = token.profileComplete as boolean | undefined;
      return session;
    },
  },
});
