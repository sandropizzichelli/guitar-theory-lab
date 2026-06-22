import { PageShell } from "../components/layout/PageShell.jsx";
import { usePageMeta } from "../lib/meta.js";

export function AboutPage() {
  usePageMeta({
    title: "About",
    description: "Learn about Guitar Theory Lab, a modular platform for advanced musical exploration.",
    path: "/about"
  });

  return (
    <PageShell
      eyebrow="About"
      title="A modular platform for advanced musical exploration."
      subtitle="GTL brings together guitar-oriented thinking, post-tonal theory, harmonic analysis, and improvisational practice through interactive online tools."
    >
      <section className="platform-section platform-section--intro">
        <p>
          Guitar Theory Lab is designed for musicians, teachers, students, composers,
          improvisers, and researchers who want to move between abstract musical structures
          and playable materials.
        </p>
      </section>
      <section className="platform-section">
        <div className="platform-section-heading">
          <div>
            <p className="platform-eyebrow">Focus</p>
            <h2>The platform focuses on</h2>
          </div>
        </div>
        <ul className="platform-feature-list">
          <li>Pitch-class set theory</li>
          <li>Harmonic intersections</li>
          <li>Voice leading</li>
          <li>Fretboard visualization</li>
          <li>Improvisational processes</li>
          <li>Analytical practice</li>
        </ul>
      </section>
      <section className="platform-placeholder-card">
        <p className="platform-eyebrow">Creator</p>
        <h2>Created by Sandro Pizzichelli</h2>
        <p>Musician and musicologist.</p>
      </section>
    </PageShell>
  );
}
