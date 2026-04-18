-- Migration: Add excuse-generator template
-- Rollback: DELETE FROM public.templates WHERE slug = 'excuse-generator';

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES (
  'excuse-generator',
  'מכונת התירוצים',
  ARRAY['fun'],
  'new',
  false,
  '{
    "fields": [
      { "key": "title",        "type": "text",     "label": "כותרת",           "maxLength": 60 },
      { "key": "subtitle",     "type": "text",     "label": "כותרת משנה",      "maxLength": 120 },
      { "key": "excuses",      "type": "options",  "label": "תירוצים (3-20)",  "required": true },
      { "key": "buttonLabel",  "type": "text",     "label": "טקסט כפתור",      "maxLength": 40 },
      { "key": "disclaimer",   "type": "textarea", "label": "כתב ויתור",       "maxLength": 200 },
      { "key": "primaryColor", "type": "color",    "label": "צבע ראשי",        "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 14}'::jsonb,
  0
)
ON CONFLICT (slug) DO NOTHING;
