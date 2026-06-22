async function clearBrowserCaches() {
  if (!("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
}

function reloadWithoutServiceWorker() {
  const url = new URL(window.location.href);
  if (url.searchParams.has("sw-reset")) return;
  url.searchParams.set("sw-reset", Date.now().toString());
  window.location.replace(url.toString());
}

export async function prepareBrowserRuntime() {
  if (import.meta.env.DEV) return true;
  if (!("serviceWorker" in navigator)) return true;

  try {
    const wasControlled = Boolean(navigator.serviceWorker.controller);
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    await clearBrowserCaches();

    if (wasControlled) {
      reloadWithoutServiceWorker();
      return false;
    }
  } catch {
    // Cache cleanup should never prevent the application from loading.
  }

  return true;
}
