create extension if not exists pgcrypto;

do $$ begin
  create type business_type as enum ('grocery', 'restaurant');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type fulfilment_type as enum ('delivery', 'collection');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type payment_method as enum ('pending', 'paypal', 'whatsapp');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type payment_status as enum ('pending', 'paid', 'failed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type order_status as enum ('pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled');
exception
  when duplicate_object then null;
end $$;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  business_type business_type not null,
  description text,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists catalog_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references categories(id) on delete set null,
  business_type business_type not null,
  name text not null,
  slug text not null unique,
  description text,
  price integer not null check (price >= 0),
  image_url text,
  unit_label text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  is_demo boolean not null default false,
  sort_order integer not null default 0,
  spice_level text,
  dietary_labels text[],
  preparation_time text,
  allergen_information text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists business_settings (
  id uuid primary key default gen_random_uuid(),
  singleton_key text not null unique default 'default',
  delivery_enabled boolean not null default true,
  collection_enabled boolean not null default true,
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  free_delivery_threshold integer,
  whatsapp_number text,
  contact_number text,
  opening_hours_text text,
  ordering_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_reference text not null unique,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  fulfilment_type fulfilment_type not null,
  delivery_address jsonb,
  order_instructions text,
  subtotal integer not null check (subtotal >= 0),
  delivery_fee integer not null default 0 check (delivery_fee >= 0),
  total integer not null check (total >= 0),
  payment_method payment_method not null default 'pending',
  payment_status payment_status not null default 'pending',
  order_status order_status not null default 'pending',
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  catalog_item_id uuid references catalog_items(id) on delete set null,
  item_name_snapshot text not null,
  business_type_snapshot business_type not null,
  unit_price_snapshot integer not null check (unit_price_snapshot >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer not null check (line_total >= 0),
  optional_meal_instructions text,
  created_at timestamptz not null default now()
);

create index if not exists categories_business_active_idx on categories (business_type, is_active, sort_order);
create index if not exists catalog_items_business_available_idx on catalog_items (business_type, is_available, is_featured, sort_order);
create index if not exists order_items_order_id_idx on order_items (order_id);

alter table categories enable row level security;
alter table catalog_items enable row level security;
alter table business_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

drop policy if exists "Public can read active categories" on categories;
create policy "Public can read active categories"
on categories for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Public can read available catalog items" on catalog_items;
create policy "Public can read available catalog items"
on catalog_items for select
to anon, authenticated
using (is_available = true);

drop policy if exists "Public can read safe business settings" on business_settings;
create policy "Public can read safe business settings"
on business_settings for select
to anon, authenticated
using (singleton_key = 'default');

create or replace function create_customer_order(
  p_customer jsonb,
  p_fulfilment_type fulfilment_type,
  p_delivery_address jsonb,
  p_order_instructions text,
  p_payment_method payment_method,
  p_source text,
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
  v_settings business_settings%rowtype;
begin
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
      and is_available = true
    limit 1;

    if not found then
      raise exception 'One or more items are unavailable';
    end if;

    v_line_total := v_catalog.price * v_quantity;
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
      and is_available = true
    limit 1;

    v_line_total := v_catalog.price * v_quantity;

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
      v_catalog.price,
      v_quantity,
      v_line_total,
      nullif(trim(coalesce(v_item->>'instructions', '')), '')
    );
  end loop;

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_reference', v_reference,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total', v_total,
    'payment_status', 'pending',
    'order_status', 'pending'
  );
end;
$$;
