-- =============================================================================
-- Migration: Add index on creations(is_deleted)
-- Date: 2026-05-08
--
-- The creations table is frequently queried with .eq("is_deleted", false)
-- across getMyCreations, getCreation, and the public card viewer.
-- Without an index the DB does a full sequential scan on every read.
--
-- Rollback:
--   DROP INDEX IF EXISTS public.idx_creations_is_deleted;
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_creations_is_deleted
    ON public.creations (is_deleted);
