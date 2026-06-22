const TIER_RANK = {
  free: 0,
  pro: 1,
  teacher: 2,
  institution: 3
};

export function getCurrentUser() {
  return null;
}

export function getUserTier(user) {
  if (!user) return "free";
  if (user.subscription?.status !== "active" && !user.isPro) return "free";
  return user.subscription?.tier || user.plan || (user.isPro ? "pro" : "free");
}

export function hasTier(user, requiredTier = "free") {
  const currentRank = TIER_RANK[getUserTier(user)] ?? 0;
  const requiredRank = TIER_RANK[requiredTier] ?? 0;
  return currentRank >= requiredRank;
}

export function isProUser(user) {
  return hasTier(user, "pro");
}

export function canAccessTool(user, tool) {
  if (!tool.isPublic) return Boolean(user);
  if (!tool.isPro) return true;
  return isProUser(user);
}

export function canUseFeature(user, feature) {
  if (!feature) return false;
  return hasTier(user, feature.tier || (feature.isPro ? "pro" : "free"));
}

export const authProvider = {
  name: "supabase",
  status: "placeholder",
  requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]
};
