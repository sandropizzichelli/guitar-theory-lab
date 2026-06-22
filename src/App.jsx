import { useEffect, useMemo, useState } from "react";
import { navigationItems } from "../config/navigation";
import { pricingPlans } from "../config/pricing";
import { siteConfig } from "../config/site";
import { getPublicTools, getToolBySlug, tools } from "../config/tools";
import { canAccessTool } from "./lib/auth.js";

function getCurrentPath() {
  return window.location.pathname || "/";
}

function navigateTo(route) {
  window.history.pushState({}, "", route);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function PlatformLink({ to, children, className }) {
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

function StatusBadge({ status }) {
  return <span className={`platform-badge platform-badge--${status}`}>{status}</span>;
}

function ProBadge({ isPro }) {
  return <span className="platform-pill">{isPro ? "Pro" : "Free"}</span>;
}

function ToolCard({ tool }) {
  return (
    <article className="platform-tool-card">
      <div className="platform-tool-card__top">
        <StatusBadge status={tool.status} />
        <ProBadge isPro={tool.isPro} />
      </div>
      <h3>{tool.title}</h3>
      <p>{tool.description}</p>
      <div className="platform-tags">
        {tool.tags.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <PlatformLink className="platform-button platform-button--small" to={tool.route}>
        Open tool
      </PlatformLink>
    </article>
  );
}

function ToolGrid({ items }) {
  return (
    <div className="platform-tool-grid">
      {items.map((tool) => (
        <ToolCard tool={tool} key={tool.id} />
      ))}
    </div>
  );
}

function ToolShell({ tool }) {
  const ToolComponent = tool.component;

  useEffect(() => {
    document.title = `${tool.title} | ${siteConfig.name}`;
    const description = document.querySelector("meta[name='description']");
    description?.setAttribute("content", tool.description);
  }, [tool]);

  if (!canAccessTool(null, tool)) {
    return (
      <PageShell eyebrow="Accesso" title="Tool non disponibile">
        <p>Questo strumento non e disponibile con il profilo attuale.</p>
      </PageShell>
    );
  }

  return (
    <main className="platform-tool-shell">
      <section className="platform-tool-header">
        <div>
          <p className="platform-eyebrow">{tool.category}</p>
          <h1>{tool.title}</h1>
          <p>{tool.description}</p>
        </div>
        <div className="platform-tool-meta">
          <StatusBadge status={tool.status} />
          <ProBadge isPro={tool.isPro} />
          <span>v{tool.version}</span>
        </div>
      </section>

      <section className="platform-tool-actions" aria-label="Future tool actions">
        <button type="button" disabled>Save</button>
        <button type="button" disabled>Export</button>
        <button type="button" disabled>Share</button>
      </section>

      <section className="platform-tool-host">
        <ToolComponent />
      </section>
    </main>
  );
}

function PageShell({ eyebrow, title, children, actions }) {
  return (
    <main className="platform-page">
      <section className="platform-page-hero">
        <div>
          <p className="platform-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
        </div>
        {actions}
      </section>
      {children}
    </main>
  );
}

function HomePage() {
  const publicTools = getPublicTools();

  useEffect(() => {
    document.title = siteConfig.name;
  }, []);

  return (
    <PageShell
      eyebrow="Guitar Theory Lab"
      title="Advanced online tools for guitar theory, harmonic exploration, voice leading, set theory and improvisational practice."
      actions={<PlatformLink className="platform-button" to="/tools">Explore tools</PlatformLink>}
    >
      <section className="platform-section platform-section--intro">
        <p>
          Una piattaforma modulare per chitarristi avanzati, docenti, studenti di conservatorio,
          improvvisatori, compositori, musicologi e ricercatori. I primi strumenti sono solo l'inizio:
          la struttura e pensata per accogliere nuovi laboratori teorici, analitici e chitarristici.
        </p>
      </section>

      <section className="platform-section">
        <div className="platform-section-heading">
          <p className="platform-eyebrow">Available modules</p>
          <h2>Strumenti disponibili</h2>
        </div>
        <ToolGrid items={publicTools} />
      </section>

      <section className="platform-roadmap-strip">
        <article>
          <h3>In sviluppo</h3>
          <p>Salvataggi, export, librerie personali, nuovi tool e funzioni Pro.</p>
        </article>
        <article>
          <h3>Free / Pro</h3>
          <p>La base resta accessibile; le funzioni avanzate saranno predisposte in modo graduale.</p>
        </article>
        <article>
          <h3>Indipendente</h3>
          <p>Dominio configurabile, Docker e deploy portabile fuori da Vercel.</p>
        </article>
      </section>
    </PageShell>
  );
}

function ToolsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const categories = ["all", ...new Set(tools.map((tool) => tool.category))];
  const statuses = ["all", ...new Set(tools.map((tool) => tool.status))];

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesQuery =
        !normalizedQuery ||
        [tool.title, tool.description, tool.category, ...tool.tags].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesCategory = category === "all" || tool.category === category;
      const matchesStatus = status === "all" || tool.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [category, query, status]);

  return (
    <PageShell eyebrow="Tools" title="Un registry centrale per tutti gli strumenti presenti e futuri.">
      <section className="platform-filter-bar">
        <label>
          Search
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="voice leading, set class..." />
        </label>
        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option value={item} key={item}>{item === "all" ? "All categories" : item}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((item) => (
              <option value={item} key={item}>{item === "all" ? "All statuses" : item}</option>
            ))}
          </select>
        </label>
      </section>
      <ToolGrid items={filteredTools} />
    </PageShell>
  );
}

