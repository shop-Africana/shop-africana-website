do $$ begin
  create type menu_weekday as enum (
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  );
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type daily_override_status as enum ('available', 'finished', 'hidden');
exception
  when duplicate_object then null;
end $$;

create table if not exists owner_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists restaurant_menu_periods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists restaurant_weekly_schedule (
  id uuid primary key default gen_random_uuid(),
  catalog_item_id uuid not null references catalog_items(id) on delete cascade,
  weekday menu_weekday not null,
  menu_period_id uuid not null references restaurant_menu_periods(id) on delete restrict,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_weekly_schedule_unique unique (
    catalog_item_id,
    weekday,
    menu_period_id
  )
);

create table if not exists restaurant_daily_overrides (
  id uuid primary key default gen_random_uuid(),
  catalog_item_id uuid not null references catalog_items(id) on delete cascade,
  service_date date not null,
  override_status daily_override_status not null,
  override_price integer check (override_price is null or override_price >= 0),
  override_menu_period_id uuid references restaurant_menu_periods(id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint restaurant_daily_overrides_unique unique (catalog_item_id, service_date)
);

create index if not exists owner_users_active_idx on owner_users (user_id, is_active, role);
create index if not exists restaurant_menu_periods_active_idx on restaurant_menu_periods (is_active, display_order);
create index if not exists restaurant_weekly_schedule_day_idx on restaurant_weekly_schedule (weekday, is_active, display_order);
create index if not exists restaurant_daily_overrides_date_idx on restaurant_daily_overrides (service_date, override_status);

alter table owner_users enable row level security;
alter table restaurant_menu_periods enable row level security;
alter table restaurant_weekly_schedule enable row level security;
alter table restaurant_daily_overrides enable row level security;

grant select, insert, update, delete on owner_users to service_role;
grant select, insert, update, delete on restaurant_menu_periods to service_role;
grant select, insert, update, delete on restaurant_weekly_schedule to service_role;
grant select, insert, update, delete on restaurant_daily_overrides to service_role;

drop policy if exists "Public can read active menu periods" on restaurant_menu_periods;
create policy "Public can read active menu periods"
on restaurant_menu_periods for select
to anon, authenticated
using (is_active = true);

insert into restaurant_menu_periods (name, slug, display_order, is_active)
values
  ('Breakfast', 'breakfast', 10, true),
  ('Lunch', 'lunch', 20, true),
  ('Dinner', 'dinner', 30, true),
  ('Supper', 'supper', 40, true),
  ('Other', 'other', 50, true)
on conflict (slug) do update set
  name = excluded.name,
  display_order = excluded.display_order,
  is_active = excluded.is_active,
  updated_at = now();

insert into restaurant_weekly_schedule (
  catalog_item_id,
  weekday,
  menu_period_id,
  is_active,
  display_order
)
select
  catalog_items.id,
  weekday.day::menu_weekday,
  restaurant_menu_periods.id,
  true,
  catalog_items.sort_order
from catalog_items
cross join (
  values ('monday'), ('tuesday'), ('wednesday'), ('thursday'), ('friday')
) as weekday(day)
join restaurant_menu_periods on restaurant_menu_periods.slug = 'lunch'
where catalog_items.business_type = 'restaurant'
  and catalog_items.is_demo = true
on conflict (catalog_item_id, weekday, menu_period_id) do update set
  is_active = true,
  display_order = excluded.display_order,
  updated_at = now();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'restaurant-menu-images',
  'restaurant-menu-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  updated_at = now();

drop policy if exists "Public can read restaurant menu images" on storage.objects;
create policy "Public can read restaurant menu images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'restaurant-menu-images');
