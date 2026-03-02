-- =============================================================================
-- HeartNote – Update Profiles Creation Counters
-- Migration: 018_update_profiles_creation_counters.sql
-- Date: 2026-03-02
--
-- Changes to public.profiles:
--   1. Rename creations_count → creations_count_free (INT, default 0)
--   2. Add creations_count_pro  (INT, default 0)
--   3. Add additional_creation_free (INT, default 0)
--   4. Add additional_creation_pro  (INT, default 0)
--   5. Drop creations_left_free and creations_left_pro (no longer needed)
--
-- Also updates the DB trigger `trg_handle_new_creation_quota` to use the
-- new counter-based quota model:
--   free  → block if creations_count_free >= (policy.creation_limit + additional_creation_free)
--           then increment creations_count_free
--   premium → increment creations_count_pro (unlimited)
-- =============================================================================

-- =============================================================================
-- 1. ALTER PROFILES TABLE
-- =============================================================================

-- 1a. Rename creations_count → creations_count_free
ALTER TABLE public.profiles
  RENAME COLUMN creations_count TO creations_count_free;

-- Ensure correct type & default
ALTER TABLE public.profiles
  ALTER COLUMN creations_count_free SET DEFAULT 0,
  ALTER COLUMN creations_count_free SET NOT NULL;

-- 1b. Add new columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS creations_count_pro INT NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS additional_creation_free INT NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS additional_creation_pro INT NOT NULL DEFAULT 0;

-- 1c. Drop legacy columns
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS creations_left_free;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS creations_left_pro;


-- =============================================================================
-- 2. REPLACE TRIGGER FUNCTION — new counter-based quota logic
-- =============================================================================

DROP TRIGGER IF EXISTS trg_handle_new_creation_quota ON public.creations;
DROP FUNCTION IF EXISTS public.handle_new_creation_quota();

CREATE OR REPLACE FUNCTION public.handle_new_creation_quota()
RETURNS TRIGGER AS $$
DECLARE
    v_tier                  TEXT;
    v_count_free            INT;
    v_additional_free       INT;
    v_count_pro             INT;
    v_additional_pro        INT;
    v_policy_limit          INT;     -- from subscription_policies
    v_total_allowed         INT;
BEGIN
    -- Lock the profile row to prevent race conditions
    SELECT
        subscription_tier,
        creations_count_free,
        additional_creation_free,
        creations_count_pro,
        additional_creation_pro
    INTO
        v_tier,
        v_count_free,
        v_additional_free,
        v_count_pro,
        v_additional_pro
    FROM public.profiles
    WHERE id = NEW.user_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profile not found for user_id %', NEW.user_id;
    END IF;

    -- ── Free tier ──────────────────────────────────────────────────
    IF v_tier = 'free' THEN
        -- Look up the policy limit for free tier
        SELECT creation_limit
        INTO v_policy_limit
        FROM public.subscription_policies
        WHERE tier_code = 'free';

        v_policy_limit := COALESCE(v_policy_limit, 3);  -- fallback
        v_total_allowed := v_policy_limit + COALESCE(v_additional_free, 0);

        IF v_count_free >= v_total_allowed THEN
            RAISE EXCEPTION 'Insufficient creations quota';
        END IF;

        UPDATE public.profiles
        SET creations_count_free = creations_count_free + 1
        WHERE id = NEW.user_id;

        RETURN NEW;
    END IF;

    -- ── Premium / Pro tier ─────────────────────────────────────────
    IF v_tier IN ('premium', 'pro') THEN
        -- Premium is unlimited — just increment
        UPDATE public.profiles
        SET creations_count_pro = creations_count_pro + 1
        WHERE id = NEW.user_id;

        RETURN NEW;
    END IF;

    -- ── Unknown tier — deny by default ─────────────────────────────
    RAISE EXCEPTION 'Insufficient creations quota';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 3. RE-CREATE TRIGGER
-- =============================================================================

CREATE TRIGGER trg_handle_new_creation_quota
    BEFORE INSERT ON public.creations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_creation_quota();

-- =============================================================================
-- Done ✓
-- =============================================================================
