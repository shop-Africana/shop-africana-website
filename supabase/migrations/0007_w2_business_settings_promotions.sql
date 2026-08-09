alter table business_settings
  add column if not exists business_type business_type,
  add column if not exists delivery_note text,
  add column if not exists is_open boolean not null default true;

create unique index if not exists business_settings_business_type_unique
on business_settings (business_type)
where business_type is not null;

update business_settings
set
  singleton_key = 'shop',
  business_type = 'grocery',
  shop_business_name = coalesce(shop_business_name, 'Shop Africana'),
  restaurant_business_name = coalesce(restaurant_business_name, 'Pride of Scotland'),
  contact_number = '+447762601953',
  whatsapp_number = '+447762601953',
  address_line_1 = null,
  address_line_2 = null,
  city = 'Dundee',
  postcode = null,
  delivery_note = coalesce(delivery_note, 'Delivery charge will be confirmed according to your order and location.'),
  updated_at = now()
where singleton_key = 'default'
  and not exists (
    select 1 from business_settings existing
    where existing.business_type = 'grocery'
  );

insert into business_settings (
  singleton_key,
  business_type,
  shop_business_name,
  restaurant_business_name,
  address_line_1,
  address_line_2,
  city,
  postcode,
  public_email,
  contact_number,
  whatsapp_number,
  opening_hours_text,
  service_area_text,
  order_cutoff_text,
  temporary_closure_message,
  delivery_enabled,
  collection_enabled,
  delivery_fee,
  free_delivery_threshold,
  ordering_enabled,
  delivery_note,
  is_open
)
select
  'restaurant',
  'restaurant',
  coalesce(shop_business_name, 'Shop Africana'),
  coalesce(restaurant_business_name, 'Pride of Scotland'),
  '14–16 Arbroath Road',
  null,
  'Dundee',
  'DD4 6EP',
  public_email,
  '+4477732895379',
  '+4477732895379',
  opening_hours_text,
  service_area_text,
  order_cutoff_text,
  temporary_closure_message,
  delivery_enabled,
  collection_enabled,
  delivery_fee,
  free_delivery_threshold,
  ordering_enabled,
  coalesce(delivery_note, 'Delivery charge will be confirmed according to your order and location.'),
  coalesce(is_open, true)
from business_settings
where business_type = 'grocery'
limit 1
on conflict (singleton_key) do update
set
  business_type = excluded.business_type,
  restaurant_business_name = excluded.restaurant_business_name,
  address_line_1 = excluded.address_line_1,
  address_line_2 = excluded.address_line_2,
  city = excluded.city,
  postcode = excluded.postcode,
  contact_number = excluded.contact_number,
  whatsapp_number = excluded.whatsapp_number,
  delivery_note = excluded.delivery_note,
  updated_at = now();

drop policy if exists "Public can read safe business settings" on business_settings;
create policy "Public can read safe business settings"
on business_settings for select
using (business_type in ('grocery', 'restaurant') or singleton_key in ('shop', 'restaurant'));

create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  business_type business_type not null,
  catalog_item_id uuid not null references catalog_items(id) on delete cascade,
  title text not null,
  description text,
  badge_text text,
  special_price integer not null check (special_price >= 0),
  starts_at timestamptz not null default now(),
  ends_at timestamptz,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint promotions_valid_window check (ends_at is null or ends_at >= starts_at)
);

create index if not exists promotions_active_business_idx
on promotions (business_type, is_active, starts_at, ends_at, display_order);

create index if not exists promotions_catalog_item_idx
on promotions (catalog_item_id, is_active);

alter table promotions enable row level security;

drop policy if exists "Public can read active promotions" on promotions;
create policy "Public can read active promotions"
on promotions for select
using (
  is_active = true
  and starts_at <= now()
  and (ends_at is null or ends_at >= now())
);

grant select on promotions to anon, authenticated;
grant select, insert, update, delete on promotions to service_role;

create or replace function set_promotions_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists promotions_updated_at on promotions;
create trigger promotions_updated_at
before update on promotions
for each row execute function set_promotions_updated_at();

