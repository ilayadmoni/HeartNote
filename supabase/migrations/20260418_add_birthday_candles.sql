-- Migration: Add birthday-candles template
-- Rollback: DELETE FROM public.templates WHERE slug = 'birthday-candles';

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES (
  'birthday-candles',
  'כיבוי נרות',
  ARRAY['birthday'],
  'new',
  true,
  '{
    "fields": [
      { "key": "title",               "type": "text",    "label": "כותרת",            "maxLength": 60 },
      { "key": "subtitle",            "type": "text",    "label": "כותרת משנה",       "maxLength": 120 },
      { "key": "candleCount",         "type": "number",  "label": "מספר נרות",        "min": 1, "max": 10, "required": true },
      { "key": "cakeColor",           "type": "color",   "label": "צבע העוגה",        "default": "#d4826f" },
      { "key": "flameColor",          "type": "color",   "label": "צבע הלהבה",        "default": "#ffde59" },
      { "key": "celebrationTitle",    "type": "text",    "label": "כותרת חגיגה",      "maxLength": 60,  "required": true },
      { "key": "celebrationMessage",  "type": "textarea","label": "הודעת חגיגה",      "maxLength": 300, "required": true },
      { "key": "primaryColor",        "type": "color",   "label": "צבע ראשי",         "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 30}'::jsonb,
  0
)
ON CONFLICT (slug) DO NOTHING;
