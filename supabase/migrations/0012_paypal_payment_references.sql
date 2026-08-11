alter table orders
  add column if not exists payment_provider text,
  add column if not exists payment_provider_order_id text,
  add column if not exists payment_provider_capture_id text,
  add column if not exists paid_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'orders_payment_provider_check'
      and conrelid = 'public.orders'::regclass
  ) then
    alter table orders
      add constraint orders_payment_provider_check
      check (payment_provider is null or payment_provider in ('manual', 'paypal'));
  end if;
end $$;

create unique index if not exists orders_payment_provider_order_unique
on orders (payment_provider, payment_provider_order_id)
where payment_provider is not null
  and payment_provider_order_id is not null;

create index if not exists orders_payment_provider_capture_idx
on orders (payment_provider, payment_provider_capture_id)
where payment_provider_capture_id is not null;
