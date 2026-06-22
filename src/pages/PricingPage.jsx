import { pricingPlans } from "../../config/pricing";
import { PageShell } from "../components/layout/PageShell.jsx";
import { usePageMeta } from "../lib/meta.js";
import { PlatformLink } from "../lib/router.jsx";

export function PricingPage() {
  usePageMeta({
    title: "Pricing",
    description: "Guitar Theory Lab is currently free while the first tools are in beta.",
    path: "/pricing"
  });

  return (
    <PageShell
      eyebrow="Pricing"
      title="Guitar Theory Lab is currently free."
      subtitle="All current tools are available while the first modules are in beta."
    >
      <section className="platform-pricing-grid">
        {pricingPlans.map((plan) => (
          <article className="platform-pricing-card" key={plan.id}>
            <h2>{plan.title}</h2>
            <p className="platform-price">{plan.price}</p>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <PlatformLink className="platform-button platform-button--small" to="/tools">
              Explore tools
            </PlatformLink>
          </article>
        ))}
      </section>
      <section className="platform-placeholder-card">
        <p>
          A paid plan may be introduced later to support advanced features, saved workspaces,
          exports, and continued development.
        </p>
      </section>
    </PageShell>
  );
}
