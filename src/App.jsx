import { getToolBySlug } from "../config/tools";
import { PlatformNav } from "./components/navigation/PlatformNav.jsx";
import { ToolShell } from "./components/tools/ToolShell.jsx";
import { useCurrentPath } from "./lib/router.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { PricingPage } from "./pages/PricingPage.jsx";
import { ToolsPage } from "./pages/ToolsPage.jsx";

function RouteRenderer({ path }) {
  if (path === "/") return <HomePage />;
  if (path === "/tools") return <ToolsPage />;
  if (path === "/pricing") return <PricingPage />;
  if (path === "/login") return <LoginPage />;
  if (path === "/dashboard") return <DashboardPage />;
  if (path === "/about") return <AboutPage />;

  const toolMatch = path.match(/^\/tools\/([^/]+)$/);
  if (toolMatch) {
    const tool = getToolBySlug(toolMatch[1]);
    return tool ? <ToolShell tool={tool} /> : <NotFoundPage />;
  }

  return <NotFoundPage />;
}

export default function App() {
  const path = useCurrentPath();

  return (
    <div className="platform-root">
      <PlatformNav path={path} />
      <RouteRenderer path={path} />
    </div>
  );
}
