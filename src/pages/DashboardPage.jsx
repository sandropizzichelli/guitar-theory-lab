import { PageShell } from "../components/layout/PageShell.jsx";
import { PlatformLink } from "../lib/router.jsx";

export function DashboardPage() {
  return (
    <PageShell eyebrow="Dashboard" title="Area personale placeholder.">
      <section className="platform-placeholder-card">
        <p>
          La dashboard sara protetta quando Supabase sara attivo. In futuro mostrera profilo,
          salvataggi, librerie personali e stato Pro.
        </p>
        <PlatformLink className="platform-button platform-button--secondary" to="/login">Login placeholder</PlatformLink>
      </section>
    </PageShell>
  );
}