function PricingPage() {
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

function LoginPage() {
  return (
    <PageShell eyebrow="Login" title="Accesso utenti predisposto per Supabase.">
      <section className="platform-placeholder-card">
        <p>
          Qui andra il flusso Supabase Auth. Le variabili ambiente sono gia previste in
          `.env.example`, ma il provider non e collegato in questa fase.
        </p>
        <button type="button" disabled>Sign in with Supabase</button>
      </section>
    </PageShell>
  );
}

function DashboardPage() {
  return (
    <PageShell eyebrow="Dashboard" title="Area personale placeholder.">
      <section className="platform-placeholder-card">
        <p>
          La dashboard sara protetta quando Supabase sara attivo. In futuro mostrera profilo,
          salvataggi, librerie personali e stato Pro.
        </p>
        <PlatformLink className="platform-button platform-button--secondary" to="/login">Login placeholder</PlatformLink>
      </section>
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell eyebrow="About" title="Un laboratorio modulare per teoria, chitarra e improvvisazione.">
      <section className="platform-section platform-section--intro">
        <p>
          Guitar Theory Lab nasce come piattaforma indipendente per strumenti teorici avanzati:
          set theory, intersezioni armoniche, voice leading, trasformazioni sulla tastiera,
          materiali per docenti e pratiche di improvvisazione.
        </p>
      </section>
    </PageShell>
  );
}

function NotFoundPage() {
  return (
    <PageShell eyebrow="404" title="Pagina non trovata">
      <PlatformLink className="platform-button" to="/tools">Vai agli strumenti</PlatformLink>
    </PageShell>
  );
}

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
  const [path, setPath] = useState(getCurrentPath);

  useEffect(() => {
    const handlePopState = () => setPath(getCurrentPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div className="platform-root">
      <header className="platform-nav">
        <PlatformLink className="platform-brand" to="/">
          <span>{siteConfig.name}</span>
        </PlatformLink>
        <nav>
          {navigationItems.map((item) => (
            <PlatformLink
              className={path === item.route ? "active" : ""}
              key={item.route}
              to={item.route}
            >
              {item.label}
            </PlatformLink>
          ))}
        </nav>
        <PlatformLink className="platform-button platform-button--ghost" to="/login">Login</PlatformLink>
      </header>

      <RouteRenderer path={path} />
    </div>
  );
}
