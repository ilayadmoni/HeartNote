-- =============================================================================
-- Migration: Harden handle_new_user() against search_path hijacking (SEC-7)
-- Date: 2026-05-08
--
-- handle_new_user() is SECURITY DEFINER (runs with owner privileges) but was
-- missing the SET search_path clause. Without it, a malicious user who can
-- create objects in a schema earlier in the search_path could shadow
-- public.profiles and intercept profile inserts at sign-up time.
--
-- This is a DROP-IN replacement of the function last defined in migration 019.
-- Logic is identical; only the footer line adds SET search_path = public.
--
-- Rollback (restores 019 version without the hardening):
--   CREATE OR REPLACE FUNCTION public.handle_new_user()
--   RETURNS TRIGGER AS $$
--   BEGIN
--       INSERT INTO public.profiles (id, email, first_name, last_name,
--           avatar_url, date_of_birth, subscription_tier, creations_count_free)
--       VALUES (
--           NEW.id, NEW.email,
--           COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
--           COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
--           NEW.raw_user_meta_data->>'avatar_url',
--           (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
--           'free', 0
--       );
--       RETURN NEW;
--   END;
--   $$ LANGUAGE plpgsql SECURITY DEFINER;
-- =============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        first_name,
        last_name,
        avatar_url,
        date_of_birth,
        subscription_tier,
        creations_count_free
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
        NEW.raw_user_meta_data->>'avatar_url',
        (NEW.raw_user_meta_data->>'date_of_birth')::DATE,
        'free',
        0
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =============================================================================
-- Done ✓
-- =============================================================================
