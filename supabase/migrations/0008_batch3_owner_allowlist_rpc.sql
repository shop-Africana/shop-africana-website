create or replace function public.current_user_is_owner()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.owner_users
    where owner_users.user_id = auth.uid()
      and owner_users.is_active = true
      and owner_users.role in ('owner', 'admin')
  );
$$;

revoke all on function public.current_user_is_owner() from public;
grant execute on function public.current_user_is_owner() to authenticated;
