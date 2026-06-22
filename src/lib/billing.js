export const billingProvider = {
  name: "stripe",
  status: "placeholder",
  requiredEnv: [
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY",
    "NEXT_PUBLIC_STRIPE_PRICE_ID_YEARLY"
  ]
};

export async function createCheckoutSession() {
  throw new Error("Stripe Checkout is not configured yet.");
}

export async function handleStripeWebhook() {
  throw new Error("Stripe webhook handling is not configured yet.");
}
