alter table business_settings
  add column if not exists shop_business_name text,
  add column if not exists restaurant_business_name text,
  add column if not exists address_line_1 text,
  add column if not exists address_line_2 text,
  add column if not exists city text,
  add column if not exists postcode text,
  add column if not exists public_email text,
  add column if not exists service_area_text text,
  add column if not exists order_cutoff_text text,
  add column if not exists temporary_closure_message text;

grant select, insert, update, delete on business_settings to service_role;
grant select, update on orders to service_role;
grant select on order_items to service_role;
