import { PlatformLink } from "../../lib/router.jsx";
import { ProBadge, StatusBadge } from "./ToolBadges.jsx";

export function ToolCard({ tool, variant = "default" }) {
  return (
    <PlatformLink
      ariaLabel={`Open ${tool.title}`}
      className={`platform-tool-card platform-tool-card--${variant}`}
      to={tool.route}
    >
      <div className="platform-tool-card__top">
        <StatusBadge status={tool.status} />
        <ProBadge isPro={tool.isPro} />
      </div>
      <h3>{tool.title}</h3>
      <p>{tool.description}</p>
      {variant === "detailed" && (
        <div className="platform-tool-card__features">
          <span>Key features</span>
          <ul>
            {(tool.keyFeatures ?? tool.tags.slice(0, 4)).map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="platform-tags">
        {(tool.usefulFor ?? tool.tags.slice(0, 3)).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <span className="platform-button platform-button--small">
        Open tool
      </span>
    </PlatformLink>
  );
}
