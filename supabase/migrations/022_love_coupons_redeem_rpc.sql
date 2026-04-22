-- 022_love_coupons_redeem_rpc.sql
-- Atomic single-coupon redemption for the LoveCoupons template.
-- SECURITY DEFINER so it can UPDATE past the (restrictive) RLS policy on creations.
-- Returns the updated coupon row or NULL if already redeemed / not found.

-- Drop old signature that incorrectly typed p_coupon_id as uuid.
drop function if exists public.redeem_love_coupon(uuid, uuid);

create or replace function public.redeem_love_coupon(
  p_creation_id uuid,
  p_coupon_id   text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_coupons     jsonb;
  v_idx         int;
  v_coupon      jsonb;
  v_updated     jsonb;
begin
  -- Lock the row to prevent concurrent redemptions racing on the same coupon.
  select metadata -> 'coupons'
    into v_coupons
    from creations
   where id = p_creation_id
     and is_deleted = false
   for update;

  if v_coupons is null then
    return null;                                           -- creation not found / deleted
  end if;

  -- Find coupon index
  select ord - 1
    into v_idx
    from jsonb_array_elements(v_coupons) with ordinality as t(val, ord)
   where val ->> 'id' = p_coupon_id::text;

  if v_idx is null then
    return null;                                           -- coupon not in array
  end if;

  v_coupon := v_coupons -> v_idx;

  if coalesce((v_coupon ->> 'isRedeemed')::boolean, false) then
    return null;                                           -- already redeemed → caller treats as 409
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

-- Allow the anon + authenticated roles to call the RPC. Service-role already can.
grant execute on function public.redeem_love_coupon(uuid, text) to anon, authenticated;
