-- Migration: Tighten wedding-glass-interactive content limits
-- Existing legacy wedding templates are untouched.

UPDATE public.templates
SET config_schema = '{
  "fields": [
    { "key": "coupleNames", "type": "text", "label": "שמות הזוג", "required": true, "maxLength": 42 },
    { "key": "senderName", "type": "text", "label": "שם השולח/ת", "maxLength": 36 },
    { "key": "greetingTitle", "type": "text", "label": "כותרת הברכה", "maxLength": 48 },
    { "key": "message", "type": "textarea", "label": "הברכה", "required": true, "maxLength": 260 }
  ]
}'::jsonb
WHERE slug = 'wedding-glass-interactive';
