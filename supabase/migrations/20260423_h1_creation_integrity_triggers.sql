-- 20260423_h1_creation_integrity_triggers.sql
-- H1: Prevent client-side data forgery on creations.
--
--   • BEFORE INSERT — override `is_paid` and `expires_at` based on the
--     authoritative profile tier. Any values sent by the client are ignored.
--   • BEFORE UPDATE — make `is_paid`, `template_id`, and `expires_at`
--     immutable after creation.

-- ── 1. BEFORE INSERT override ─────────────────────────────────────────────
create or replace function public.enforce_creation_server_truth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tier          text;
  v_premium_exp   timestamp;
  v_is_paid       boolean;
  v_template      public.templates%rowtype;
  v_policy_sec    int;
  v_free_sec      int;
  v_paid_sec      int;
begin
  -- Authoritative tier + expiry from the profile.
  select p.subscription_tier, p.premium_expiry
    into v_tier, v_premium_exp
    from public.profiles p
   where p.id = new.user_id;

  if v_tier is null then
    raise exception 'Profile not found for user %', new.user_id
      using errcode = 'P0002';
  end if;

  -- Treat expired paid tiers as free.
  if v_tier <> 'free'
     and v_premium_exp is not null
     and v_premium_exp < now() then
    v_tier := 'free';
  end if;

  v_is_paid := (v_tier <> 'free');

  -- Look up the template to pull its expiration policy.
  select * into v_template
    from public.templates
   where id = new.template_id;

  if not found then
    raise exception 'Template % not found', new.template_id
      using errcode = 'P0002';
  end if;

  -- Resolve expires_at from the authoritative sources:
  --   1) templates.expiration_policy { free_days, paid_days } in days
  --   2) subscription_policies.default_expiry in seconds (per tier)
  v_free_sec := null;
  v_paid_sec := null;
  if v_template.expiration_policy is not null then
    if (v_template.expiration_policy ? 'free_days') then
      v_free_sec := (v_template.expiration_policy ->> 'free_days')::int * 86400;
    end if;
    if (v_template.expiration_policy ? 'paid_days') then
      v_paid_sec := (v_template.expiration_policy ->> 'paid_days')::int * 86400;
    end if;
  end if;

  if v_is_paid then
    select default_expiry
      into v_policy_sec
      from public.subscription_policies
     where tier_code = v_tier;

    -- Prefer template override if present; otherwise tier policy.
    if v_paid_sec is not null and v_paid_sec > 0 then
      new.expires_at := now() + make_interval(secs => v_paid_sec);
    elsif v_policy_sec is not null and v_policy_sec > 0 then
      new.expires_at := now() + make_interval(secs => v_policy_sec);
    else
      new.expires_at := null;
    end if;
  else
    -- Free tier: templates may opt-in to an expiry; otherwise none.
    if v_free_sec is not null and v_free_sec > 0 then
      new.expires_at := now() + make_interval(secs => v_free_sec);
    else
      new.expires_at := null;
    end if;
  end if;

  -- Force-override the flag regardless of client input.
  new.is_paid := v_is_paid;

  return new;
end;
$$;

drop trigger if exists trg_enforce_creation_server_truth on public.creations;
create trigger trg_enforce_creation_server_truth
  before insert on public.creations
  for each row
  execute function public.enforce_creation_server_truth();

-- Must run before the quota trigger so the quota logic sees the real is_paid.
-- Postgres fires BEFORE triggers in alphabetical order; prefix guarantees
-- 'trg_enforce_...' < 'trg_handle_new_creation_quota'.

-- ── 2. BEFORE UPDATE immutability ─────────────────────────────────────────
create or replace function public.enforce_creation_immutable_fields()
returns trigger
language plpgsql
as $$
begin
  if new.is_paid is distinct from old.is_paid then
    raise exception 'creations.is_paid is immutable'
      using errcode = '42501';
  end if;
  if new.template_id is distinct from old.template_id then
    raise exception 'creations.template_id is immutable'
      using errcode = '42501';
  end if;
  if new.expires_at is distinct from old.expires_at then
    raise exception 'creations.expires_at is immutable'
      using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_enforce_creation_immutable on public.creations;
create trigger trg_enforce_creation_immutable
  before update on public.creations
  for each row
  execute function public.enforce_creation_immutable_fields();
