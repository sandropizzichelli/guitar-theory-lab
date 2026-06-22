import { PageShell } from "../components/layout/PageShell.jsx";
import { usePageMeta } from "../lib/meta.js";
import { PlatformLink } from "../lib/router.jsx";

const roadmapItems = [
  "Scale and mode networks",
  "Transformational theory tools",
  "Fretboard set operations",
  "Improvisation process maps",
  "Exportable analysis views"
];

export function RoadmapPage() {
  usePageMeta({
    title: "Roadmap",
    description: "Future directions for Guitar Theory Lab modules and platform features.",
    path: "/roadmap"
  });

  return (
    <PageShell
      eyebrow="Roadmap"
      title="A growing laboratory"
      subtitle="GTL is designed as a modular platform. Future work will expand the connection between theory, fretboard logic, analysis, and improvisational practice."
      actions={<PlatformLink className="platform-button" to="/tools">Explore tools</PlatformLink>}
    >
      <section className="platform-section">
        <div className="platform-section-heading">
          <div>
            <p className="platform-eyebrow">Possible modules</p>
            <h2>Future directions</h2>
          </div>
          <p>No dates are promised. The platform will grow carefully around useful musical problems.</p>
        </div>
        <ul className="platform-feature-list platform-feature-list--cards">
          {roadmapItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
