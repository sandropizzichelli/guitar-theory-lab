import { PageShell } from "../components/layout/PageShell.jsx";
import { usePageMeta } from "../lib/meta.js";
import { PlatformLink } from "../lib/router.jsx";

export function NotFoundPage() {
  usePageMeta({
    title: "Page not found",
    description: "The requested Guitar Theory Lab page could not be found.",
    path: "/404"
  });

  return (
    <PageShell eyebrow="404" title="Page not found">
      <section className="platform-placeholder-card">
        <p>The page you are looking for is not available.</p>
        <PlatformLink className="platform-button" to="/tools">Back to tools</PlatformLink>
      </section>
    </PageShell>
  );
}
