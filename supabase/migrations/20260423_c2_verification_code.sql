-- 20260423_c2_verification_code.sql
-- C2: Secure Love-Coupon redemption with a per-creation verification code.
--   • Adds creations.verification_code (4-digit string)
--   • Backfills existing rows with a random code
--   • Updates redeem_love_coupon(p_creation_id, p_coupon_id, p_verification_code)
--     to require the code before performing redemption.

-- ── 1. Column ──────────────────────────────────────────────────────────────
alter table public.creations
  add column if not exists verification_code text;

update public.creations
   set verification_code = lpad((floor(random() * 10000))::int::text, 4, '0')
 where verification_code is null;

alter table public.creations
  alter column verification_code set not null;

alter table public.creations
  add constraint creations_verification_code_format_chk
  check (verification_code ~ '^[0-9]{4}$');

-- ── 2. Replace RPC ────────────────────────────────────────────────────────
-- Drop every prior signature to keep the surface clean.
drop function if exists public.redeem_love_coupon(uuid, text);
drop function if exists public.redeem_love_coupon(uuid, uuid);
drop function if exists public.redeem_love_coupon(uuid, text, text);

create or replace function public.redeem_love_coupon(
  p_creation_id      uuid,
  p_coupon_id        text,
  p_verification_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_stored_code text;
  v_coupons     jsonb;
  v_idx         int;
  v_coupon      jsonb;
  v_updated     jsonb;
begin
  -- Require a well-formed 4-digit code up front.
  if p_verification_code is null or p_verification_code !~ '^[0-9]{4}$' then
    return null;
  end if;

  -- Lock the creation row; check code before doing anything else.
  select verification_code, metadata -> 'coupons'
    into v_stored_code, v_coupons
    from creations
   where id = p_creation_id
     and is_deleted = false
   for update;

  if v_stored_code is null then
    return null;                                           -- not found / deleted
  end if;

  if v_stored_code <> p_verification_code then
    return null;                                           -- wrong code
  end if;

  if v_coupons is null then
    return null;
  end if;

  select ord - 1
    into v_idx
    from jsonb_array_elements(v_coupons) with ordinality as t(val, ord)
   where val ->> 'id' = p_coupon_id::text;

  if v_idx is null then
    return null;
  end if;

  v_coupon := v_coupons -> v_idx;

  if coalesce((v_coupon ->> 'isRedeemed')::boolean, false) then
    return null;                                           -- already redeemed → 409
  end if;

  v_updated := v_coupon
             || jsonb_build_object(
                  'isRedeemed', true,
                  'redeemedAt', to_char(now() at time zone 'utc',
                                        'YYYY-MM-DD"T"HH24:MI:SS"Z"')
                );

  update creations
     set metadata = jsonb_set(metadata, array['coupons', v_idx::text], v_updated, false)
   where id = p_creation_id;

  return v_updated;
end;
$$;

grant execute on function public.redeem_love_coupon(uuid, text, text)
  to anon, authenticated;
