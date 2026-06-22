import { STANDARD_TUNING } from "../music/fretboardMapper";

export type ActiveStrings = Set<number>;

type Props = {
  activeStrings: ActiveStrings;
  onToggle: (stringNumber: number) => void;
  onSelectAll: () => void;
};

export function StringSelector({ activeStrings, onToggle, onSelectAll }: Props) {
  const allStringsActive = activeStrings.size === STANDARD_TUNING.length;

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>Strings</h2>
        <button className="panel-action-button" disabled={allStringsActive} onClick={onSelectAll}>
          All
        </button>
      </div>
      <div className="mode-grid string-selector">
        {STANDARD_TUNING.map((string) => {
          const isActive = activeStrings.has(string.stringNumber);

          return (
            <button
              aria-pressed={isActive}
              className={isActive ? "mode-button active" : "mode-button"}
              key={string.stringNumber}
              onClick={() => onToggle(string.stringNumber)}
            >
              {string.stringNumber} · {string.stringName}
            </button>
          );
        })}
      </div>
    </section>
  );
}
