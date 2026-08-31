/**
 * Full NextAuth (Auth.js v5) config — Node.js runtime only (Prisma + bcrypt).
 * Never import this from middleware.ts; use ./edge.ts there instead.
 *
 * Env vars this config expects (see .env.example):
 *   AUTH_SECRET        — JWT signing secret (openssl rand -base64 32)
 *   AUTH_GOOGLE_ID      — Google OAuth Client ID
 *   AUTH_GOOGLE_SECRET  — Google OAuth Client Secret
 * Google Cloud Console redirect URI to register: /api/auth/callback/google
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authorizeCredentials } from "./credentials";
import { createProfileForUser, splitFullName } from "./onboarding";
import { computeProfileComplete } from "./profileComplete";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    // The app drives auth through modals on "/", not dedicated pages —
    // errors surface via the existing modal state, not a NextAuth page.
    error: "/auth/auth-code-error",
  },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;
        return authorizeCredentials(email, password);
      },
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  events: {
    // Fires once, only for adapter-created users — i.e. first-ever Google
    // sign-in (Credentials registration creates its own User row directly in
    // actions/registration.ts and calls createProfileForUser itself).
    createUser: async ({ user }) => {
      const { firstName, lastName } = splitFullName(user.name);
      await createProfileForUser({
        userId: user.id as string,
        email: user.email ?? null,
        firstName,
        lastName,
        avatarUrl: user.image ?? null,
      });
      // Google already verifies the email address.
      await prisma.user.update({
        where: { id: user.id as string },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.profileComplete = await computeProfileComplete(user.id as string);
      }
      if (trigger === "update" && session?.profileComplete !== undefined) {
        token.profileComplete = session.profileComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      session.profileComplete = token.profileComplete as boolean | undefined;
      return session;
    },
  },
});
