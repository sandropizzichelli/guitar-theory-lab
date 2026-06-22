const env = import.meta.env;

export const siteConfig = {
  name: env.SITE_NAME || env.VITE_SITE_NAME || "Guitar Theory Lab",
  url: env.NEXT_PUBLIC_SITE_URL || env.VITE_SITE_URL || "http://localhost:5173",
  description:
    env.NEXT_PUBLIC_APP_DESCRIPTION ||
    env.VITE_APP_DESCRIPTION ||
    "Advanced online tools for guitar theory, harmonic exploration, voice leading, set theory and improvisational practice."
};
