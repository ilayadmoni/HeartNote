-- =============================================================================
-- HeartNote Templates Seed Data
-- Version: 1.0.0
-- Date: 2026-02-07
-- Description: Insert initial template data for HeartNote greeting cards
-- =============================================================================

-- Clear existing templates (optional - remove in production)
-- DELETE FROM public.templates;

-- -----------------------------------------------------------------------------
-- 1. DATE INVITE TEMPLATE
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (
    id,
    name,
    name_he,
    description,
    description_he,
    component_key,
    config_schema,
    example_data,
    category,
    tags,
    is_premium,
    sort_order
) VALUES (
    uuid_generate_v4(),
    'Date Invite',
    'הזמנה לדייט',
    'Interactive card with a "Will you go out with me?" question. Yes button triggers confetti, No button runs away.',
    'כרטיס אינטראקטיבי עם שאלת "האם תצאי איתי לדייט?". כפתור כן מפעיל קונפטי, כפתור לא בורח.',
    'DateInvite',
    '{
        "question": { "type": "string", "label": "שאלה", "default": "?האם תצאי איתי לדייט" },
        "yesText": { "type": "string", "label": "טקסט כפתור כן", "default": "כן" },
        "noText": { "type": "string", "label": "טקסט כפתור לא", "default": "לא" },
        "successMessage": { "type": "string", "label": "הודעת הצלחה", "default": "!יש לנו דייט" },
        "backgroundImage": { "type": "image", "label": "תמונת רקע", "optional": true }
    }',
    '{
        "question": "?האם תצאי איתי לדייט",
        "yesText": "כן",
        "noText": "לא",
        "successMessage": "!יש לנו דייט"
    }',
    'romantic',
    ARRAY['דייט', 'רומנטי', 'הזמנה', 'אהבה'],
    FALSE,
    1
);

-- -----------------------------------------------------------------------------
-- 2. SCRATCH CARD TEMPLATE
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (
    id,
    name,
    name_he,
    description,
    description_he,
    component_key,
    config_schema,
    example_data,
    category,
    tags,
    is_premium,
    sort_order
) VALUES (
    uuid_generate_v4(),
    'Scratch Card',
    'כרטיס גירוד',
    'Hidden prize under scratch blocks. Hover or tap to reveal the surprise.',
    'פרס מוסתר מתחת לבלוקים לגירוד. העבירו את העכבר או הקישו כדי לחשוף את ההפתעה.',
    'ScratchCard',
    '{
        "title": { "type": "string", "label": "כותרת", "default": "גרד וגלה את ההפתעה" },
        "prize": {
            "type": "object",
            "label": "פרס",
            "properties": {
                "type": { "type": "select", "options": ["text", "image"], "default": "text" },
                "content": { "type": "string", "label": "תוכן" }
            }
        },
        "gridSize": {
            "type": "object",
            "label": "גודל רשת",
            "properties": {
                "cols": { "type": "number", "min": 4, "max": 10, "default": 6 },
                "rows": { "type": "number", "min": 3, "max": 8, "default": 4 }
            }
        },
        "scratchColor": { "type": "color", "label": "צבע גירוד", "default": "#c0c0c0" }
    }',
    '{
        "title": "גרד וגלה את ההפתעה",
        "prize": { "type": "text", "content": "🎉 זכית בארוחת ערב רומנטית!" },
        "gridSize": { "cols": 6, "rows": 4 },
        "scratchColor": "#c0c0c0"
    }',
    'fun',
    ARRAY['משחק', 'הפתעה', 'גירוד', 'פרס'],
    FALSE,
    2
);

