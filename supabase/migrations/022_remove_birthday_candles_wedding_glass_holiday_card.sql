-- Remove birthday-candles, wedding-glass, and holiday-card templates from DB.
-- Corresponding React components have been deleted from the codebase.
-- Existing creations that reference these templates are left intact.

DELETE FROM public.templates
WHERE slug IN ('birthday-candles', 'wedding-glass', 'holiday-card');
