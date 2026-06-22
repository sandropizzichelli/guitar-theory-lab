import { navigationItems } from "../../../config/navigation";
import { siteConfig } from "../../../config/site";
import { PlatformLink } from "../../lib/router.jsx";

export function PlatformNav({ path }) {
  return (
    <header className="platform-nav">
      <PlatformLink className="platform-brand" to="/">
        <span>{siteConfig.name}</span>
      </PlatformLink>
      <nav>
        {navigationItems.map((item) => (
          <PlatformLink
            className={path === item.route ? "active" : ""}
            key={item.route}
            to={item.route}
          >
            {item.label}
          </PlatformLink>
        ))}
      </nav>
      <PlatformLink className="platform-button platform-button--ghost" to="/login">
        Login
      </PlatformLink>
    </header>
  );
}
