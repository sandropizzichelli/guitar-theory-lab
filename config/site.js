const env = import.meta.env;

export const siteConfig = {
  name: env.SITE_NAME || env.VITE_SITE_NAME || "Guitar Theory Lab",
  shortName: "GTL",
  url: env.NEXT_PUBLIC_SITE_URL || env.VITE_SITE_URL || "https://guitartheorylab.com",
  description:
    env.NEXT_PUBLIC_APP_DESCRIPTION ||
    env.VITE_APP_DESCRIPTION ||
    "Advanced online tools for guitar theory, harmony, voice leading, set theory, and improvisational practice.",
  creator: "Sandro Pizzichelli"
};
