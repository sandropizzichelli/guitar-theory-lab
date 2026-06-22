import { pricingPlans } from "../../config/pricing";
import { PageShell } from "../components/layout/PageShell.jsx";

export function PricingPage() {
  return (
    <PageShell eyebrow="Pricing" title="Piani predisposti per una piattaforma Free / Pro.">
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
            <button type="button" disabled>Checkout placeholder</button>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
