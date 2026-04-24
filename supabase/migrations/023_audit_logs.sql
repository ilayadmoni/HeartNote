-- 023_audit_logs.sql — Append-only audit trail for sensitive user events

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
    event_type  TEXT        NOT NULL,
    metadata    JSONB       NOT NULL DEFAULT '{}'::jsonb,
    ip_address  TEXT,
    user_agent  TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT audit_logs_event_type_check CHECK (event_type IN (
        'user.registered',
        'user.password_reset_requested',
        'user.account_deleted',
        'user.profile_updated',
        'user.name_changed',
        'creation.created',
        'subscription.purchased'
    ))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_created
    ON public.audit_logs (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_logs_event_created
    ON public.audit_logs (event_type, created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "No client writes to audit_logs"
    ON public.audit_logs FOR INSERT
    TO authenticated, anon
    WITH CHECK (false);

CREATE POLICY "No client updates to audit_logs"
    ON public.audit_logs FOR UPDATE
    TO authenticated, anon
    USING (false) WITH CHECK (false);

CREATE POLICY "No client deletes from audit_logs"
    ON public.audit_logs FOR DELETE
    TO authenticated, anon
    USING (false);
