import { siteConfig } from "../../config/site";
import { getPublicTools } from "../../config/tools";
import { PageShell } from "../components/layout/PageShell.jsx";
import { ToolGrid } from "../components/tools/ToolGrid.jsx";
import { canAccessTool } from "../lib/auth.js";
import { usePageMeta } from "../lib/meta.js";

const homeDescriptions = {
  "set-class-explorer": "Explore pitch-class sets, prime forms, interval vectors, and fretboard shapes.",
  "harmonic-intersections": "Find shared notes between scales, chords, and modes on the fretboard.",
  "goodrick-voice-leading-visualization": "Explore voice leading through triads, seventh chords, and string sets."
};

export function HomePage() {
  const publicTools = getPublicTools();
  const freeBetaAccess = publicTools.length > 0 && publicTools.every(
    (tool) => ["alpha", "beta"].includes(tool.status) && !tool.isPro && canAccessTool(null, tool)
  );

  usePageMeta({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/"
  });

  return (
    <PageShell
      variant="home"
      title="Explore guitar theory."
      subtitle="Interactive tools for set theory, harmony, and voice leading on guitar."
    >
      <section className="platform-home-tools" aria-labelledby="home-tools-heading">
        <div className="platform-section-heading">
          <h2 id="home-tools-heading">Tools</h2>
          {freeBetaAccess && <p className="platform-home-access">Free to use. No sign-in required.</p>}
        </div>
        <ToolGrid
          variant="home"
          items={publicTools.map((tool) => ({
            ...tool,
            description: homeDescriptions[tool.id] ?? tool.description
          }))}
        />
      </section>
    </PageShell>
  );
}
