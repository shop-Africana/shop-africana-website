insert into categories (name, slug, business_type, description, sort_order, is_active)
values
  (
    'African Dishes',
    'african-dishes',
    'restaurant',
    'African restaurant dishes.',
    10,
    true
  ),
  (
    'Asian Dishes',
    'asian-dishes',
    'restaurant',
    'Asian restaurant dishes.',
    20,
    true
  ),
  (
    'Soups & Stews',
    'soups-and-stews',
    'restaurant',
    'Soups and stews.',
    30,
    true
  ),
  (
    'Sides',
    'sides',
    'restaurant',
    'Side dishes and accompaniments.',
    40,
    true
  ),
  (
    'Drinks',
    'drinks',
    'restaurant',
    'Restaurant drinks.',
    50,
    true
  ),
  (
    'Desserts',
    'desserts',
    'restaurant',
    'Restaurant desserts.',
    60,
    true
  )
on conflict (slug) do update
set
  name = excluded.name,
  business_type = excluded.business_type,
  description = coalesce(categories.description, excluded.description),
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();
