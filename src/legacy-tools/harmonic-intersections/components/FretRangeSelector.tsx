export type FretRange = {
  start: number;
  end: number;
};

type Props = {
  range: FretRange;
  maxFret?: number;
  onChange: (range: FretRange) => void;
};

const PRESETS: { label: string; range: FretRange }[] = [
  { label: "0-12", range: { start: 0, end: 12 } },
  { label: "0-4", range: { start: 0, end: 4 } },
  { label: "5-8", range: { start: 5, end: 8 } },
  { label: "7-12", range: { start: 7, end: 12 } }
];

export function FretRangeSelector({ range, maxFret = 12, onChange }: Props) {
  const fretOptions = Array.from({ length: maxFret + 1 }, (_, fret) => fret);
  const isPresetActive = (preset: FretRange) => preset.start === range.start && preset.end === range.end;

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Fret range</h2>
      </div>
      <div className="mode-grid fret-range-presets">
        {PRESETS.map((preset) => (
          <button
            className={isPresetActive(preset.range) ? "mode-button active" : "mode-button"}
            key={preset.label}
            onClick={() => onChange(preset.range)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="range-control-grid">
        <label className="field small-field">
          <span>From fret</span>
          <select
            value={range.start}
            onChange={(event) => {
              const start = Number(event.target.value);
              onChange({ start, end: Math.max(start, range.end) });
            }}
          >
            {fretOptions.map((fret) => (
              <option value={fret} key={fret}>
                {fret}
              </option>
            ))}
          </select>
        </label>
        <label className="field small-field">
          <span>To fret</span>
          <select
            value={range.end}
            onChange={(event) => {
              const end = Number(event.target.value);
              onChange({ start: Math.min(range.start, end), end });
            }}
          >
            {fretOptions.map((fret) => (
              <option value={fret} key={fret}>
                {fret}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
