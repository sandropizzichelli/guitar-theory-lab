import { useEffect, useMemo, useState } from "react";
import CycleMapFretboard from "./CycleMapFretboard";
import {
  buildDiatonicChords,
  buildCycleVoicingChain,
  CHORD_TYPES,
  CYCLES,
  generateScale,
  getChordType,
  getStringSet,
  findVoiceLeadingVoicings,
  nextDegree,
  noteName,
  NOTE_OPTIONS,
  SCALE_FAMILIES,
  SCALE_OPTIONS,
  STRING_SETS
} from "./music";

const DEFAULT_FRET_WINDOW = { start: 0, end: 12 };
const MAX_FRET = 12;
const MAX_VOICING_SPAN = 10;

function NoteChips({ notes, tone = "neutral" }) {
  return (
    <div className="note-chips">
      {notes.map((note) => (
        <span className={`note-chip note-chip--${tone}`} key={note}>{note}</span>
      ))}
    </div>
  );
}

function buildCyclePreview(startDegree, cycleId) {
  const degrees = [startDegree];

  while (degrees.length < 7) {
    degrees.push(nextDegree(degrees[degrees.length - 1], cycleId));
  }

  return degrees;
}

function buildDropTypeOptions(stringSetOptions) {
  const options = new Map();

  stringSetOptions.forEach((option) => {
    if (option.dropType && !options.has(option.dropType)) {
      options.set(option.dropType, {
        id: option.dropType,
        label: option.dropLabel
      });
    }
  });

  return [...options.values()];
}

