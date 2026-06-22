import { PageShell } from "../components/layout/PageShell.jsx";
import { usePageMeta } from "../lib/meta.js";
import { PlatformLink } from "../lib/router.jsx";

export function LoginPage() {
  usePageMeta({
    title: "Login",
    description: "Accounts are not available yet. All current Guitar Theory Lab tools can be used without signing in.",
    path: "/login"
  });

  return (
    <PageShell eyebrow="Login" title="Accounts are not available yet">
      <section className="platform-placeholder-card">
        <p>
          All current tools can be used without signing in. Accounts may be added later for saved
          workspaces, exports, and personal settings.
        </p>
        <PlatformLink className="platform-button platform-button--secondary" to="/tools">
          Go to tools
        </PlatformLink>
      </section>
    </PageShell>
  );
}
