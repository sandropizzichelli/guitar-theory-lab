# Supabase

This folder contains the first database contract for future auth and saved items.

## Tables

- `profiles`
- `saved_items`

`saved_items` is intentionally generic so every current and future tool can save a state snapshot, notes and structured data without a new table.

## Apply schema

After creating a Supabase project, run `schema.sql` in the SQL editor or through the Supabase CLI.

The app code does not connect to Supabase yet; current auth and saved-item helpers are placeholders in:

- `/src/lib/auth.js`
- `/src/lib/savedItems.js`
