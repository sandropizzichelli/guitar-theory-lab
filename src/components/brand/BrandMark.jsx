export function BrandMark({ compact = false }) {
  return (
    <span className={compact ? "gtl-brand gtl-brand--compact" : "gtl-brand"}>
      <span className="gtl-brand__mark" aria-hidden="true">
        <span className="gtl-brand__strings gtl-brand__strings--top" />
        <span className="gtl-brand__letters">GTL</span>
        <span className="gtl-brand__strings gtl-brand__strings--bottom" />
      </span>
      {!compact && (
        <span className="gtl-brand__wordmark">
          <strong>Guitar Theory Lab</strong>
          <small>Advanced musical exploration</small>
        </span>
      )}
    </span>
  );
}
