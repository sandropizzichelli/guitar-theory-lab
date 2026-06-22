import { buildFretboard, expectedStaticVoiceCount, noteName } from "./music";

const LABEL_WIDTH = 74;
const CELL_WIDTH = 128;
const CELL_HEIGHT = 64;
const HEADER_HEIGHT = 38;
const MARKERS = [
  { fret: 3, positions: [0.5] },
  { fret: 5, positions: [0.5] },
  { fret: 7, positions: [0.5] },
  { fret: 9, positions: [0.5] },
  { fret: 12, positions: [0.34, 0.66] }
];

const VIEW_MODES = [
  { id: "overview", label: "Panoramica" },
  { id: "chord", label: "Accordo" },
  { id: "transition", label: "Transizione" },
  { id: "all", label: "Tutti" }
];

function cellKey(stringNumber, fret) {
  return `${stringNumber}:${fret}`;
}

function entryLabel(entry, displayMode) {
  return displayMode === "notes" ? noteName(entry.pitchClass) : entry.tone.toneLabel;
}

function orderedCycleItems(cycleVoicings) {
  return [...cycleVoicings].sort((a, b) => a.order - b.order);
}

function normalizeOrder(order, length) {
  if (!length) return 0;
  return ((order % length) + length) % length;
}

function buildVisibleEntries(cycleVoicings, cycleViewMode, activeOrder) {
  const items = orderedCycleItems(cycleVoicings);
  const active = normalizeOrder(activeOrder, items.length);
  const next = normalizeOrder(active + 1, items.length);

  return items.flatMap((item) => {
    if (!item.voicing) return [];

    const isActive = item.order === active;
    const isNext = item.order === next;

    if (cycleViewMode === "overview") {
      return item.voicing.positions
        .filter((position) => position.tone.toneLabel === "R")
        .map((position) => ({
          ...position,
          chord: item.chord,
          degree: item.degree,
          order: item.order,
          role: isActive ? "active" : "context"
        }));
    }

    if (cycleViewMode === "chord" && !isActive) {
      return [];
    }

    if (cycleViewMode === "transition" && !isActive && !isNext) {
      return [];
    }

    return item.voicing.positions.map((position) => ({
      ...position,
      chord: item.chord,
      degree: item.degree,
      order: item.order,
      role: isActive ? "active" : isNext ? "next" : "context"
    }));
  });
}

function buildCellMap(entries) {
  const map = new Map();

  entries.forEach((entry) => {
    const key = cellKey(entry.stringNumber, entry.fret);

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push(entry);
  });

  return map;
}

function areAdjacentOrders(a, b, cycleLength) {
  return Math.abs(a - b) === 1 || Math.abs(a - b) === cycleLength - 1;
}

function hasAdjacentCommon(entries, expectedCommonCount, cycleLength) {
  if (expectedCommonCount === 0) return false;

  return entries.some((entry, index) =>
    entries.some((candidate, candidateIndex) =>
      candidateIndex !== index && areAdjacentOrders(entry.order, candidate.order, cycleLength)
    )
  );
}

function dotContent(entry, displayMode, cycleViewMode, stackSize) {
  if (cycleViewMode === "overview") return entry.order + 1;
  return entryLabel(entry, displayMode);
}

