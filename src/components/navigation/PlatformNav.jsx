import { navigationItems } from "../../../config/navigation";
import { BrandMark } from "../brand/BrandMark.jsx";
import { PlatformLink } from "../../lib/router.jsx";

export function PlatformNav({ path }) {
  return (
    <header className="platform-nav">
      <PlatformLink className="platform-brand" to="/" ariaLabel="Guitar Theory Lab home">
        <BrandMark />
      </PlatformLink>
      <nav aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <PlatformLink
            className={path === item.route ? "active" : ""}
            key={item.route}
            title={item.state === "soon" ? "Coming soon" : undefined}
            to={item.route}
          >
            {item.label}
            {item.state === "soon" && <span className="platform-nav__soon">Soon</span>}
          </PlatformLink>
        ))}
      </nav>
      <PlatformLink className="platform-button platform-button--ghost" to="/login">
        Login
      </PlatformLink>
    </header>
  );
}
