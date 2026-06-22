export function PageShell({ eyebrow, title, children, actions }) {
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
