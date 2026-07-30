insert into business_settings (
  singleton_key,
  delivery_enabled,
  collection_enabled,
  delivery_fee,
  free_delivery_threshold,
  whatsapp_number,
  contact_number,
  opening_hours_text,
  ordering_enabled
)
values (
  'default',
  true,
  true,
  0,
  null,
  null,
  null,
  'Opening hours will be published soon',
  true
)
on conflict (singleton_key) do update set
  delivery_enabled = excluded.delivery_enabled,
  collection_enabled = excluded.collection_enabled,
  delivery_fee = excluded.delivery_fee,
  free_delivery_threshold = excluded.free_delivery_threshold,
  opening_hours_text = excluded.opening_hours_text,
  ordering_enabled = excluded.ordering_enabled,
  updated_at = now();

insert into categories (name, slug, business_type, description, sort_order, is_active)
values
  ('African Groceries', 'african-groceries', 'grocery', 'Everyday staples, pantry essentials and familiar flavours.', 10, true),
  ('Caribbean Foods', 'caribbean-foods', 'grocery', 'Caribbean-inspired food ranges for local browsing.', 20, true),
  ('Drinks Selection', 'drinks-selection', 'grocery', 'Drinks and store favourites.', 30, true),
  ('African Dishes', 'african-dishes', 'restaurant', 'African restaurant menu selection.', 10, true),
  ('Asian Dishes', 'asian-dishes', 'restaurant', 'Asian restaurant menu selection.', 20, true),
  ('Soups & Stews', 'soups-and-stews', 'restaurant', 'Soups and stews menu selection.', 30, true)
on conflict (slug) do update set
  name = excluded.name,
  business_type = excluded.business_type,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active,
  updated_at = now();

insert into catalog_items (
  category_id,
  business_type,
  name,
  slug,
  description,
  price,
  image_url,
  unit_label,
  is_available,
  is_featured,
  is_demo,
  sort_order,
  spice_level,
  dietary_labels,
  preparation_time,
  allergen_information
)
values
  ((select id from categories where slug = 'african-groceries'), 'grocery', 'Pantry Selection', 'pantry-selection', 'Product selection will be available soon.', 249, null, 'range', true, true, true, 10, null, null, null, null),
  ((select id from categories where slug = 'caribbean-foods'), 'grocery', 'Seasoning Selection', 'seasoning-selection', 'Spices and seasonings will be published with product details.', 299, null, 'range', true, true, true, 20, null, null, null, null),
  ((select id from categories where slug = 'drinks-selection'), 'grocery', 'Drinks Selection', 'drinks-selection', 'Browse drinks and store favourites when the catalogue opens.', 199, null, 'range', true, true, true, 30, null, null, null, null),
  ((select id from categories where slug = 'african-dishes'), 'restaurant', 'African Dish Selection', 'african-dish-selection', 'Menu details will be published soon.', 899, null, 'serving', true, true, true, 10, null, null, null, null),
  ((select id from categories where slug = 'asian-dishes'), 'restaurant', 'Asian Dish Selection', 'asian-dish-selection', 'Featured Asian dishes will be added with confirmed details.', 849, null, 'serving', true, true, true, 20, null, null, null, null),
  ((select id from categories where slug = 'soups-and-stews'), 'restaurant', 'Soups & Stews Selection', 'soups-and-stews-selection', 'Soup and stew options will be published soon.', 799, null, 'serving', true, true, true, 30, null, null, null, null)
on conflict (slug) do update set
  category_id = excluded.category_id,
  business_type = excluded.business_type,
  name = excluded.name,
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  unit_label = excluded.unit_label,
  is_available = excluded.is_available,
  is_featured = excluded.is_featured,
  is_demo = true,
  sort_order = excluded.sort_order,
  updated_at = now();
