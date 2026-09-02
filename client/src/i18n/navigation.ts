import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware drop-ins for next/link and next/navigation.
 * Always import Link / useRouter / usePathname / redirect from here.
 */
export const { Link, redirect, usePathname, useRouter, getPathname, permanentRedirect } =
  createNavigation(routing);
