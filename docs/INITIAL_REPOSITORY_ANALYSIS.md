# Initial Repository Analysis

Date: 2026-06-22

## Framework

All three existing tools are React applications built with Vite.

- Set Visualizer: React 19, Vite 8, JavaScript
- Harmonic Intersections: React 19, Vite 7, TypeScript
- Goodrick Voice Leading Visualizer: React 19, Vite 8, JavaScript

The platform root was not a Git repository before migration. Set Visualizer and Harmonic Intersections were already independent Git repositories. Goodrick Voice Leading Visualizer was not independently versioned.

## Current folder structure

- `/Set Visualizer`: set-class explorer application
- `/Harmonic Intersections`: harmonic-material comparison application
- `/Goodrick Voice Leading Visualizer`: Goodrick voice-leading application
- `/package.json`: former orchestration scripts for separate local apps
- `/README.md`: former instructions for running the three apps separately

## Where the three tools live

- Set-class Explorer: `/Set Visualizer/src/SetVisualizer.jsx`
- Harmonic Intersections: `/Harmonic Intersections/src/pages/MainExplorerPage.tsx`
- Goodrick Voice Leading Visualization: `/Goodrick Voice Leading Visualizer/src/App.jsx`

## Reusable musical logic

- Set theory: `/Set Visualizer/src/setUtils.js`, `/Set Visualizer/src/setData.js`
- Harmonic intersections: `/Harmonic Intersections/src/music`
- Fretboard mapping: `/Harmonic Intersections/src/music/fretboardMapper.ts`, `/Set Visualizer/src/Fretboard.jsx`, `/Goodrick Voice Leading Visualizer/src/CycleMapFretboard.jsx`
- Goodrick voice leading: `/Goodrick Voice Leading Visualizer/src/music.js`

## Duplicated logic

- Fretboard rendering exists separately in all three tools.
- Pitch-class and note-name logic exists in Set Visualizer and Harmonic Intersections.
- UI shell, controls, badges and panel patterns are duplicated.
- Each tool has its own body/global CSS, which is fragile when brought into one platform.

## Vercel dependencies

Only Harmonic Intersections has explicit Vercel project metadata and README references:

- `/Harmonic Intersections/.vercel`
- `/Harmonic Intersections/README.md`

The new root platform does not hardcode Vercel URLs.

## Scalability blockers

- Three separate dev servers and build outputs.
- No central route registry.
- No central metadata for title, status, version, category or Free/Pro access.
- No shared platform shell.
- No shared auth, billing, saved-item or deployment model.
- Global CSS can collide when tools are loaded together.
- Musical logic is still mixed with UI in several files.

## Refactoring needed before monetization

- Extract shared tool shell components from `/src/App.jsx`.
- Move reusable music logic into `/lib/*`.
- Replace placeholder Supabase and Stripe code with server-safe integration points.
- Add saved item persistence and row-level security.
- Add export pipeline for PDF/image generation.
- Add real feature flags for Pro-only actions.

## Riskiest files

- `/Goodrick Voice Leading Visualizer/src/music.js`: core Goodrick logic and currently under active correction.
- `/Goodrick Voice Leading Visualizer/src/App.jsx`: tool state and selector logic.
- `/Harmonic Intersections/src/pages/MainExplorerPage.tsx`: large stateful tool component.
- `/Set Visualizer/src/GenericSetPage.jsx`: shared set-class page logic.
- Global CSS files in all three apps.

## Parts to preserve

- The current working Goodrick visualizer logic and tests.
- Set Visualizer set-data and Forte mappings.
- Harmonic Intersections music generators and tests.
- Legacy scripts for opening and comparing the three original tools.
