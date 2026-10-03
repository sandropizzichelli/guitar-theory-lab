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
/* /index.html 200
```

This keeps direct reloads working for routes like:

- `/tools`
- `/tools/set-class-explorer`
- `/tools/harmonic-intersections`
- `/tools/goodrick-voice-leading-visualization`

## First deploy checklist

1. Push this repository to GitHub.
2. Create a Cloudflare Pages project from the GitHub repository.
3. Set build command and output directory.
4. Add environment variables.
5. Deploy.
6. Add custom domains.
7. Test direct page reloads on the three tool routes.

## Verified repository connection — 2026-10-03

- GitHub repository: `sandropizzichelli/guitar-theory-lab`.
- GitHub default branch: `main`.
- Cloudflare Pages project: `guitar-theory-lab`, identified by the GitHub check details URL.
- GitHub check `Cloudflare Pages`, provided by `Cloudflare Workers and Pages`, reports `success` for commit `73359c477da2f95f4ac2cfd5244e2050f6a74450`.
- [Verified deployment details](https://dash.cloudflare.com/?to=/08e07ecde5b14febeb88c8442e50c6be/pages/view/guitar-theory-lab/8fb604e8-83fc-4e6f-96df-1bae524bd6a9).
- The user confirms the public site corresponds to the latest developed version.

The production branch setting has not been read directly from the Cloudflare dashboard. Confirm it before the next publication; GitHub's default branch alone does not establish this setting. The build settings above remain the documented settings, rather than independently verified dashboard values.

The local working branch is now `main`, tracking `origin/main`. The original pre-migration branch is preserved as `archive/pre-modular-platform` at `9864ed5`. No publication was triggered by this cleanup.
