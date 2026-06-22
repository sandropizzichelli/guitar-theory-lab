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
            to={item.route}
          >
            {item.label}
          </PlatformLink>
        ))}
      </nav>
    </header>
  );
}
