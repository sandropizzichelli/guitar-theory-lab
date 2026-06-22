import { PageShell } from "../components/layout/PageShell.jsx";
import { PlatformLink } from "../lib/router.jsx";

export function NotFoundPage() {
  return (
    <PageShell eyebrow="404" title="Pagina non trovata">
      <PlatformLink className="platform-button" to="/tools">Vai agli strumenti</PlatformLink>
    </PageShell>
  );
}
