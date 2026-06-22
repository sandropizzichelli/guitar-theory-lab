import { PageShell } from "../components/layout/PageShell.jsx";
import { usePageMeta } from "../lib/meta.js";
import { PlatformLink } from "../lib/router.jsx";

export function DashboardPage() {
  usePageMeta({
    title: "Dashboard",
    description: "The Guitar Theory Lab dashboard is coming soon.",
    path: "/dashboard"
  });

  return (
    <PageShell eyebrow="Dashboard" title="Dashboard coming soon">
      <section className="platform-placeholder-card">
        <p>
          In the future, the dashboard may include saved analyses, custom tool settings,
          export history, and personal workspaces.
        </p>
        <PlatformLink className="platform-button platform-button--secondary" to="/tools">
          Go to tools
        </PlatformLink>
      </section>
    </PageShell>
  );
}
