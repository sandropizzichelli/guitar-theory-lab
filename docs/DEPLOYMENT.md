# Deployment

## Local production build

```bash
npm install
npm run build
npm run preview
```

Development server:

```bash
npm run dev
```

Local development URL:

```text
http://127.0.0.1:5180/
```

## Docker

Run:

```bash
docker compose up -d
```

The app is served on:

```text
http://127.0.0.1:8080/
```

Optional build-time metadata:

```bash
SITE_NAME="Guitar Theory Lab" \
NEXT_PUBLIC_SITE_URL="https://your-domain.example" \
docker compose up -d --build
```

## VPS deployment

1. Copy the repository to the VPS.
2. Optionally create `.env` or export build-time variables for the public domain.
3. Run `docker compose up -d --build`.
4. Point the public domain DNS record to the VPS IP.
5. Put Caddy or Nginx in front of port `8080`.

## Caddy reverse proxy example

```text
your-domain.example {
  reverse_proxy 127.0.0.1:8080
}
```

Caddy will manage HTTPS automatically.

## Nginx reverse proxy example

```text
server {
  listen 80;
  server_name your-domain.example;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Use Certbot or another ACME client for HTTPS.

## Backups

- Keep Git commits before each risky migration.
- Keep database backups once Supabase or another database is active.
- Keep exportable snapshots of user saved items once the feature exists.
