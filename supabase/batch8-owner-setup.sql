/*
Batch 8 owner setup notes

Run these steps manually in Supabase after applying:
supabase/migrations/0002_batch8_owner_menu_management.sql

Do not paste real passwords into this file. Do not commit real UUIDs.

1. Create the owner account in Supabase Auth.
   - Supabase Dashboard > Authentication > Users > Add user
   - Use the real owner email and a secure password.
   - Confirm the user if required by your Supabase Auth settings.

2. Sign in at /owner/login with the Supabase Auth email and password.

The owner_users table is retained for a possible future multi-owner allowlist,
but Batch 8 owner access currently uses Supabase Auth itself as the source of
truth for this small single-owner website. No owner_users insert is required.
*/
