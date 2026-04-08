-- =============================================================================
-- HeartNote – Quota Selection Behavior
-- Migration: 021_quota_selection_behavior.sql
-- Date: 2026-04-08
--
-- Purpose:
--   1) Persist explicit watermark state per creation
--   2) Make quota deduction follow applied behavior (NEW.is_paid) instead of only
--      profile.subscription_tier, so paid users can intentionally consume free quota.
-- =============================================================================

-- 1) Persist watermark state on creations
ALTER TABLE public.creations
  ADD COLUMN IF NOT EXISTS has_watermark BOOLEAN NOT NULL DEFAULT true;

-- 2) Rebuild quota trigger to branch by NEW.is_paid
DROP TRIGGER IF EXISTS trg_handle_new_creation_quota ON public.creations;
DROP FUNCTION IF EXISTS public.handle_new_creation_quota();

CREATE OR REPLACE FUNCTION public.handle_new_creation_quota()
RETURNS TRIGGER AS $$
DECLARE
  v_tier            TEXT;
  v_count_free      INT;
  v_additional_free INT;
  v_count_pro       INT;
  v_additional_pro  INT;
  v_policy_limit    INT;
  v_total_allowed   INT;
BEGIN
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

  -- FREE behavior quota path (NEW.is_paid = false)
  IF COALESCE(NEW.is_paid, false) = false THEN
    SELECT creation_limit
    INTO v_policy_limit
    FROM public.subscription_policies
    WHERE tier_code = 'free';

    v_policy_limit := COALESCE(v_policy_limit, 3);
    v_total_allowed := v_policy_limit + COALESCE(v_additional_free, 0);

    IF v_count_free >= v_total_allowed THEN
      RAISE EXCEPTION 'Insufficient creations quota';
    END IF;

    UPDATE public.profiles
    SET creations_count_free = creations_count_free + 1
    WHERE id = NEW.user_id;

    RETURN NEW;
  END IF;

  -- PRO/PREMIUM behavior quota path (NEW.is_paid = true)
  IF v_tier = 'free' THEN
    RAISE EXCEPTION 'Insufficient creations quota';
  END IF;

  SELECT creation_limit
  INTO v_policy_limit
  FROM public.subscription_policies
  WHERE tier_code = v_tier;

  IF v_policy_limit IS NOT NULL THEN
    v_total_allowed := v_policy_limit + COALESCE(v_additional_pro, 0);

    IF v_count_pro >= v_total_allowed THEN
      RAISE EXCEPTION 'Insufficient creations quota';
    END IF;
  END IF;

  UPDATE public.profiles
  SET creations_count_pro = creations_count_pro + 1
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_handle_new_creation_quota
  BEFORE INSERT ON public.creations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_creation_quota();
