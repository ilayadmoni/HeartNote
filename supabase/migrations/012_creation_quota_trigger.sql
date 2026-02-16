-- =============================================================================
-- HeartNote – BEFORE INSERT trigger for quota management on public.creations
-- Migration: 012_creation_quota_trigger.sql
-- Date: 2026-02-16
--
-- Validates and decrements the user's creation quota atomically before each
-- INSERT into public.creations. Raises an exception if the user has no
-- remaining quota, preventing the row from being inserted.
--
-- Quota rules:
--   free    → creations_left_free must be > 0; decremented by 1
--   premium → creations_left_pro  must be > 0 (NULL = unlimited); decremented by 1 if not NULL
--   If BOTH relevant quotas are 0 or NULL (for free) → RAISE EXCEPTION
-- =============================================================================

-- Drop existing trigger/function if re-running
DROP TRIGGER IF EXISTS trg_handle_new_creation_quota ON public.creations;
DROP FUNCTION IF EXISTS public.handle_new_creation_quota();

-- =============================================================================
-- Trigger function
-- =============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_creation_quota()
RETURNS TRIGGER AS $$
DECLARE
    v_tier          TEXT;
    v_free_left     INT;
    v_pro_left      INT;
BEGIN
    -- Lock the profile row to prevent race conditions (SELECT … FOR UPDATE)
    SELECT
        subscription_tier,
        creations_left_free,
        creations_left_pro
    INTO
        v_tier,
        v_free_left,
        v_pro_left
    FROM public.profiles
    WHERE id = NEW.user_id
    FOR UPDATE;

    -- Profile must exist
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found for user_id %', NEW.user_id;
    END IF;

    -- ── Free tier ──────────────────────────────────────────────────
    IF v_tier = 'free' THEN
        IF COALESCE(v_free_left, 0) <= 0 THEN
            RAISE EXCEPTION 'Insufficient creations quota';
        END IF;

        UPDATE public.profiles
        SET
            creations_left_free = creations_left_free - 1,
            creations_count     = creations_count + 1
        WHERE id = NEW.user_id;

        RETURN NEW;
    END IF;

    -- ── Premium / Pro tier ─────────────────────────────────────────
    IF v_tier IN ('premium', 'pro') THEN
        -- NULL means unlimited
        IF v_pro_left IS NULL THEN
            UPDATE public.profiles
            SET creations_count = creations_count + 1
            WHERE id = NEW.user_id;

            RETURN NEW;
        END IF;

        IF v_pro_left <= 0 THEN
            RAISE EXCEPTION 'Insufficient creations quota';
        END IF;

        UPDATE public.profiles
        SET
            creations_left_pro = creations_left_pro - 1,
            creations_count    = creations_count + 1
        WHERE id = NEW.user_id;

        RETURN NEW;
    END IF;

    -- ── Unknown tier — deny by default ─────────────────────────────
    RAISE EXCEPTION 'Insufficient creations quota';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- Trigger (BEFORE INSERT — runs once per row)
-- =============================================================================
CREATE TRIGGER trg_handle_new_creation_quota
    BEFORE INSERT ON public.creations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_creation_quota();

-- =============================================================================
-- Done ✓
-- =============================================================================
