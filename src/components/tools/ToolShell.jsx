import { lazy, Suspense, useEffect, useMemo } from "react";
import { siteConfig } from "../../../config/site";
import { canAccessTool } from "../../lib/auth.js";
import { PageShell } from "../layout/PageShell.jsx";
import { ProBadge, StatusBadge } from "./ToolBadges.jsx";

export function ToolShell({ tool }) {
  const ToolComponent = useMemo(() => lazy(tool.component), [tool]);

  useEffect(() => {
    document.title = `${tool.title} | ${siteConfig.name}`;
    const description = document.querySelector("meta[name='description']");
    description?.setAttribute("content", tool.description);
  }, [tool]);

  if (!canAccessTool(null, tool)) {
    return (
      <PageShell eyebrow="Accesso" title="Tool non disponibile">
        <p>Questo strumento non e disponibile con il profilo attuale.</p>
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

      <section className="platform-tool-actions" aria-label="Future tool actions">
        <button type="button" disabled>Save</button>
        <button type="button" disabled>Export</button>
        <button type="button" disabled>Share</button>
      </section>

      <section className="platform-tool-host">
        <Suspense fallback={<div className="platform-loading">Caricamento tool...</div>}>
          <ToolComponent />
        </Suspense>
      </section>
    </main>
  );
}
