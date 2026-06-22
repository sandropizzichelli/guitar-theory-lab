import { PageShell } from "../components/layout/PageShell.jsx";
import { getCurrentUser } from "../lib/auth.js";
import { PlatformLink } from "../lib/router.jsx";

export function DashboardPage() {
  const user = getCurrentUser();

  if (!user) {
    return (
      <PageShell eyebrow="Dashboard" title="Accesso richiesto">
        <section className="platform-placeholder-card">
          <p>
            La dashboard e gia trattata come area protetta. Quando Supabase sara attivo,
            qui verranno mostrati profilo, salvataggi e stato abbonamento.
          </p>
          <PlatformLink className="platform-button platform-button--secondary" to="/login">Vai al login</PlatformLink>
        </section>
      </PageShell>
    );
  }

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
