export type DisplayMode = "notes" | "degrees";

type Props = {
  mode: DisplayMode;
  onChange: (value: DisplayMode) => void;
};

export function DisplayModeSelector({ mode, onChange }: Props) {
  return (
    <section className="panel compact-panel">
      <div className="panel-title-row">
        <h2>Display</h2>
      </div>
      <div className="segmented-control">
        <button className={mode === "notes" ? "active" : ""} onClick={() => onChange("notes")}>
          Notes
        </button>
        <button className={mode === "degrees" ? "active" : ""} onClick={() => onChange("degrees")}>
          Degrees
        </button>
      </div>
    </section>
  );
}
