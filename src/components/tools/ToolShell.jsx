import { lazy, Suspense, useMemo } from "react";
import { canAccessTool } from "../../lib/auth.js";
import { usePageMeta } from "../../lib/meta.js";
import { PageShell } from "../layout/PageShell.jsx";
import { ProBadge, StatusBadge } from "./ToolBadges.jsx";

export function ToolShell({ tool }) {
  const ToolComponent = useMemo(() => lazy(tool.component), [tool]);

  usePageMeta({
    title: tool.title,
    description: tool.description,
    path: tool.route
  });

  if (!canAccessTool(null, tool)) {
    return (
      <PageShell eyebrow="Access" title="Tool unavailable">
        <p>This tool is not available with the current access level.</p>
      </PageShell>
    );
  }

  return (
    <main className="platform-tool-shell">
      <section className="platform-tool-header">
        <div>
          <p className="platform-eyebrow">{tool.category}</p>
          <h1>{tool.title}</h1>
          <p>{tool.description}</p>
        </div>
        <div className="platform-tool-meta">
          <StatusBadge status={tool.status} />
          <ProBadge isPro={tool.isPro} />
          <span>v{tool.version}</span>
        </div>
      </section>

      <section className="platform-tool-host">
        <Suspense fallback={<div className="platform-loading">Loading tool...</div>}>
          <ToolComponent />
        </Suspense>
      </section>
    </main>
  );
}
