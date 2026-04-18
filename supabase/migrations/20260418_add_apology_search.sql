-- Migration: Add apology-search template
-- Rollback: DELETE FROM public.templates WHERE slug = 'apology-search';

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES (
  'apology-search',
  'חיפוש סליחה',
  ARRAY['romantic'],
  'new',
  false,
  '{
    "fields": [
      { "key": "searchQuery",      "type": "text",     "label": "שאילתת חיפוש",   "maxLength": 150, "required": true },
      { "key": "resultTitle",      "type": "text",     "label": "כותרת תוצאה",    "maxLength": 80,  "required": true },
      { "key": "resultSubtitle",   "type": "textarea", "label": "תיאור תוצאה",    "maxLength": 200 },
      { "key": "startButtonLabel", "type": "text",     "label": "כפתור התחלה",    "maxLength": 40 },
      { "key": "typingSpeedMs",    "type": "number",   "label": "מהירות הקלדה (ms)", "default": 80 },
      { "key": "primaryColor",     "type": "color",    "label": "צבע ראשי",       "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 14}'::jsonb,
  0
)
ON CONFLICT (slug) DO NOTHING;
