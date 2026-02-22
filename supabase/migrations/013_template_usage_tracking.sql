-- =============================================================================
-- HeartNote – Template Usage Tracking
-- Version: 1.0.0
-- Date: 2026-02-22
-- Description: Adds automatic template usage tracking via trigger
--
-- This migration:
-- 1. Adds a 'uses' column to the templates table to track usage count
-- 2. Creates a PostgreSQL function to increment template uses
-- 3. Creates a trigger on creations INSERT to call the function
--
-- Benefit: Ensures data consistency and prevents race conditions when
--          multiple users create items simultaneously, by handling the
--          increment at the database level.
-- =============================================================================

-- =============================================================================
-- 1. ALTER TEMPLATES TABLE – Add uses column
-- =============================================================================

ALTER TABLE public.templates
ADD COLUMN IF NOT EXISTS uses INTEGER NOT NULL DEFAULT 0;

-- Create index on uses for performance when sorting/filtering by popularity
CREATE INDEX IF NOT EXISTS idx_templates_uses ON public.templates(uses);

-- =============================================================================
-- 2. CREATE TRIGGER FUNCTION – Increment template uses
-- =============================================================================

/**
 * increment_template_uses()
 * 
 * Called when a new creation is inserted. Atomically increments the 'uses'
 * counter for the referenced template.
 */
CREATE OR REPLACE FUNCTION public.increment_template_uses()
RETURNS TRIGGER AS $$
BEGIN
    -- Increment the uses column for the template referenced by the new creation
    UPDATE public.templates
    SET uses = uses + 1
    WHERE id = NEW.template_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- 3. CREATE TRIGGER – on creations INSERT
-- =============================================================================

/**
 * trigger_increment_template_uses
 * 
 * Fires AFTER a new row is inserted into the creations table.
 * Increments the uses count for the associated template.
 */
DROP TRIGGER IF EXISTS trigger_increment_template_uses ON public.creations;
CREATE TRIGGER trigger_increment_template_uses
    AFTER INSERT ON public.creations
    FOR EACH ROW
    EXECUTE FUNCTION public.increment_template_uses();

-- =============================================================================
-- 4. BACKFILL – Count existing creations per template (optional)
-- =============================================================================

/**
 * This query counts how many non-deleted creations exist for each template
 * and updates the uses column with the actual count. Uncomment if you need
 * to synchronize historical data.
 * 
 * Note: This is idempotent and safe to run multiple times.
 */
-- UPDATE public.templates t
-- SET uses = (
--     SELECT COUNT(*) 
--     FROM public.creations c 
--     WHERE c.template_id = t.id 
--     AND c.is_deleted = FALSE
-- );

-- =============================================================================
-- 5. COMMENTS – Documentation
-- =============================================================================

COMMENT ON COLUMN public.templates.uses IS 'Tracks total number of times this template has been used by all users';
COMMENT ON FUNCTION public.increment_template_uses() IS 'Automatically increments template uses on new creation INSERT';
COMMENT ON TRIGGER trigger_increment_template_uses ON public.creations IS 'Maintains accurate usage count for templates';
