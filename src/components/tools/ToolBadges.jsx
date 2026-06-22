export function StatusBadge({ status }) {
  return <span className={`platform-badge platform-badge--${status}`}>{status}</span>;
}

export function ProBadge({ isPro }) {
  return <span className="platform-pill">{isPro ? "Pro" : "Free"}</span>;
}
