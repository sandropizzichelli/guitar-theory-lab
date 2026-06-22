import { siteConfig } from "../../../config/site";
import { PlatformLink } from "../../lib/router.jsx";
import { BrandMark } from "../brand/BrandMark.jsx";

const footerLinks = [
  { label: "Tools", route: "/tools" },
  { label: "Roadmap", route: "/roadmap" },
  { label: "Pricing", route: "/pricing" },
  { label: "About", route: "/about" }
];

export function PlatformFooter() {
  return (
    <footer className="platform-footer">
      <div>
        <BrandMark />
        <p>{siteConfig.description}</p>
        <p className="platform-footer__credit">Created by {siteConfig.creator}</p>
      </div>
      <nav aria-label="Footer navigation">
        {footerLinks.map((item) => (
          <PlatformLink key={item.label} to={item.route}>
            {item.label}
          </PlatformLink>
        ))}
      </nav>
    </footer>
  );
}
