'use client'

/**
 * @deprecated Use `useAuth` from `@/contexts/AuthContext` instead.
 *
 * This file is kept only to avoid breaking any stale imports.
 * All authentication is now handled via Supabase SSR (cookie-based sessions).
 */

export { useAuth } from '@/contexts/AuthContext'
