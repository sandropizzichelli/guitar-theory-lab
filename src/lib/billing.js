export const billingProvider = {
  name: "stripe",
  status: "placeholder"
};

export async function createCheckoutSession() {
  throw new Error("Stripe Checkout is not configured yet.");
}

export async function handleStripeWebhook() {
  throw new Error("Stripe webhook handling is not configured yet.");
}
