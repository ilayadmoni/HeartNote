-- Migration: Add wedding-glass template
-- Rollback: DELETE FROM public.templates WHERE slug = 'wedding-glass'

INSERT INTO public.templates (slug, name, category, tags, is_premium, config_schema, is_active, expiration_policy, uses)
VALUES (
  'wedding-glass',
  'שבירת כוס',
  ARRAY['חתונה'],
  'new',
  true,
  '{
    "fields": [
      { "key": "title", "type": "text", "label": "כותרת", "maxLength": 60 },
      { "key": "subtitle", "type": "text", "label": "כותרת משנה", "maxLength": 120 },
      { "key": "stompButtonLabel", "type": "text", "label": "טקסט כפתור", "maxLength": 40 },
      { "key": "mazalTovTitle", "type": "text", "label": "כותרת מזל טוב", "maxLength": 60, "required": true },
      { "key": "mazalTovMessage", "type": "textarea", "label": "הודעת מזל טוב", "required": true },
      { "key": "primaryColor", "type": "color", "label": "צבע ראשי", "default": "#d4826f" }
    ]
  }'::jsonb,
  true,
  '{"free_days": 1, "paid_days": 30}'::jsonb,
  0
)
ON CONFLICT (slug) DO NOTHING;
