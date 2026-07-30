grant select, insert, update, delete on categories to service_role;
grant select, insert, update, delete on catalog_items to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'shop-product-images',
  'shop-product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  updated_at = now();

drop policy if exists "Public can read shop product images" on storage.objects;
create policy "Public can read shop product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'shop-product-images');