function CycleDotCluster({
  entries,
  displayMode,
  activeOrder,
  onActiveOrderChange,
  onFocusDegree,
  expectedCommonCount,
  cycleLength,
  cycleViewMode
}) {
  const orderedEntries = [...entries].sort((a, b) => a.order - b.order);
  const stackSize = Math.min(orderedEntries.length, 7);
  const isCommonStack = hasAdjacentCommon(orderedEntries, expectedCommonCount, cycleLength);
  const isIncidentalStack = orderedEntries.length > 1 && !isCommonStack;

  return (
    <div
      className={[
        "cycle-dot-stack",
        `cycle-dot-stack--${stackSize}`,
        isCommonStack ? "cycle-dot-stack--common" : "",
        isIncidentalStack ? "cycle-dot-stack--incidental" : ""
      ].filter(Boolean).join(" ")}
    >
      {orderedEntries.map((entry) => {
        const isRoot = entry.tone.toneLabel === "R";
        const isActive = entry.order === activeOrder;
        const label = dotContent(entry, displayMode, cycleViewMode, stackSize);
        const title = `${entry.order + 1}. ${entry.chord.roman} ${entry.chord.chordName} | ${entryLabel(entry, displayMode)} | corda ${entry.stringNumber}, tasto ${entry.fret}`;

        return (
          <button
            aria-label={title}
            className={[
              "cycle-dot",
              `degree-color-${entry.degree}`,
              `cycle-dot--${entry.role}`,
              isRoot ? "cycle-dot--root" : "",
              isCommonStack ? "cycle-dot--common" : "",
              isIncidentalStack ? "cycle-dot--incidental" : "",
              isActive ? "cycle-dot--selected" : ""
            ].filter(Boolean).join(" ")}
            key={`${entry.order}-${entry.degree}-${entry.stringNumber}-${entry.fret}-${entry.tone.toneLabel}`}
            onClick={() => {
              onActiveOrderChange(entry.order);
              onFocusDegree(entry.degree);
            }}
            title={title}
            type="button"
          >
            {label ? <span className="cycle-dot-label">{label}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function CycleLegend({ cycleVoicings, activeOrder, onActiveOrderChange }) {
  const items = orderedCycleItems(cycleVoicings);

  return (
    <div className="cycle-legend" aria-label="Passi del ciclo">
      {items.map((item) => {
        const isActive = activeOrder === item.order;
        const label = `${item.order + 1}. ${item.chord.roman} ${item.chord.chordName}`;

        return (
          <button
            className={[
              "cycle-legend-item",
              `degree-color-${item.degree}`,
              isActive ? "cycle-legend-item--active" : ""
            ].filter(Boolean).join(" ")}
            key={`${item.order}-${item.degree}`}
            onClick={() => onActiveOrderChange(item.order)}
            title={label}
            type="button"
          >
            <span className="cycle-legend-dot" />
            <span className="cycle-legend-order">{item.order + 1}</span>
            <strong>{item.chord.roman}</strong>
            <span>{item.chord.chordName}</span>
          </button>
        );
      })}
    </div>
  );
}

function CycleModeSwitch({ value, onChange }) {
  return (
    <div className="cycle-view-switch" aria-label="Modalita cycle map">
      {VIEW_MODES.map((mode) => (
        <button
          className={value === mode.id ? "active" : ""}
          key={mode.id}
          onClick={() => onChange(mode.id)}
          type="button"
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}

function CycleStatus({ cycleVoicings, activeOrder, cycleViewMode }) {
  const items = orderedCycleItems(cycleVoicings);
  const active = items.find((item) => item.order === activeOrder) ?? items[0];
  const next = items[normalizeOrder((active?.order ?? 0) + 1, items.length)];

  if (!active) return null;

  const label = cycleViewMode === "transition" && next
    ? `${active.chord.roman} ${active.chord.chordName} -> ${next.chord.roman} ${next.chord.chordName}`
    : `${active.order + 1}. ${active.chord.roman} ${active.chord.chordName}`;

  return <div className="cycle-status">{label}</div>;
}

export default function CycleMapFretboard({
  activeOrder,
  cycleVoicings,
  cycleViewMode,
  displayMode,
  focusedDegree,
  onActiveOrderChange,
  onFocusDegree,
  onViewModeChange,
  cycleId,
  fretCount
}) {
  const rows = buildFretboard(fretCount);
  const items = orderedCycleItems(cycleVoicings);
  const normalizedActiveOrder = normalizeOrder(activeOrder, items.length);
  const entries = buildVisibleEntries(cycleVoicings, cycleViewMode, normalizedActiveOrder);
  const cellMap = buildCellMap(entries);
  const activeStrings = new Set(
    cycleVoicings.flatMap((item) => item.voicing?.stringSet.strings ?? [])
  );
  const boardWidth = (fretCount + 1) * CELL_WIDTH;
  const boardHeight = rows.length * CELL_HEIGHT;
  const overlayWidth = LABEL_WIDTH + boardWidth;
  const overlayHeight = HEADER_HEIGHT + boardHeight;
  const expectedCommonCount = expectedStaticVoiceCount(
    cycleVoicings.find((item) => item.voicing)?.voicing?.positions.length ?? 0,
    cycleId
  );

  return (
    <section className="set-panel fretboard-panel cycle-map-panel">
      <div className="cycle-map-header">
        <p className="section-title cycle-map-title">Cycle map</p>
        <CycleModeSwitch value={cycleViewMode} onChange={onViewModeChange} />
      </div>

      <div className="cycle-map-toolbar">
        <CycleLegend
          activeOrder={normalizedActiveOrder}
          cycleVoicings={cycleVoicings}
          focusedDegree={focusedDegree}
          onActiveOrderChange={onActiveOrderChange}
          onFocusDegree={onFocusDegree}
        />
        <CycleStatus
          activeOrder={normalizedActiveOrder}
          cycleViewMode={cycleViewMode}
          cycleVoicings={cycleVoicings}
        />
      </div>

      <div className="fretboard-scroll">
        <div
          className="fretboard cycle-map-board"
          style={{
            "--label-width": `${LABEL_WIDTH}px`,
            "--cell-width": `${CELL_WIDTH}px`,
            "--cell-height": `${CELL_HEIGHT}px`,
            "--header-height": `${HEADER_HEIGHT}px`,
            "--fret-count": fretCount + 1,
            "--board-width": `${boardWidth}px`,
            "--board-height": `${boardHeight}px`,
            "--overlay-width": `${overlayWidth}px`,
            "--overlay-height": `${overlayHeight}px`
          }}
        >
          <div className="fretboard-surface" aria-hidden="true">
            {MARKERS.map((marker) =>
              marker.positions.map((position, index) => (
                <span
                  className="fretboard-marker"
                  key={`${marker.fret}-${index}`}
                  style={{
                    left: marker.fret * CELL_WIDTH + CELL_WIDTH / 2,
                    top: boardHeight * position
                  }}
                />
              ))
            )}
          </div>

          <div className="fretboard-corner" />
          {Array.from({ length: fretCount + 1 }, (_, fret) => (
            <div className="fret-label" key={fret}>{fret}</div>
          ))}

          {rows.map((row) => {
            const stringNumber = row[0].stringNumber;
            const isActive = activeStrings.has(stringNumber);

            return (
              <div className={isActive ? "string-row" : "string-row string-row--inactive"} key={stringNumber}>
                <div className="string-label">
                  <span>{stringNumber}</span>
                  {row[0].stringName}
                </div>

                {row.map((position) => {
                  const cellEntries = cellMap.get(cellKey(position.stringNumber, position.fret)) ?? [];

                  return (
                    <div className="fret-cell cycle-cell" key={cellKey(position.stringNumber, position.fret)}>
                      {cellEntries.length ? (
                        <CycleDotCluster
                          activeOrder={normalizedActiveOrder}
                          cycleLength={cycleVoicings.length}
                          cycleViewMode={cycleViewMode}
                          displayMode={displayMode}
                          entries={cellEntries}
                          expectedCommonCount={expectedCommonCount}
                          focusedDegree={focusedDegree}
                          onActiveOrderChange={onActiveOrderChange}
                          onFocusDegree={onFocusDegree}
                        />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
