# Auth, Data and Billing

## Auth

Supabase is the planned auth provider.

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Current placeholder helpers:

- `/src/lib/auth.js`

## Profiles

The proposed `profiles` table stores:

- user id
- email
- full name
- plan
- subscription status
- Stripe identifiers

See `/supabase/schema.sql`.

## Saved items

The proposed `saved_items` table is generic:

- `tool_id`
- `title`
- `data`
- `notes`
- `schema_version`

Current draft helpers:

- `/src/lib/savedItems.js`

## Feature access

Feature metadata lives in:

- `/config/features.js`

Access helpers:

- `isProUser(user)`
- `hasTier(user, requiredTier)`
- `canAccessTool(user, tool)`
- `canUseFeature(user, feature)`

## Billing

Stripe is the planned billing provider.

Required variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY`
- `NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY`

Current placeholder helpers:

- `/src/lib/billing.js`

Stripe checkout and webhook handling need a backend runtime or server route before production.
