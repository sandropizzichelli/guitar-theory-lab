import { siteConfig } from "../../config/site";
import { getPublicTools } from "../../config/tools";
import { PageShell } from "../components/layout/PageShell.jsx";
import { ToolGrid } from "../components/tools/ToolGrid.jsx";
import { usePageMeta } from "../lib/meta.js";
import { PlatformLink } from "../lib/router.jsx";

export function HomePage() {
  const publicTools = getPublicTools();

  usePageMeta({
    title: siteConfig.name,
    description: siteConfig.description,
    path: "/"
  });

  return (
    <PageShell
      eyebrow="Guitar Theory Lab"
      title="Advanced tools for guitar theory, harmony, and improvisation."
      subtitle="Explore set classes, harmonic intersections, and voice-leading processes through interactive visual tools built for advanced musicians, teachers, and researchers."
      actions={
        <PlatformLink className="platform-button" to="/tools">Explore tools</PlatformLink>
      }
    >
      <section className="platform-signal-grid" aria-label="GTL principles">
        <article>
          <span className="platform-line-icon platform-line-icon--book" aria-hidden="true" />
          <h2>Academic</h2>
          <p>Rooted in theory and research.</p>
        </article>
        <article>
          <span className="platform-line-icon platform-line-icon--guitar" aria-hidden="true" />
          <h2>Musical</h2>
          <p>Designed around playable materials.</p>
        </article>
        <article>
          <span className="platform-line-icon platform-line-icon--nodes" aria-hidden="true" />
          <h2>Precise</h2>
          <p>Clear, balanced, and purposeful.</p>
        </article>
        <article>
          <span className="platform-line-icon platform-line-icon--circle" aria-hidden="true" />
          <h2>Expandable</h2>
          <p>Built as a growing laboratory.</p>
        </article>
      </section>

      <section className="platform-section">
        <div className="platform-section-heading">
          <div>
            <p className="platform-eyebrow">Available tools</p>
            <h2>Three modules are currently available.</h2>
          </div>
          <p>More tools will be added as the platform grows.</p>
        </div>
        <ToolGrid items={publicTools} />
      </section>

      <section className="platform-section platform-section--philosophy">
        <div className="platform-section-heading">
          <div>
            <p className="platform-eyebrow">Philosophy</p>
            <h2>Theory as a playable system</h2>
          </div>
        </div>
        <p>
          GTL connects abstract musical structures with practical exploration on the guitar. It is
          designed for musicians who think analytically and researchers who want tools that remain
          close to musical practice.
        </p>
        <div className="platform-roadmap-strip">
          <article>
            <h3>Analytical</h3>
            <p>Built for close musical thinking, not generic chord lookup.</p>
          </article>
          <article>
            <h3>Instrumental</h3>
            <p>Designed around the guitar as a space for visual, harmonic, and physical exploration.</p>
          </article>
          <article>
            <h3>Modular</h3>
            <p>Each tool is independent, but the platform is designed to connect them over time.</p>
          </article>
        </div>
      </section>

      <section className="platform-roadmap-strip platform-roadmap-strip--standalone">
        <article>
          <p className="platform-eyebrow">Roadmap</p>
          <h3>A growing laboratory</h3>
          <p>
            Future modules will expand the platform toward scale networks, transformational models,
            fretboard set operations, and improvisational process tools.
          </p>
        </article>
        <article>
          <p className="platform-eyebrow">Beta</p>
          <h3>Free while the first tools evolve</h3>
          <p>All current modules can be used without signing in.</p>
        </article>
      </section>
    </PageShell>
  );
}