export default function App() {
  const [root, setRoot] = useState(0);
  const [scaleId, setScaleId] = useState("ionian");
  const [chordTypeId, setChordTypeId] = useState("triads");
  const [cycleId, setCycleId] = useState("seconds");
  const [currentDegree, setCurrentDegree] = useState(0);
  const [voicingFamily, setVoicingFamily] = useState("close");
  const [dropType, setDropType] = useState("drop2");
  const [stringSetId, setStringSetId] = useState(STRING_SETS.triads[0].id);
  const [startInversion, setStartInversion] = useState(null);
  const [allowOpenStrings, setAllowOpenStrings] = useState(true);
  const [displayMode, setDisplayMode] = useState("degrees");
  const [focusedCycleDegree, setFocusedCycleDegree] = useState(null);
  const [cycleViewMode, setCycleViewMode] = useState("overview");
  const [activeCycleOrder, setActiveCycleOrder] = useState(0);

  const scale = useMemo(() => generateScale(root, scaleId), [root, scaleId]);
  const chords = useMemo(() => buildDiatonicChords(scale, chordTypeId), [scale, chordTypeId]);
  const chordType = getChordType(chordTypeId);
  const baseStringSetOptions = STRING_SETS[chordTypeId].filter((option) => option.voicing === voicingFamily);
  const dropTypeOptions = buildDropTypeOptions(baseStringSetOptions);
  const activeDropType = dropTypeOptions.some((option) => option.id === dropType)
    ? dropType
    : dropTypeOptions[0]?.id ?? null;
  const stringSetOptions = activeDropType
    ? baseStringSetOptions.filter((option) => option.dropType === activeDropType)
    : baseStringSetOptions;
  const activeStringSetId = stringSetOptions.some((option) => option.id === stringSetId)
    ? stringSetId
    : stringSetOptions[0].id;
  const stringSet = getStringSet(chordTypeId, activeStringSetId);
  const currentChord = chords[currentDegree];
  const cyclePreview = buildCyclePreview(currentDegree, cycleId);

  useEffect(() => {
    const candidates = STRING_SETS[chordTypeId].filter((option) => option.voicing === voicingFamily);
    const nextDropTypeOptions = buildDropTypeOptions(candidates);
    const nextDropType = nextDropTypeOptions.some((option) => option.id === dropType)
      ? dropType
      : nextDropTypeOptions[0]?.id ?? null;
    const nextStringSet = candidates.find((option) => !nextDropType || option.dropType === nextDropType)
      ?? STRING_SETS[chordTypeId][0];

    if (nextDropType && nextDropType !== dropType) {
      setDropType(nextDropType);
    }
    setStringSetId(nextStringSet.id);
    setStartInversion(null);
  }, [chordTypeId, voicingFamily, dropType]);

  const voiceLeadingConfig = {
    stringSet,
    fretWindow: DEFAULT_FRET_WINDOW,
    maxSpan: MAX_VOICING_SPAN,
    allowOpenStrings
  };

  const allStartVoicings = useMemo(
    () => findVoiceLeadingVoicings({ chord: currentChord, ...voiceLeadingConfig }),
    [currentChord, stringSet, allowOpenStrings]
  );
  const rootPlacementOptions = useMemo(() => {
    const groups = new Map();

    allStartVoicings.forEach((voicing) => {
      const group = groups.get(voicing.inversion) ?? {
        inversion: voicing.inversion,
        label: chordType.inversionLabels[voicing.inversion] ?? `Inversion ${voicing.inversion}`
      };
      groups.set(voicing.inversion, group);
    });

    return [...groups.values()]
      .sort((a, b) => a.inversion - b.inversion);
  }, [allStartVoicings, chordType]);
  const activeStartInversion = rootPlacementOptions.some((option) => option.inversion === startInversion)
    ? startInversion
    : rootPlacementOptions[0]?.inversion ?? null;

  useEffect(() => {
    setFocusedCycleDegree(null);
    setActiveCycleOrder(0);
  }, [root, scaleId, chordTypeId, cycleId, currentDegree, activeStringSetId, activeStartInversion]);

  const currentVoicings = useMemo(
    () =>
      activeStartInversion === null
        ? []
        : allStartVoicings.filter((voicing) => voicing.inversion === activeStartInversion),
    [activeStartInversion, allStartVoicings]
  );
  const currentVoicing = currentVoicings[0] ?? null;
  const cycleVoicings = useMemo(
    () =>
      buildCycleVoicingChain({
        degrees: cyclePreview,
        chords,
        ...voiceLeadingConfig,
        cycleId,
        initialVoicing: currentVoicing
      }),
    [chords, cyclePreview, stringSet, allowOpenStrings, cycleId, currentVoicing]
  );

  return (
    <main className="app-shell">
      <section className="control-grid">
        <div className="set-panel controls-panel">
          <p className="section-title">Material</p>
          <div className="field-grid field-grid--single">
            <label className="field">
              <span>Tonic</span>
              <select value={root} onChange={(event) => setRoot(Number(event.target.value))}>
                {NOTE_OPTIONS.map((option) => (
                  <option value={option.pitchClass} key={option.pitchClass}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Mode</span>
              <select value={scaleId} onChange={(event) => setScaleId(event.target.value)}>
                {SCALE_FAMILIES.map((family) => (
                  <optgroup label={family.label} key={family.id}>
                    {SCALE_OPTIONS.filter((scaleOption) => scaleOption.family === family.id).map((scaleOption) => (
                      <option value={scaleOption.id} key={scaleOption.id}>{scaleOption.label}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </label>
          </div>

          <div className="segmented-control">
            {CHORD_TYPES.map((option) => (
              <button
                className={chordTypeId === option.id ? "active" : ""}
                key={option.id}
                onClick={() => setChordTypeId(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="field-grid">
            <label className="field">
              <span>Start chord</span>
              <select value={currentDegree} onChange={(event) => setCurrentDegree(Number(event.target.value))}>
                {chords.map((chord) => (
                  <option value={chord.degree} key={chord.id}>{chord.roman} | {chord.chordName}</option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Cycle</span>
              <select value={cycleId} onChange={(event) => setCycleId(event.target.value)}>
                {CYCLES.map((option) => (
                  <option value={option.id} key={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="cycle-strip">
            {cyclePreview.map((degree, index) => (
              <button
                className={index === 0 ? "active" : ""}
                key={`${degree}-${index}`}
                onClick={() => setCurrentDegree(degree)}
              >
                {chords[degree].roman}
                <span>{chords[degree].chordName}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="set-panel controls-panel">
          <p className="section-title">Guitar</p>
          <div className="field">
            <span>Voicing</span>
            <div className="segmented-control">
              <button
                className={voicingFamily === "close" ? "active" : ""}
                onClick={() => setVoicingFamily("close")}
                type="button"
              >
                Close
              </button>
              <button
                className={voicingFamily === "spread" ? "active" : ""}
                onClick={() => setVoicingFamily("spread")}
                type="button"
              >
                Spread
              </button>
            </div>
          </div>

          {dropTypeOptions.length ? (
            <label className="field">
              <span>Drop type</span>
              <select value={activeDropType ?? ""} onChange={(event) => setDropType(event.target.value)}>
                {dropTypeOptions.map((option) => (
                  <option value={option.id} key={option.id}>{option.label}</option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="field">
            <span>String set</span>
            <select value={activeStringSetId} onChange={(event) => setStringSetId(event.target.value)}>
              {stringSetOptions.map((option) => (
                <option value={option.id} key={option.id}>{option.label}</option>
              ))}
            </select>
          </label>

          <div className="field-grid">
            <label className="field">
              <span>Starting inversion</span>
              <select
                disabled={!rootPlacementOptions.length}
                value={activeStartInversion ?? ""}
                onChange={(event) => {
                  setStartInversion(Number(event.target.value));
                }}
              >
                {rootPlacementOptions.length ? rootPlacementOptions.map((option) => (
                  <option value={option.inversion} key={option.inversion}>
                    {option.label}
                  </option>
                )) : <option>No inversion available</option>}
              </select>
            </label>
          </div>

          <label className="check-field">
            <input
              checked={allowOpenStrings}
              onChange={(event) => setAllowOpenStrings(event.target.checked)}
              type="checkbox"
            />
            <span>Open strings</span>
          </label>
        </div>

        <div className="set-panel compact-panel">
          <p className="section-title">Display</p>
          <div className="segmented-control">
            <button className={displayMode === "notes" ? "active" : ""} onClick={() => setDisplayMode("notes")}>Note</button>
            <button className={displayMode === "degrees" ? "active" : ""} onClick={() => setDisplayMode("degrees")}>Degrees</button>
          </div>

          <div className="scale-summary">
            <span>{noteName(root)} {scale.label}</span>
            <NoteChips notes={scale.noteNames} />
          </div>
        </div>
      </section>

      <CycleMapFretboard
        activeOrder={activeCycleOrder}
        cycleId={cycleId}
        cycleVoicings={cycleVoicings}
        cycleViewMode={cycleViewMode}
        displayMode={displayMode}
        focusedDegree={focusedCycleDegree}
        onActiveOrderChange={setActiveCycleOrder}
        onFocusDegree={setFocusedCycleDegree}
        onViewModeChange={setCycleViewMode}
        fretCount={MAX_FRET}
      />
    </main>
  );
}
