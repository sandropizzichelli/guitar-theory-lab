import { buildFretboard } from "../music/fretboardMapper";
import { pitchClassName, type PitchClass } from "../music/pitchClass";
import type { SpellingPreference } from "../data/noteNames";
import type { CSSProperties } from "react";
import { combinedDegreeLabel, type DegreeLabels } from "../music/degreeLabels";
import type { DisplayMode } from "./DisplayModeSelector";
import type { FretRange } from "./FretRangeSelector";
import type { ActiveStrings } from "./StringSelector";

export type PitchClassVisualState = {
  common: Set<PitchClass>;
  onlyA: Set<PitchClass>;
  onlyB: Set<PitchClass>;
  rootsA: Set<PitchClass>;
  rootsB: Set<PitchClass>;
};

type Props = {
  states: PitchClassVisualState;
  spelling: SpellingPreference;
  displayMode: DisplayMode;
  degreeLabelsA: DegreeLabels;
  degreeLabelsB: DegreeLabels;
  fretRange: FretRange;
  activeStrings: ActiveStrings;
  fretCount?: number;
};

const FRET_MARKERS = [
  { fret: 3, type: "single" },
  { fret: 5, type: "single" },
  { fret: 7, type: "single" },
  { fret: 9, type: "single" },
  { fret: 12, type: "double" }
];

const stateClassFor = (pitchClass: PitchClass, states: PitchClassVisualState) => {
  const classes = ["fret-note"];
  if (states.common.has(pitchClass)) classes.push("common");
  if (states.onlyA.has(pitchClass)) classes.push("only-a");
  if (states.onlyB.has(pitchClass)) classes.push("only-b");
  if (states.rootsA.has(pitchClass)) classes.push("root-a");
  if (states.rootsB.has(pitchClass)) classes.push("root-b");
  return classes.join(" ");
};

export function Fretboard({
  states,
  spelling,
  displayMode,
  degreeLabelsA,
  degreeLabelsB,
  fretRange,
  activeStrings,
  fretCount = 12
}: Props) {
  const strings = buildFretboard(fretCount);
  const activePitchClasses = new Set([
    ...states.common,
    ...states.onlyA,
    ...states.onlyB,
    ...states.rootsA,
    ...states.rootsB
  ]);

  return (
    <section className="panel fretboard-panel">
      <div className="fretboard-header">
        <h2>Fretboard</h2>
        <div className="fret-numbers" style={{ "--fret-count": fretCount + 1 } as CSSProperties}>
          {Array.from({ length: fretCount + 1 }, (_, fret) => (
            <span key={fret}>{fret}</span>
          ))}
        </div>
      </div>
      <div className="fretboard-scroll">
        <div className="fretboard" style={{ "--fret-count": fretCount + 1 } as CSSProperties}>
          <div className="fret-markers" aria-hidden="true">
            {Array.from({ length: fretCount + 1 }, (_, fret) => {
              const marker = FRET_MARKERS.find((item) => item.fret === fret);
              return (
                <span className={marker ? `fret-marker ${marker.type}` : "fret-marker empty"} key={fret}>
                  {marker?.type === "double" ? (
                    <>
                      <span />
                      <span />
                    </>
                  ) : marker ? (
                    <span />
                  ) : null}
                </span>
              );
            })}
          </div>
          {strings.map((string) => {
            const stringNumber = string[0].stringNumber;
            const isStringActive = activeStrings.has(stringNumber);

            return (
            <div className={isStringActive ? "string-row" : "string-row string-disabled"} key={stringNumber}>
              <span className="string-label">
                <span className="string-number">{stringNumber}</span>
                {string[0].stringName}
              </span>
              {string.map((position) => {
                const isInRange = position.fret >= fretRange.start && position.fret <= fretRange.end;
                const cellClasses = [
                  "fret-cell",
                  position.fret === 0 ? "open-string-cell" : "",
                  isInRange ? "in-range" : "out-of-range"
                ]
                  .filter(Boolean)
                  .join(" ");
                const belongsToA = states.common.has(position.pitchClass) || states.onlyA.has(position.pitchClass);
                const belongsToB = states.common.has(position.pitchClass) || states.onlyB.has(position.pitchClass);
                const noteLabel =
                  displayMode === "degrees"
                    ? combinedDegreeLabel(position.pitchClass, degreeLabelsA, degreeLabelsB, belongsToA, belongsToB)
                    : pitchClassName(position.pitchClass, spelling);
                const noteClasses = [
                  stateClassFor(position.pitchClass, states),
                  displayMode === "degrees" ? "degree-label" : "",
                  noteLabel.includes("/") ? "dual-degree-label" : ""
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div className={cellClasses} key={`${position.stringNumber}-${position.fret}`}>
                    {isStringActive && isInRange && activePitchClasses.has(position.pitchClass) ? (
                    <span className={noteClasses}>{noteLabel}</span>
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
