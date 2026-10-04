# Cloudflare Pages

## Project settings

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node.js version: 22

## Environment variables

```text
SITE_NAME=Guitar Theory Lab
NEXT_PUBLIC_SITE_URL=https://guitartheorylab.com
NEXT_PUBLIC_APP_DESCRIPTION=Advanced online tools for guitar theory, harmonic exploration, voice leading, set theory and improvisational practice.
```

## Custom domains

Add:

- `guitartheorylab.com`
- `www.guitartheorylab.com`

Cloudflare Pages should create the DNS records automatically because the domain is registered in the same Cloudflare account.

## SPA routes

`/public/_redirects` contains:

```text
/tools/voicing-lab /tools/voicing-explorer 301
/tools/voicing-lab/ /tools/voicing-explorer 301
/* /index.html 200
```

This keeps direct reloads working for routes like:

- `/tools`
- `/tools/set-class-explorer`
- `/tools/harmonic-intersections`
- `/tools/goodrick-voice-leading-visualization`
- `/tools/voicing-explorer`

## First deploy checklist

1. Push this repository to GitHub.
2. Create a Cloudflare Pages project from the GitHub repository.
3. Set build command and output directory.
4. Add environment variables.
5. Deploy.
6. Add custom domains.
7. Test direct page reloads on the four tool routes.

## Verified repository connection — 2026-10-03

- GitHub repository: `sandropizzichelli/guitar-theory-lab`.
- GitHub default branch: `main`.
- Cloudflare Pages project: `guitar-theory-lab`, identified by the GitHub check details URL.
- GitHub check `Cloudflare Pages`, provided by `Cloudflare Workers and Pages`, reports `success` for commit `73359c477da2f95f4ac2cfd5244e2050f6a74450`.
- [Verified deployment details](https://dash.cloudflare.com/?to=/08e07ecde5b14febeb88c8442e50c6be/pages/view/guitar-theory-lab/8fb604e8-83fc-4e6f-96df-1bae524bd6a9).
- The user confirms the public site corresponds to the latest developed version.

The production branch setting has not been read directly from the Cloudflare dashboard. Confirm it before the next publication; GitHub's default branch alone does not establish this setting. The build settings above remain the documented settings, rather than independently verified dashboard values.

The local working branch is now `main`, tracking `origin/main`. The original pre-migration branch is preserved as `archive/pre-modular-platform` at `9864ed5`. No publication was triggered by this cleanup.

## Release preparation — 2026-10-04

Voicing Explorer is included in the production registry. Its former route uses Cloudflare Pages redirects before the SPA fallback, plus a client-side fallback that preserves the query string and fragment. The release browser tests support `GTL_TEST_BASE_URL=http://127.0.0.1:4173` to exercise the production build instead of the dev server. The actual Cloudflare production branch must still be confirmed before push; the latest successful remote check points to project `guitar-theory-lab`, deployment `4933bb65-7160-4819-9d91-bf4a34a7a3f5`, commit `3cf7f86`.


### Pre-publication validation

- Production build includes all four tools, including the Voicing Explorer chunk.
- Production preview at port 4173: the 64 existing browser regressions passed; five release checks cover four homepage/catalog cards at 1440/390/320 px, the old route with query/fragment preservation, direct openings and reloads. A selector error in the new card test was corrected and all five release checks repeated successfully.
- 32 musical/persistence tests passed (25 Voicing Explorer, seven Set-class); 54 standalone tests passed, with no standalone source changes.
- Set-class production checks include input 0–24, browser persistence, clearing, invalid saved data, and separation from catalog state.
- Fetch confirms five prior local commits and no remote-only commits before this release commit. No force push is needed.
- Publication is pending verification of the actual Cloudflare production branch. The existing authenticated Chrome dashboard is inaccessible while the Mac is locked; no push has been performed. The GitHub check confirms the project identity, but does not by itself confirm its current production branch setting.
