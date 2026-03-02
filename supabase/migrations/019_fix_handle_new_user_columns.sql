-- =============================================================================
-- Migration 019: Fix handle_new_user trigger for new column names
-- Date: 2026-03-02
--
-- Migration 018 renamed/dropped columns in profiles:
--   creations_count     → creations_count_free
--   creations_left_free → DROPPED
--   creations_left_pro  → DROPPED
--
-- But the handle_new_user() trigger (last defined in 011) still
-- referenced the old column names. This patch updates the INSERT
-- to use only columns that exist after 018.
--
-- Columns inserted:
--   id, email, first_name, last_name, avatar_url, date_of_birth,
--   subscription_tier, creations_count_free
--
-- Columns removed from INSERT:
--   creations_left_free (dropped in 018)
--
-- Note: creations_count_pro, additional_creation_free, additional_creation_pro
-- all default to 0 in the table definition, so they don't need explicit values.
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Done ✓
-- =============================================================================
