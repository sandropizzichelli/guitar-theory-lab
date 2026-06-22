import { PageShell } from "../components/layout/PageShell.jsx";

export function AboutPage() {
  return (
    <PageShell eyebrow="About" title="Un laboratorio modulare per teoria, chitarra e improvvisazione.">
      <section className="platform-section platform-section--intro">
        <p>
          Guitar Theory Lab nasce come piattaforma indipendente per strumenti teorici avanzati:
          set theory, intersezioni armoniche, voice leading, trasformazioni sulla tastiera,
          materiali per docenti e pratiche di improvvisazione.
        </p>
      </section>
    </PageShell>
  );
}
