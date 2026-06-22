export function PageShell({ eyebrow, title, subtitle, children, actions, variant = "default" }) {
  return (
    <main className={`platform-page platform-page--${variant}`}>
      <section className="platform-page-hero">
        <div className="platform-hero-grid" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <p className="platform-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          {subtitle && <p className="platform-hero-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="platform-hero-actions">{actions}</div>}
      </section>
      {children}
    </main>
  );
}