-- -----------------------------------------------------------------------------
-- 3. TIMELINE TEMPLATE
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (
    id,
    name,
    name_he,
    description,
    description_he,
    component_key,
    config_schema,
    example_data,
    category,
    tags,
    is_premium,
    sort_order
) VALUES (
    uuid_generate_v4(),
    'Timeline',
    'ציר זמן',
    'Vertical timeline with animated event cards. Perfect for relationship milestones.',
    'ציר זמן אנכי עם כרטיסי אירועים מונפשים. מושלם לציוני דרך בזוגיות.',
    'Timeline',
    '{
        "title": { "type": "string", "label": "כותרת", "default": "הסיפור שלנו" },
        "events": {
            "type": "array",
            "label": "אירועים",
            "itemSchema": {
                "id": { "type": "string", "auto": true },
                "date": { "type": "date", "label": "תאריך" },
                "title": { "type": "string", "label": "כותרת" },
                "description": { "type": "text", "label": "תיאור", "optional": true },
                "image": { "type": "image", "label": "תמונה", "optional": true }
            }
        }
    }',
    '{
        "title": "הסיפור שלנו",
        "events": [
            { "id": "1", "date": "2023-01-15", "title": "הפגישה הראשונה", "description": "נפגשנו בבית קפה בתל אביב" },
            { "id": "2", "date": "2023-02-14", "title": "יום האהבה הראשון", "description": "ארוחת ערב רומנטית" },
            { "id": "3", "date": "2023-06-20", "title": "הטיול הראשון יחד", "description": "שבוע באיטליה" }
        ]
    }',
    'memories',
    ARRAY['זיכרונות', 'ציר זמן', 'אירועים', 'יחד'],
    FALSE,
    3
);

-- -----------------------------------------------------------------------------
-- 4. LOVE COUPONS TEMPLATE
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (
    id,
    name,
    name_he,
    description,
    description_he,
    component_key,
    config_schema,
    example_data,
    category,
    tags,
    is_premium,
    sort_order
) VALUES (
    uuid_generate_v4(),
    'Love Coupons',
    'קופוני אהבה',
    'Ticket-style redeemable coupons with perforated edge design.',
    'קופונים בסגנון כרטיסים עם עיצוב קצה מחורר.',
    'LoveCoupons',
    '{
        "title": { "type": "string", "label": "כותרת", "default": "קופונים מיוחדים" },
        "coupons": {
            "type": "array",
            "label": "קופונים",
            "itemSchema": {
                "id": { "type": "string", "auto": true },
                "title": { "type": "string", "label": "כותרת" },
                "description": { "type": "string", "label": "תיאור", "optional": true },
                "icon": { "type": "emoji", "label": "אייקון", "default": "🎁" },
                "isRedeemed": { "type": "boolean", "default": false, "hidden": true },
                "redeemedAt": { "type": "datetime", "hidden": true }
            }
        }
    }',
    '{
        "title": "קופונים מיוחדים",
        "coupons": [
            { "id": "1", "title": "ארוחת ערב רומנטית", "description": "במסעדה לבחירתך", "icon": "🍽️", "isRedeemed": false },
            { "id": "2", "title": "עיסוי מפנק", "description": "30 דקות של פינוק", "icon": "💆", "isRedeemed": false },
            { "id": "3", "title": "סרט לבחירתך", "description": "כולל פופקורן!", "icon": "🎬", "isRedeemed": false },
            { "id": "4", "title": "יום שינה", "description": "בלי הפרעות", "icon": "😴", "isRedeemed": false }
        ]
    }',
    'gifts',
    ARRAY['קופונים', 'מתנות', 'פינוק', 'אהבה'],
    FALSE,
    4
);

