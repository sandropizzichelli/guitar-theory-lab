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

  const isSetExplorer = tool.id === "set-class-explorer";
  const isHarmonic = tool.id === "harmonic-intersections";
  const isGoodrick = tool.id === "goodrick-voice-leading-visualization";
  const isVoicing = tool.id === "voicing-lab";
  const compactHeader = isSetExplorer || isHarmonic || isGoodrick || isVoicing;

  return (
    <main className={`platform-tool-shell${isSetExplorer ? " platform-tool-shell--sets" : isHarmonic ? " platform-tool-shell--harmonic" : isGoodrick ? " platform-tool-shell--goodrick" : isVoicing ? " platform-tool-shell--voicing" : ""}`}>
      <section className="platform-tool-header">
        <div>
          {!compactHeader && <p className="platform-eyebrow">{tool.category}</p>}
          <h1>{tool.title}</h1>
          <p>{isSetExplorer ? "Explore pitch-class sets, interval vectors, and playable guitar forms." : isHarmonic ? "Compare scales, arpeggios, and pentatonics on the guitar fretboard." : isGoodrick ? "Explore chord cycles, inversions, and voice-leading paths on guitar." : tool.description}</p>
        </div>
        {!compactHeader && <div className="platform-tool-meta">
          <StatusBadge status={tool.status} />
          <ProBadge isPro={tool.isPro} />
          <span>v{tool.version}</span>
        </div>}
      </section>

      <section className="platform-tool-host">
        <Suspense fallback={<div className="platform-loading">Loading tool...</div>}>
          <ToolComponent />
        </Suspense>
      </section>
    </main>
  );
}
