# Shop Africana & Pride of Scotland Handover

This repository powers the combined Shop Africana grocery website and Pride of
Scotland restaurant website. It is independent from MaiRuwa.

## Accounts The Owner Controls

- GitHub repository: `shop-Africana/shop-africana-website`
- Vercel project: connected to the GitHub `main` branch
- Supabase project: database, Auth and Storage
- Domain: `shop-africana.co.uk`, pending registrar/DNS connection
- PayPal Business: optional, not activated
- WhatsApp: active public channel on 07762 601953
- Business email: admin@shop-africana.co.uk
- Resend: optional, not activated

## Confirmed Public Details

- Shop name: Shop Africana
- Restaurant name: Pride of Scotland
- Address: Unit 1, Horsewater Wynd, Dundee, DD1 5DU
- Phone: 07762 601953
- WhatsApp: 07762 601953
- Email: admin@shop-africana.co.uk
- Opening hours: Monday-Saturday 8:00 AM-8:00 PM; Sunday 9:00 AM-5:00 PM
- Service area: Delivery available across Dundee and nearby areas. Wider
  delivery is subject to confirmation.
- Delivery charges are confirmed manually according to order and location.
- Collection is enabled.

## Environment Variables

Do not commit real values.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `PAYPAL_CLIENT_ID`
- `PAYPAL_CLIENT_SECRET`
- `PAYPAL_WEBHOOK_ID`
- `PAYPAL_ENVIRONMENT`
- `RESEND_API_KEY`
- `OWNER_NOTIFICATION_EMAIL`

## Routine Owner Tasks

- Sign in at `/owner/login`.
- Manage Shop Africana products at `/owner/products`.
- Add a grocery product at `/owner/products/new`.
- Disable a product by editing it and unticking availability.
- Change product prices from the edit product page.
- Manage Pride of Scotland meals at `/owner/menu`.
- Add a meal at `/owner/menu/new`.
- Mark meals finished, available or hidden from `/owner/menu`.
- View customer orders at `/owner/orders`.

## PayPal Preparation

PayPal integration is prepared for the owner's existing PayPal account. When
ready, log in with the owner, create or select the REST API app, register the
production webhook, and add the Client ID, Client Secret, Webhook ID and
environment values to hosting. PayPal remains unavailable in checkout until
those values are present.
- Open an order to review customer and item details.
- Update order status to pending, accepted, preparing, ready, completed or cancelled.

## Emergency Ordering Shutdown

Set `business_settings.ordering_enabled` to `false` in Supabase. This blocks
new order creation at the server-side order RPC.

Keep `business_settings.delivery_fee` at `0` until a standard fee model is
confirmed. Customer and owner-facing screens should treat delivery cost as to be
confirmed, not free.

## Backups

- Export Supabase database backups before major catalogue changes.
- Keep product and meal images in Supabase Storage buckets:
  - `shop-product-images`
  - `restaurant-menu-images`
- Keep local code changes committed and pushed to GitHub.

## Optional Launch Tasks

- Configure PayPal sandbox first, then live only after explicit approval.
- Configure Resend only after an API key and sending domain are confirmed.
- Add the owner domain in Vercel and update DNS at the owner-controlled registrar.
- Update Supabase Auth Site URL and redirect URLs after DNS/domain connection.
- Replace current safe visual fallbacks with approved hero/page imagery.
- Replace temporary demo records after real catalogue and menu records are ready.
