-- Migration: Persist the user's preferred UI language on the profile row.
-- Hebrew is the product default; English is the second supported locale.
-- Rollback: ALTER TABLE public.profiles DROP COLUMN locale;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'he';

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_locale_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_locale_check CHECK (locale IN ('he', 'en'));