create or replace function validate_promotion_catalog_item()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_catalog catalog_items%rowtype;
begin
  select * into v_catalog
  from catalog_items
  where id = new.catalog_item_id
  limit 1;

  if not found then
    raise exception 'Promotion catalog item was not found';
  end if;

  if v_catalog.business_type <> new.business_type then
    raise exception 'Promotion business does not match catalog item business';
  end if;

  if new.special_price >= v_catalog.price then
    raise exception 'Promotion price must be lower than the normal item price';
  end if;

  return new;
end;
$$;

drop trigger if exists promotions_validate_catalog_item on promotions;
create trigger promotions_validate_catalog_item
before insert or update on promotions
for each row execute function validate_promotion_catalog_item();

create or replace function create_customer_order(
  p_customer jsonb,
  p_fulfilment_type fulfilment_type,
  p_delivery_address jsonb,
  p_order_instructions text,
  p_payment_method payment_method,
  p_source text,
  p_business_type business_type,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_reference text;
  v_subtotal integer := 0;
  v_delivery_fee integer := 0;
  v_total integer := 0;
  v_item jsonb;
  v_catalog catalog_items%rowtype;
  v_quantity integer;
  v_line_total integer;
  v_effective_price integer;
  v_promotion_price integer;
  v_settings business_settings%rowtype;
  v_service_date date := ((now() at time zone 'Europe/London')::date);
  v_weekday menu_weekday := lower(to_char((now() at time zone 'Europe/London')::date, 'FMDay'))::menu_weekday;
  v_override_status daily_override_status;
  v_override_price integer;
begin
  if p_business_type is null then
    raise exception 'Choose Shop Africana or Pride of Scotland checkout';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order must contain at least one item';
  end if;

  if coalesce(trim(p_customer->>'name'), '') = '' then
    raise exception 'Customer name is required';
  end if;

  if coalesce(trim(p_customer->>'email'), '') = '' then
    raise exception 'Customer email is required';
  end if;

  if coalesce(trim(p_customer->>'phone'), '') = '' then
    raise exception 'Customer phone is required';
  end if;

  select * into v_settings
  from business_settings
  where business_type = p_business_type
  limit 1;

  if not found then
    select * into v_settings
    from business_settings
    where singleton_key = 'default'
    limit 1;
  end if;

  if not found then
    insert into business_settings (singleton_key, business_type)
    values (case when p_business_type = 'grocery' then 'shop' else 'restaurant' end, p_business_type)
    returning * into v_settings;
  end if;

  if v_settings.ordering_enabled is not true or v_settings.is_open is not true then
    raise exception 'Ordering is not currently enabled';
  end if;

  if p_fulfilment_type = 'delivery' and v_settings.delivery_enabled is not true then
    raise exception 'Delivery is not currently enabled';
  end if;

  if p_fulfilment_type = 'collection' and v_settings.collection_enabled is not true then
    raise exception 'Collection is not currently enabled';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := greatest(1, coalesce((v_item->>'quantity')::integer, 1));

    select * into v_catalog
    from catalog_items
    where id = (v_item->>'catalog_item_id')::uuid
      and business_type = p_business_type
      and is_available = true
    limit 1;

    if not found then
      raise exception 'This checkout can only contain available items from the selected business';
    end if;

    v_effective_price := v_catalog.price;

    if p_business_type = 'restaurant' then
      v_override_status := null;
      v_override_price := null;

      select
        restaurant_daily_overrides.override_status,
        restaurant_daily_overrides.override_price
      into v_override_status, v_override_price
      from restaurant_weekly_schedule
      left join restaurant_daily_overrides
        on restaurant_daily_overrides.catalog_item_id = restaurant_weekly_schedule.catalog_item_id
       and restaurant_daily_overrides.service_date = v_service_date
      where restaurant_weekly_schedule.catalog_item_id = v_catalog.id
        and restaurant_weekly_schedule.weekday = v_weekday
        and restaurant_weekly_schedule.is_active = true
      order by restaurant_weekly_schedule.display_order asc
      limit 1;

      if not found or v_override_status in ('finished', 'hidden') then
        raise exception 'One or more Pride of Scotland meals are no longer available today';
      end if;

      v_effective_price := coalesce(v_override_price, v_catalog.price);
    end if;

    select special_price into v_promotion_price
    from promotions
    where catalog_item_id = v_catalog.id
      and business_type = p_business_type
      and is_active = true
      and starts_at <= now()
      and (ends_at is null or ends_at >= now())
    order by display_order asc, starts_at desc
    limit 1;

    if found then
      v_effective_price := v_promotion_price;
    end if;

    v_line_total := v_effective_price * v_quantity;
    v_subtotal := v_subtotal + v_line_total;
  end loop;

  if p_fulfilment_type = 'delivery' then
    v_delivery_fee := coalesce(v_settings.delivery_fee, 0);
    if v_settings.free_delivery_threshold is not null
       and v_subtotal >= v_settings.free_delivery_threshold then
      v_delivery_fee := 0;
    end if;
  end if;

  v_total := v_subtotal + v_delivery_fee;
  v_reference := 'SA-' || to_char(now(), 'YYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into orders (
    order_reference,
    business_type,
    customer_name,
    customer_email,
    customer_phone,
    fulfilment_type,
    delivery_address,
    order_instructions,
    subtotal,
    delivery_fee,
    total,
    payment_method,
    payment_status,
    order_status,
    source
  )
  values (
    v_reference,
    p_business_type,
    trim(p_customer->>'name'),
    trim(p_customer->>'email'),
    trim(p_customer->>'phone'),
    p_fulfilment_type,
    case when p_fulfilment_type = 'delivery' then p_delivery_address else null end,
    nullif(trim(coalesce(p_order_instructions, '')), ''),
    v_subtotal,
    v_delivery_fee,
    v_total,
    p_payment_method,
    'pending',
    'pending',
    coalesce(nullif(trim(p_source), ''), 'website')
  )
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := greatest(1, coalesce((v_item->>'quantity')::integer, 1));

    select * into v_catalog
    from catalog_items
    where id = (v_item->>'catalog_item_id')::uuid
      and business_type = p_business_type
      and is_available = true
    limit 1;

    v_effective_price := v_catalog.price;

    if p_business_type = 'restaurant' then
      v_override_status := null;
      v_override_price := null;

      select
        restaurant_daily_overrides.override_status,
        restaurant_daily_overrides.override_price
      into v_override_status, v_override_price
      from restaurant_weekly_schedule
      left join restaurant_daily_overrides
        on restaurant_daily_overrides.catalog_item_id = restaurant_weekly_schedule.catalog_item_id
       and restaurant_daily_overrides.service_date = v_service_date
      where restaurant_weekly_schedule.catalog_item_id = v_catalog.id
        and restaurant_weekly_schedule.weekday = v_weekday
        and restaurant_weekly_schedule.is_active = true
      order by restaurant_weekly_schedule.display_order asc
      limit 1;

      v_effective_price := coalesce(v_override_price, v_catalog.price);
    end if;

    select special_price into v_promotion_price
    from promotions
    where catalog_item_id = v_catalog.id
      and business_type = p_business_type
      and is_active = true
      and starts_at <= now()
      and (ends_at is null or ends_at >= now())
    order by display_order asc, starts_at desc
    limit 1;

    if found then
      v_effective_price := v_promotion_price;
    end if;

    v_line_total := v_effective_price * v_quantity;

    insert into order_items (
      order_id,
      catalog_item_id,
      item_name_snapshot,
      business_type_snapshot,
      unit_price_snapshot,
      quantity,
      line_total,
      optional_meal_instructions
    )
    values (
      v_order_id,
      v_catalog.id,
      v_catalog.name,
      v_catalog.business_type,
      v_effective_price,
      v_quantity,
      v_line_total,
      nullif(trim(coalesce(v_item->>'instructions', '')), '')
    );
  end loop;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_reference', v_reference,
    'business_type', p_business_type,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total', v_total,
    'payment_status', 'pending',
    'order_status', 'pending'
  );
end;
$$;
