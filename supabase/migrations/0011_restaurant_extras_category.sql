insert into categories (
  name,
  slug,
  business_type,
  description,
  sort_order,
  is_active
)
values (
  'Extras',
  'extras',
  'restaurant',
  'Separately priced restaurant extras such as extra protein, sides and sauces.',
  70,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  business_type = excluded.business_type,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();
