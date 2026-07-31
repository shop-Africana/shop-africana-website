alter table catalog_items
  add column if not exists origin_region text;

do $$
begin
  alter table catalog_items
    add constraint catalog_items_origin_region_check
    check (
      origin_region is null
      or origin_region in (
        'African',
        'Caribbean',
        'Asian',
        'Middle Eastern',
        'European',
        'Latin American',
        'Global',
        'Other'
      )
    );
exception
  when duplicate_object then null;
end $$;

insert into categories (name, slug, business_type, description, sort_order, is_active)
values
  ('Rice & Grains', 'rice-grains', 'grocery', 'Rice, grains and staple cereal products.', 100, true),
  ('Beans, Lentils & Pulses', 'beans-lentils-pulses', 'grocery', 'Beans, lentils, peas and other pulses.', 110, true),
  ('Flour, Baking & Cooking Ingredients', 'flour-baking', 'grocery', 'Flour, baking products and cooking ingredients.', 120, true),
  ('Pasta, Noodles & Couscous', 'pasta-noodles', 'grocery', 'Pasta, noodles, couscous and similar staples.', 130, true),
  ('Breakfast Cereals & Porridge', 'breakfast-cereals-porridge', 'grocery', 'Breakfast cereals, oats and porridge ranges.', 140, true),
  ('Cooking Oils & Fats', 'cooking-oils', 'grocery', 'Cooking oils, fats and related products.', 150, true),
  ('Herbs, Spices & Seasonings', 'herbs-spices-seasonings', 'grocery', 'Herbs, spices, seasoning blends and stock products.', 160, true),
  ('Sauces, Pastes & Condiments', 'sauces-pastes-condiments', 'grocery', 'Sauces, pastes, condiments and table accompaniments.', 170, true),
  ('Canned, Tinned & Jarred Foods', 'canned-tinned-jarred', 'grocery', 'Canned, tinned and jarred grocery products.', 180, true),
  ('Fresh Vegetables', 'fresh-vegetables', 'grocery', 'Fresh vegetable ranges.', 190, true),
  ('Fresh Fruits', 'fresh-fruits', 'grocery', 'Fresh fruit ranges.', 200, true),
  ('Meat & Poultry', 'meat-poultry', 'grocery', 'Meat and poultry products.', 210, true),
  ('Fish & Seafood', 'fish-seafood', 'grocery', 'Fish, seafood and related products.', 220, true),
  ('Frozen Foods', 'frozen-foods', 'grocery', 'Frozen grocery products.', 230, true),
  ('Dairy, Eggs & Chilled Foods', 'dairy-eggs-chilled', 'grocery', 'Dairy, eggs and chilled grocery products.', 240, true),
  ('Bread, Pastries & Baked Goods', 'bread-pastries', 'grocery', 'Bread, pastries and baked goods.', 250, true),
  ('Snacks, Biscuits & Confectionery', 'snacks-biscuits-confectionery', 'grocery', 'Snacks, biscuits, sweets and confectionery.', 260, true),
  ('Tea, Coffee & Hot Drinks', 'tea-coffee', 'grocery', 'Tea, coffee and hot drink products.', 270, true),
  ('Soft Drinks, Juices & Malt Drinks', 'soft-drinks-juices', 'grocery', 'Soft drinks, juices, malt drinks and refreshments.', 280, true),
  ('Health Foods & Specialist Diets', 'health-foods-specialist-diets', 'grocery', 'Health foods and specialist diet ranges.', 290, true),
  ('Ready Meals & Convenience Foods', 'ready-meals-convenience', 'grocery', 'Ready meals and convenience foods.', 300, true),
  ('Baby Foods & Family Essentials', 'baby-foods-family-essentials', 'grocery', 'Baby foods and family essentials.', 310, true),
  ('Household & Kitchen Essentials', 'household-kitchen-essentials', 'grocery', 'Household, kitchen and cleaning essentials.', 320, true),
  ('Other Groceries', 'other-groceries', 'grocery', 'Other grocery products.', 330, true)
on conflict (slug) do nothing;
