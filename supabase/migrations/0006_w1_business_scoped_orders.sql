alter table orders
  add column if not exists business_type business_type;

with unambiguous_order_types as (
  select
    order_id,
    min(business_type_snapshot::text)::business_type as business_type,
    count(distinct business_type_snapshot) as type_count
  from order_items
  group by order_id
)
update orders
set business_type = unambiguous_order_types.business_type,
    updated_at = now()
from unambiguous_order_types
where orders.id = unambiguous_order_types.order_id
  and orders.business_type is null
  and unambiguous_order_types.type_count = 1;

create index if not exists orders_business_type_created_idx
on orders (business_type, created_at desc);

drop function if exists create_customer_order(
  jsonb,
  fulfilment_type,
  jsonb,
  text,
  payment_method,
  text,
  jsonb
);

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
  where singleton_key = 'default'
  limit 1;

  if not found then
    insert into business_settings (singleton_key)
    values ('default')
    returning * into v_settings;
  end if;

  if v_settings.ordering_enabled is not true then
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
