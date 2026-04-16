-- Migration: free_tier_no_expiry
-- Date: 2026-04-15
-- Rollback: UPDATE subscription_policies SET default_expiry = 86400 WHERE tier_code = 'free';

UPDATE subscription_policies SET default_expiry = NULL WHERE tier_code = 'free';
