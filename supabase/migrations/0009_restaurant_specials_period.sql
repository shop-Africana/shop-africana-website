update restaurant_menu_periods
set
  name = 'Specials',
  slug = 'specials',
  display_order = 50,
  is_active = true,
  updated_at = now()
where slug = 'other'
  and not exists (
    select 1
    from restaurant_menu_periods existing
    where existing.slug = 'specials'
  );

insert into restaurant_menu_periods (name, slug, display_order, is_active)
select 'Specials', 'specials', 50, true
where not exists (
  select 1
  from restaurant_menu_periods
  where slug = 'specials'
);
