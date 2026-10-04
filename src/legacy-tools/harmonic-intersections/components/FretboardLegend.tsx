const LEGEND_ITEMS = [
  { className: "common", label: "A∩B · Common · double border" },
  { className: "only-a", label: "A only · square" },
  { className: "only-b", label: "B only · dashed border" },
  { className: "root-a", label: "Tonic/Root A" },
  { className: "root-b", label: "Tonic/Root B" }
];

export function FretboardLegend() {
  return (
    <div className="fretboard-legend" aria-label="Fretboard legend">
      {LEGEND_ITEMS.map((item) => (
        <span className="legend-item" key={item.className}>
          <span className={`legend-dot ${item.className}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}
