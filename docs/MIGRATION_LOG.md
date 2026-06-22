# Migration Log

## 2026-06-22

### Initial state

- The parent folder was not a Git repository.
- Set Visualizer and Harmonic Intersections were already Git repositories.
- Goodrick Voice Leading Visualizer was not a Git repository.
- The parent package only coordinated three separate Vite apps.

### Safety actions

- Created `backup-before-modular-platform.zip`.
- Initialized Git at `/Users/silvialumaca/Desktop/Guitar Software Series`.
- Created commit `backup: current working version`.
- Created branch `feature/modular-platform`.

### Changes made

- Added root Vite/React platform.
- Added central tool registry in `/config/tools.ts`.
- Added routes for home, tools, individual tools, dashboard, pricing, login and about.
- Added tool shell with status, version and placeholder Save/Export/Share actions.
- Added legacy adapters for the three current tools.
- Moved source adapters under `/src/tools` so Vite dev routing does not conflict with public `/tools/<slug>` URLs.
- Added PWA manifest, placeholder icon, robots file, sitemap and service worker.
- Added Dockerfile, Docker Compose and Nginx static fallback config.
- Added `.env.example` for site, Supabase and Stripe variables.
- Added documentation for architecture, deployment, roadmap and monetization.

## 2026-06-22, phase 2

### Changes made

- Extracted platform navigation, page shell and tool UI components out of `/src/App.jsx`.
- Added dedicated page modules under `/src/pages`.
- Changed tool registry component entries to lazy import functions.
- Added Suspense loading state inside `ToolShell`.

### Why

The platform shell must remain maintainable as more tools are added. Lazy tool loading also reduces global CSS collision risk because legacy tool code and styles are loaded only when a tool route is opened.

### Manual checks required

- Confirm the home and `/tools` pages do not load legacy tool CSS unexpectedly.
- Confirm direct reload works on each `/tools/<slug>` route.

## 2026-06-22, phase 3

### Changes made

- Added feature/tier registry in `/config/features.js`.
- Expanded auth placeholders with tier helpers and dashboard access guard.
- Added saved-item draft helpers in `/src/lib/savedItems.js`.
- Added Supabase schema for `profiles` and generic `saved_items`.
- Added auth/data/billing documentation.

### Why

The platform needs clear contracts for future login, saved materials and Pro access before a real backend is connected.

## 2026-06-22, phase 4

### Changes made

- Updated Docker build args so `docker compose up -d` can start without a committed `.env` file.
- Kept domain and app metadata configurable at build time.

### Why

The Docker path must be portable and should not fail just because a local `.env` has not been created yet.

### Why

The platform must become a modular, expandable product rather than three isolated tools.
The adapter approach keeps current tools working while the architecture is introduced.

### Problems encountered

- Two tools are nested Git repositories, so the parent commit tracks them as embedded repositories rather than full source contents.
- The full backup zip is the additional safety net for the current complete folder state.
- The three tools have global CSS; future extraction should isolate styles more cleanly.
- A root `/tools` source directory conflicts with Vite dev routing, so the source modules live under `/src/tools`.

### Manual checks required

- Home route: `/`
- Tools route: `/tools`
- Set-class route: `/tools/set-class-explorer`
- Harmonic route: `/tools/harmonic-intersections`
- Goodrick route: `/tools/goodrick-voice-leading-visualization`
- Pricing route: `/pricing`
- Login route: `/login`
- Dashboard route: `/dashboard`
- PWA installability in production build
- Docker container startup

### Left in suspense

- Real Supabase auth integration.
- Real database schema and saved-item persistence.
- Real Stripe checkout and webhook.
- Full extraction of music logic into `/lib`.
- Full extraction of platform UI components out of `/src/App.jsx`.
- CSS isolation between legacy tools.
