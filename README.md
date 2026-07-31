# Shop Africana / Pride of Scotland

Independent Next.js website repository for the combined Dundee food businesses:

- **Shop Africana**: Afro-Caribbean grocery shop in Dundee.
- **Pride of Scotland**: African and Asian restaurant in Dundee.

This repository is completely independent from MaiRuwa. Do not inspect, copy from,
modify, connect to, or deploy anything related to MaiRuwa from this project.

## Local Setup

Install dependencies:

```bash
npm install
```

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

Run quality checks:

```bash
npm run lint
npm run build
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks the npm
shim:

```bash
npm.cmd run lint
npm.cmd run build
```

## Architecture Summary

- `app/`: Next.js App Router routes, root layout, global CSS, and metadata.
- `components/layout/`: Shared layout scaffolding such as top bar, header,
  mobile bottom navigation, and footer.
- `components/ui/`: Reusable UI primitives.
- `components/commerce/`: Grocery-commerce interface shells.
- `components/restaurant/`: Restaurant interface shells.
- `data/`: Static local demo data used by the temporary foundation page.
- `lib/`: Shared utilities.
- `types/`: Shared TypeScript types.
- `public/images/`: Local image asset destination. Remote stock-image URLs are
  intentionally not used.
- `supabase/`: Manual SQL migrations, seed files, and owner setup notes.

## Current Completed Batch

Batch 1 foundation-only frontend work is approved and locked:

- Audited the generated Next.js, TypeScript, Tailwind, and ESLint setup.
- Preserved the App Router architecture.
- Added the initial scalable folder structure.
- Added global CSS custom properties for the locked Shop Africana and Pride of
  Scotland design direction.
- Configured Poppins through `next/font/google`.
- Replaced the generated starter page with a temporary internal
  **Foundation Ready** page.
- Added initial UI, layout, commerce, and restaurant shell components.
- Added sensible combined-business metadata.

Batch 2 homepage structure work:

- Replaced the temporary internal foundation page with a production homepage
  structure waiting for approved content.
- Added premium placeholder sections for hero, categories, grocery products,
  restaurant specials, features, restaurant showcase, testimonials, visit
  details, newsletter, and footer.
- Kept all content frontend-only with professional placeholders, no stock
  imagery, no AI artwork, no invented products or meals, and no service
  integrations.

Batch 3 multi-brand route architecture work:

- Added separated Shop Africana and Pride of Scotland browsing routes using the
  App Router.
- Added route-aware section navigation with active states for grocery and
  restaurant journeys.
- Added a shared homepage brand gateway linking users into `/shop` and
  `/restaurant`.
- Added frontend-only placeholder routes for shared basket, account, checkout,
  and contact entry points.
- Kept all route content static and placeholder-only.

Batch 4 real brand asset integration work:

- Stores production logo copies in `public/images/brand/`.
- Stores approved design references in ignored internal `design-references/`.
- Uses local `next/image` logo lockups across shared and section-specific
  headers, homepage gateway, and footer.
- Keeps Shop Africana logo routing to `/shop` and Pride of Scotland logo routing
  to `/restaurant`.

Out of scope for this batch: final homepage, grocery catalogue, restaurant menu,
authentication, backend calls, payments, production service integrations,
environment variables, GitHub push, and Vercel deployment.

Batch 7 customer ordering flow:

- Added Supabase-backed grocery and restaurant catalogue reads.
- Added a shared localStorage basket for grocery and restaurant items.
- Added checkout and server-side order creation through the
  `create_customer_order()` RPC.
- Added order confirmation routing.
- Kept all new order payment and order statuses pending.

Batch 8 owner restaurant menu management:

- Adds Supabase Auth based owner access for single-owner menu management.
- Adds owner routes for login, dashboard, menu management, add meal and edit
  meal.
- Adds reusable weekly restaurant scheduling and per-day overrides.
- Adds dynamic public Pride of Scotland Today's Menu behaviour using the
  Europe/London service date.
- Adds Supabase Storage setup for approved restaurant meal images.
- Requires manual application of `supabase/migrations/0002_batch8_owner_menu_management.sql`
  and manual first-owner setup using `supabase/batch8-owner-setup.sql`.

Final structural launch work:

- Adds nullable operational fields to `business_settings` in
  `supabase/migrations/0004_final_launch_operations.sql`.
- Adds a reusable business-settings reader with neutral fallbacks.
- Adds owner order management at `/owner/orders`.
- Adds owner password recovery at `/owner/forgot-password` and
  `/owner/reset-password`.
- Adds WhatsApp URL helpers and disabled-until-configured UI wiring.
- Keeps PayPal, Resend and custom domain setup optional and inactive until real
  credentials/details are supplied.

Final operational details now configured in `business_settings`:

- Public brands: Shop Africana and Pride of Scotland.
- Address: Unit 1, Horsewater Wynd, Dundee, DD1 5DU.
- Public phone and WhatsApp: 07762 601953.
- Customer email: admin@shop-africana.co.uk.
- Opening hours: Monday-Saturday 8:00 AM-8:00 PM; Sunday 9:00 AM-5:00 PM.
- Delivery and collection are enabled.
- Delivery charges are confirmed manually according to order and location.
- Demo catalogue/menu records remain temporarily until real records replace them.

## Environment Variables

Required for the current Supabase-backed site:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Optional launch variables, blank until configured:

```bash
NEXT_PUBLIC_SITE_URL=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENVIRONMENT=sandbox
RESEND_API_KEY=
OWNER_NOTIFICATION_EMAIL=
```

## Supabase Migration Order

Apply manually in order:

1. `supabase/migrations/0001_batch7_customer_ordering.sql`
2. `supabase/seed-batch7-demo.sql` only when demo seed data is needed
3. `supabase/migrations/0002_batch8_owner_menu_management.sql`
4. `supabase/migrations/0003_batch8_shop_product_management.sql`
5. `supabase/migrations/0004_final_launch_operations.sql`

## Owner Operations

- Owner login: `/owner/login`
- Password recovery: `/owner/forgot-password`
- Dashboard: `/owner`
- Orders: `/owner/orders`
- Product management: `/owner/products`
- Restaurant menu management: `/owner/menu`

To suspend ordering, set `business_settings.ordering_enabled` to `false`.
To disable a product, edit it in `/owner/products` and untick availability.
To mark a meal finished or hidden for today, use `/owner/menu`.

## Optional Activation Steps

- WhatsApp links are active through `business_settings.whatsapp_number`.
- PayPal is not active. Configure sandbox credentials first and verify server-side
  payment capture before live approval.
- Resend is not active. Configure `RESEND_API_KEY`, a verified sending domain and
  `OWNER_NOTIFICATION_EMAIL` before enabling email notifications.
- Domain setup for `shop-africana.co.uk` is pending the registrar/DNS step.
- Approved final hero imagery is still pending.
