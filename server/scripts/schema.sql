-- HeartNote Database Schema
-- Run this in the Supabase SQL Editor

-- =============================================
-- 1. Templates Table
-- =============================================
CREATE TABLE IF NOT EXISTS templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    name TEXT NOT NULL,
    name_he TEXT,
    description TEXT,
    description_he TEXT,
    
    component_key TEXT NOT NULL UNIQUE, -- matches React component name
    category TEXT DEFAULT 'general',
    
    config_schema JSONB DEFAULT '{}'::jsonb, -- dynamic form fields
    example_data JSONB DEFAULT '{}'::jsonb,
    
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0
);

-- =============================================
-- 2. User Pages Table
-- =============================================
CREATE TABLE IF NOT EXISTS user_pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES templates(id),
    
    route_slug TEXT NOT NULL UNIQUE,
    title TEXT,
    
    custom_settings JSONB DEFAULT '{}'::jsonb,
    
    is_published BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    
    expires_at TIMESTAMPTZ,
    view_count INTEGER DEFAULT 0
);

-- Index for faster expiration checks
CREATE INDEX idx_user_pages_expires_at ON user_pages(expires_at);
CREATE INDEX idx_user_pages_user_id ON user_pages(user_id);
CREATE INDEX idx_user_pages_slug ON user_pages(route_slug);

-- =============================================
-- 3. User Actions Log (Audit)
-- =============================================
CREATE TABLE IF NOT EXISTS user_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    user_id UUID NOT NULL REFERENCES auth.users(id),
    
    action_type TEXT NOT NULL, -- 'page_created', 'page_viewed', etc.
    resource_type TEXT NOT NULL, -- 'page', 'user', etc.
    resource_id UUID,
    
    metadata JSONB DEFAULT '{}'::jsonb
);

-- =============================================
-- 4. RLS Policies
-- =============================================

-- Enable RLS
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_actions ENABLE ROW LEVEL SECURITY;

-- Templates: Public read
CREATE POLICY "Public templates are viewable by everyone" 
ON templates FOR SELECT 
USING (true);

-- User Pages: Users can see their own
CREATE POLICY "Users can view own pages" 
ON user_pages FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- User Pages: Public can verify slug existence (via separate RPC or relaxed policy?)
-- For now, public read is needed for viewing the page content
CREATE POLICY "Public can view published pages" 
ON user_pages FOR SELECT 
USING (is_published = true AND is_deleted = false);

-- User Pages: Users can insert own pages
CREATE POLICY "Users can insert own pages" 
ON user_pages FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());

-- User Pages: Users can update own pages
CREATE POLICY "Users can update own pages" 
ON user_pages FOR UPDATE 
TO authenticated 
USING (user_id = auth.uid());

-- User Pages: Users can delete (soft delete) own pages
-- Actually we use UPDATE for soft delete, so the above covers it.

-- User Actions: Users can insert own actions
CREATE POLICY "Users can insert own actions" 
ON user_actions FOR INSERT 
TO authenticated 
WITH CHECK (user_id = auth.uid());
