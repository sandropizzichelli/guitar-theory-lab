import { PlatformLink } from "../../lib/router.jsx";
import { ProBadge, StatusBadge } from "./ToolBadges.jsx";

export function ToolCard({ tool }) {
  return (
    <article className="platform-tool-card">
      <div className="platform-tool-card__top">
        <StatusBadge status={tool.status} />
        <ProBadge isPro={tool.isPro} />
      </div>
      <h3>{tool.title}</h3>
      <p>{tool.description}</p>
      <div className="platform-tags">
        {tool.tags.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <PlatformLink className="platform-button platform-button--small" to={tool.route}>
        Open tool
      </PlatformLink>
    </article>
  );
}
