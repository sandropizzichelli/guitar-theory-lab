# Tool Architecture

## Registry

The central registry is `/config/tools.ts`.

Each tool entry defines:

- `id`
- `slug`
- `title`
- `shortTitle`
- `description`
- `longDescription`
- `category`
- `status`
- `version`
- `route`
- `icon`
- `isPublic`
- `isPro`
- `tags`
- `component`
- `createdAt`
- `updatedAt`

The platform reads this registry to generate:

- `/tools`
- `/tools/<toolSlug>`
- home-page tool cards
- future dashboard and navigation surfaces

## Adding a new tool

1. Create a source folder:

```text
/src/tools/my-new-tool
```

2. Add an `index.jsx` or `index.tsx` exporting the main component.

3. Add a `README.md` describing the tool.

4. Register the tool in `/config/tools.ts`.

5. Confirm that `/tools` shows the new card and `/tools/my-new-tool` opens the module.

## Status values

Allowed status values:

- `experimental`
- `alpha`
- `beta`
- `stable`
- `deprecated`

## Free / Pro

Use:

- `isPublic`
- `isPro`
- future feature metadata

Access helpers currently live in `/src/lib/auth.js`:

- `isProUser(user)`
- `canAccessTool(user, tool)`
- `canUseFeature(user, feature)`

## Current migration stage

The first implementation uses adapter modules under `/src/tools/*` that import the existing working tools from their legacy folders. This protects the tools while the platform structure is introduced.

Why `/src/tools` rather than a root `/tools` source directory: Vite serves source files directly in development. A physical root `/tools/<slug>` directory conflicts with the public SPA route `/tools/<slug>`. The public route remains `/tools/<slug>`; only the source folder is Vite-specific.

Future phases should move logic gradually:

- set-class logic into `/lib/set-theory`
- harmonic logic into `/lib/harmony` and `/lib/music-theory`
- Goodrick rotations and cycles into `/lib/voice-leading`
- shared fretboard utilities into `/lib/fretboard`
