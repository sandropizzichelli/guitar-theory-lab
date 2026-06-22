import { useEffect, useState } from "react";

export function getCurrentPath() {
  return window.location.pathname || "/";
}

export function navigateTo(route) {
  if (route === getCurrentPath()) return;

  window.history.pushState({}, "", route);
  window.dispatchEvent(new Event("platform:navigate"));
}

export function useCurrentPath() {
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    const handleNavigation = () => setPath(getCurrentPath());
    window.addEventListener("popstate", handleNavigation);
    window.addEventListener("platform:navigate", handleNavigation);

    return () => {
      window.removeEventListener("popstate", handleNavigation);
      window.removeEventListener("platform:navigate", handleNavigation);
    };
  }, []);

  return path;
}

export function PlatformLink({ to, children, className }) {
  return (
    <a
      className={className}
      href={to}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(to);
      }}
    >
      {children}
    </a>
  );
}