-- -----------------------------------------------------------------------------
-- 5. RELATIONSHIP QUIZ TEMPLATE
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (
    id,
    name,
    name_he,
    description,
    description_he,
    component_key,
    config_schema,
    example_data,
    category,
    tags,
    is_premium,
    sort_order
) VALUES (
    uuid_generate_v4(),
    'Relationship Quiz',
    'חידון זוגיות',
    'Interactive quiz to test how well you know each other.',
    'חידון אינטראקטיבי לבדיקת כמה טוב אתם מכירים אחד את השני.',
    'RelationshipQuiz',
    '{
        "title": { "type": "string", "label": "כותרת", "default": "?כמה את/ה מכיר/ה אותי" },
        "questions": {
            "type": "array",
            "label": "שאלות",
            "itemSchema": {
                "id": { "type": "string", "auto": true },
                "question": { "type": "string", "label": "שאלה" },
                "options": { "type": "array", "label": "אפשרויות", "itemType": "string", "minItems": 2, "maxItems": 4 },
                "correctIndex": { "type": "number", "label": "אינדקס התשובה הנכונה", "min": 0, "max": 3 }
            }
        },
        "scoreMessages": {
            "type": "array",
            "label": "הודעות לפי ציון",
            "itemSchema": {
                "minScore": { "type": "number", "label": "ציון מינימלי", "min": 0, "max": 100 },
                "message": { "type": "string", "label": "הודעה" },
                "emoji": { "type": "emoji", "label": "אימוג׳י", "optional": true }
            }
        }
    }',
    '{
        "title": "?כמה את/ה מכיר/ה אותי",
        "questions": [
            { "id": "1", "question": "?מה הצבע האהוב עליי", "options": ["אדום", "כחול", "ירוק", "סגול"], "correctIndex": 1 },
            { "id": "2", "question": "?מה האוכל האהוב עליי", "options": ["פיצה", "סושי", "המבורגר", "פסטה"], "correctIndex": 0 },
            { "id": "3", "question": "?לאן הייתי רוצה לטוס", "options": ["יפן", "איטליה", "יוון", "תאילנד"], "correctIndex": 2 }
        ],
        "scoreMessages": [
            { "minScore": 80, "message": "!וואו, את/ה מכיר/ה אותי מעולה", "emoji": "🎉" },
            { "minScore": 50, "message": "לא רע! יש מה לשפר", "emoji": "😊" },
            { "minScore": 0, "message": "כדאי שנבלה יותר זמן יחד", "emoji": "💪" }
        ]
    }',
    'fun',
    ARRAY['חידון', 'משחק', 'זוגיות', 'כיף'],
    TRUE,
    5
);

-- -----------------------------------------------------------------------------
-- 6. OPEN WHEN TEMPLATE
-- -----------------------------------------------------------------------------
INSERT INTO public.templates (
    id,
    name,
    name_he,
    description,
    description_he,
    component_key,
    config_schema,
    example_data,
    category,
    tags,
    is_premium,
    sort_order
) VALUES (
    uuid_generate_v4(),
    'Open When',
    'פתח כש...',
    'Grid of envelopes with handwritten-style letters inside.',
    'רשת מעטפות עם מכתבים בסגנון כתב יד בפנים.',
    'OpenWhen',
    '{
        "title": { "type": "string", "label": "כותרת", "default": "מכתבים מיוחדים" },
        "envelopes": {
            "type": "array",
            "label": "מעטפות",
            "itemSchema": {
                "id": { "type": "string", "auto": true },
                "title": { "type": "string", "label": "כותרת", "placeholder": "כשאת/ה עצוב/ה" },
                "content": { "type": "text", "label": "תוכן המכתב", "multiline": true },
                "isLocked": { "type": "boolean", "label": "נעול", "default": false },
                "emoji": { "type": "emoji", "label": "אימוג׳י", "optional": true }
            }
        }
    }',
    '{
        "title": "מכתבים מיוחדים",
        "envelopes": [
            { "id": "1", "title": "כשאת/ה עצוב/ה", "content": "היי אהובי/אהובתי,\n\nאני יודע/ת שקשה עכשיו, אבל זכור/י שאני תמיד כאן בשבילך.\n\nאוהב/ת אותך לנצח ❤️", "isLocked": false, "emoji": "😢" },
            { "id": "2", "title": "כשאת/ה צריך/ה חיזוק", "content": "את/ה הכי חזק/ה שאני מכיר/ה!\n\nאם יש מישהו שיכול להתמודד עם זה - זה את/ה.\n\nמאמין/ה בך! 💪", "isLocked": false, "emoji": "💪" },
            { "id": "3", "title": "כשמתגעגעים", "content": "גם אני מתגעגע/ת...\n\nבקרוב ניפגש ונחבק חזק.\n\nעד אז - תזכרו רק רגעים טובים! 🤗", "isLocked": true, "emoji": "💕" }
        ]
    }',
    'romantic',
    ARRAY['מכתבים', 'רומנטי', 'הפתעה', 'אהבה'],
    TRUE,
    6
);

-- =============================================================================
-- VERIFICATION
-- =============================================================================
-- Run this to verify templates were inserted:
-- SELECT name, name_he, component_key, is_premium FROM public.templates ORDER BY sort_order;
