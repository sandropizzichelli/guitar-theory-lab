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
