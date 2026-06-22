# Guitar Theory Lab

Guitar Theory Lab is a modular web platform for advanced guitar-theory tools: set theory, harmonic intersections, voice leading, fretboard visualization and improvisational practice.

The current platform contains the first three modules:

- Set-class Explorer
- Harmonic Intersections
- Goodrick Voice Leading Visualization

The original tools are preserved in their existing folders and are integrated through lightweight adapters while the platform architecture is introduced safely.

## Local development

```bash
cd "/Users/silvialumaca/Desktop/Guitar Software Series"
npm install
npm run dev
```

LAN development, useful from iPad on the same network:

```bash
npm run dev:lan
```

Open:

```text
http://127.0.0.1:5173/
```

or from another device on the LAN:

```text
http://<mac-lan-ip>:5173/
```

## Build

```bash
npm run build
```

The legacy tools can still be tested and built independently:

```bash
npm run test:legacy
npm run build:legacy
```

Full verification:

```bash
npm run test:all
npm run build:all
```

## Environment

Copy `.env.example` to `.env` and configure:

```bash
SITE_NAME="Guitar Theory Lab"
NEXT_PUBLIC_SITE_URL="https://your-domain.example"
NEXT_PUBLIC_APP_DESCRIPTION="Advanced online tools for guitar theory, harmonic exploration, voice leading, set theory and improvisational practice."
```

Supabase and Stripe variables are present as placeholders for future auth, saved items and Pro plans.

See also:

- `/docs/AUTH_DATA_AND_BILLING.md`
- `/supabase/schema.sql`

## Docker

```bash
docker compose up -d
```

The container serves the production build on:

```text
http://127.0.0.1:8080/
```

Use Nginx or Caddy in front of the container for the final domain and HTTPS.

For a production domain, rebuild with:

```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.example" docker compose up -d --build
```

## Tool architecture

Tools are registered in `/config/tools.ts`.

Each tool has:

- id
- slug
- title
- description
- category
- status
- version
- route
- Free/Pro metadata
- tags
- component adapter

The `/tools` page and each `/tools/<slug>` route are generated from the registry.

## Legacy tools

The original projects remain available:

```bash
npm run goodrick
npm run harmonic
npm run set
```

These scripts are retained as rollback and comparison paths while the platform absorbs the tools module by module.

## Rollback

The initial working state is protected by:

- Git commit: `backup: current working version`
- Branch before migration: `main`
- Migration branch: `feature/modular-platform`
- Zip backup: `backup-before-modular-platform.zip`

To inspect the original committed state:

```bash
git switch main
```

To return to migration work:

```bash
git switch feature/modular-platform
```
