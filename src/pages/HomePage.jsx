import { useEffect } from "react";
import { siteConfig } from "../../config/site";
import { getPublicTools } from "../../config/tools";
import { PageShell } from "../components/layout/PageShell.jsx";
import { ToolGrid } from "../components/tools/ToolGrid.jsx";
import { PlatformLink } from "../lib/router.jsx";

export function HomePage() {
  const publicTools = getPublicTools();

  useEffect(() => {
    document.title = siteConfig.name;
  }, []);

  return (
    <PageShell
      eyebrow="Guitar Theory Lab"
      title="Advanced online tools for guitar theory, harmonic exploration, voice leading, set theory and improvisational practice."
      actions={<PlatformLink className="platform-button" to="/tools">Explore tools</PlatformLink>}
    >
      <section className="platform-section platform-section--intro">
        <p>
          Una piattaforma modulare per chitarristi avanzati, docenti, studenti di conservatorio,
          improvvisatori, compositori, musicologi e ricercatori. I primi strumenti sono solo l'inizio:
          la struttura e pensata per accogliere nuovi laboratori teorici, analitici e chitarristici.
        </p>
      </section>

      <section className="platform-section">
        <div className="platform-section-heading">
          <p className="platform-eyebrow">Available modules</p>
          <h2>Strumenti disponibili</h2>
        </div>
        <ToolGrid items={publicTools} />
      </section>

      <section className="platform-roadmap-strip">
        <article>
          <h3>In sviluppo</h3>
          <p>Salvataggi, export, librerie personali, nuovi tool e funzioni Pro.</p>
        </article>
        <article>
          <h3>Free / Pro</h3>
          <p>La base resta accessibile; le funzioni avanzate saranno predisposte in modo graduale.</p>
        </article>
        <article>
          <h3>Indipendente</h3>
          <p>Dominio configurabile, Docker e deploy portabile fuori da Vercel.</p>
        </article>
      </section>
    </PageShell>
  );
}
