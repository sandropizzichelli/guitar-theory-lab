import { useEffect } from "react";
import { siteConfig } from "../../config/site";

function setMetaAttribute(selector, attribute, value) {
  const element = document.querySelector(selector);
  element?.setAttribute(attribute, value);
}

export function usePageMeta({ title, description = siteConfig.description, path = "/" }) {
  useEffect(() => {
    const fullTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;
    const canonicalUrl = `${siteConfig.url}${path === "/" ? "" : path}`;

    document.title = fullTitle;
    setMetaAttribute("meta[name='description']", "content", description);
    setMetaAttribute("meta[property='og:title']", "content", fullTitle);
    setMetaAttribute("meta[property='og:description']", "content", description);
    setMetaAttribute("meta[property='og:url']", "content", canonicalUrl);
    setMetaAttribute("meta[name='twitter:title']", "content", fullTitle);
    setMetaAttribute("meta[name='twitter:description']", "content", description);
  }, [description, path, title]);
}
