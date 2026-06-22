export function isProUser(user) {
  return Boolean(user?.subscription?.status === "active" || user?.isPro);
}

export function canAccessTool(user, tool) {
  if (!tool.isPublic) return Boolean(user);
  if (!tool.isPro) return true;
  return isProUser(user);
}

export function canUseFeature(user, feature) {
  if (!feature?.isPro) return true;
  return isProUser(user);
}

export const authProvider = {
  name: "supabase",
  status: "placeholder"
};
