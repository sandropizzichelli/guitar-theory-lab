import { useEffect, useMemo, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { DisplayModeSelector, type DisplayMode } from "../components/DisplayModeSelector";
import { Fretboard, type PitchClassVisualState } from "../components/Fretboard";
import { FretboardLegend } from "../components/FretboardLegend";
import { FretRangeSelector, type FretRange } from "../components/FretRangeSelector";
import { IntervalSelector } from "../components/IntervalSelector";
import { MaterialComparisonPanel, type ActiveMaterialSummary } from "../components/MaterialComparisonPanel";
import { PresetResetPanel } from "../components/PresetResetPanel";
import { StringSelector, type ActiveStrings } from "../components/StringSelector";
import { SystemSelector, type MaterialMode } from "../components/SystemSelector";
import {
  VisualizationSelector,
  type VisualizationLayer,
  type VisualizationLayers
} from "../components/VisualizationSelector";
import type { ScaleId } from "../data/scales";
import type { SpellingPreference } from "../data/noteNames";
import { generateArpeggios, type ArpeggioType } from "../music/arpeggioGenerator";
import {
  buildDegreeLabelsFromPitchClasses,
  buildDegreeLabelsFromScaleDegree
} from "../music/degreeLabels";
import { compareMaterials } from "../music/intersectionAnalyzer";
import { normalizePitchClass, type PitchClass } from "../music/pitchClass";
import { STANDARD_TUNING } from "../music/fretboardMapper";
import { generatePentatonics, type PentatonicType } from "../music/pentatonicGenerator";
import { generateScale } from "../music/scaleGenerator";

const toSet = (items: PitchClass[]) => new Set(items);
const keepRootsIn = (roots: PitchClass[], visibleNotes: Set<PitchClass>) =>
  toSet(roots.filter((root) => visibleNotes.has(root)));
const withoutPitchClasses = (source: Set<PitchClass>, excluded: Set<PitchClass>) =>
  new Set([...source].filter((pitchClass) => !excluded.has(pitchClass)));
const unionPitchClasses = (...sets: Set<PitchClass>[]) => new Set(sets.flatMap((set) => [...set]));
const DEFAULT_VISUALIZATION_LAYERS: VisualizationLayers = {
  notesA: true,
  notesB: true,
  common: true
};
const DEFAULT_FRET_RANGE: FretRange = { start: 0, end: 12 };
const DEFAULT_SPELLING: SpellingPreference = "flats";
const allStrings = (): ActiveStrings => new Set(STANDARD_TUNING.map((string) => string.stringNumber));

export function MainExplorerPage() {
  const spelling = DEFAULT_SPELLING;
  const [displayMode, setDisplayMode] = useState<DisplayMode>("notes");
  const [rootA, setRootA] = useState(0);
  const [scaleAId, setScaleAId] = useState<ScaleId>("ionian");
  const [rootB, setRootB] = useState(0);
  const [scaleBId, setScaleBId] = useState<ScaleId>("ionian");
  const [visualizationLayers, setVisualizationLayers] = useState<VisualizationLayers>(DEFAULT_VISUALIZATION_LAYERS);
  const [materialModeA, setMaterialModeA] = useState<MaterialMode>("scales");
  const [materialModeB, setMaterialModeB] = useState<MaterialMode>("scales");
  const [arpeggioTypeA, setArpeggioTypeA] = useState<ArpeggioType>("seventh");
  const [arpeggioTypeB, setArpeggioTypeB] = useState<ArpeggioType>("seventh");
  const [selectedArpeggioA, setSelectedArpeggioA] = useState(0);
  const [selectedArpeggioB, setSelectedArpeggioB] = useState(0);
  const [pentatonicTypeA, setPentatonicTypeA] = useState<PentatonicType>("major");
  const [pentatonicTypeB, setPentatonicTypeB] = useState<PentatonicType>("major");
  const [selectedPentatonicA, setSelectedPentatonicA] = useState(0);
  const [selectedPentatonicB, setSelectedPentatonicB] = useState(0);
  const [fretRange, setFretRange] = useState<FretRange>(DEFAULT_FRET_RANGE);
  const [activeStrings, setActiveStrings] = useState<ActiveStrings>(allStrings);

  const intervalToB = normalizePitchClass(rootB - rootA);
  const scaleA = useMemo(() => generateScale(rootA, scaleAId, spelling), [rootA, scaleAId, spelling]);
  const scaleB = useMemo(() => generateScale(rootB, scaleBId, spelling), [rootB, scaleBId, spelling]);
  const arpeggiosA = useMemo(() => generateArpeggios(scaleA, spelling, "A", arpeggioTypeA), [scaleA, spelling, arpeggioTypeA]);
  const arpeggiosB = useMemo(() => generateArpeggios(scaleB, spelling, "B", arpeggioTypeB), [scaleB, spelling, arpeggioTypeB]);
  const pentatonicsA = useMemo(
    () => generatePentatonics(scaleA, spelling, "A", pentatonicTypeA),
    [pentatonicTypeA, scaleA, spelling]
  );
  const pentatonicsB = useMemo(
    () => generatePentatonics(scaleB, spelling, "B", pentatonicTypeB),
    [pentatonicTypeB, scaleB, spelling]
  );
  const degreeReferenceA =
    materialModeA === "arpeggios" ? arpeggiosA[selectedArpeggioA]?.degree ?? 0 : 0;
  const degreeReferenceB =
    materialModeB === "arpeggios" ? arpeggiosB[selectedArpeggioB]?.degree ?? 0 : 0;
  const activePentatonicA = pentatonicsA[selectedPentatonicA];
  const activePentatonicB = pentatonicsB[selectedPentatonicB];
  const degreeLabelsA = useMemo(
    () =>
      materialModeA === "pentatonics" && activePentatonicA
        ? buildDegreeLabelsFromPitchClasses(activePentatonicA.notes, activePentatonicA.degreeLabels)
        : buildDegreeLabelsFromScaleDegree(scaleA.notes, degreeReferenceA),
    [activePentatonicA, degreeReferenceA, materialModeA, scaleA.notes]
  );
  const degreeLabelsB = useMemo(
    () =>
      materialModeB === "pentatonics" && activePentatonicB
        ? buildDegreeLabelsFromPitchClasses(activePentatonicB.notes, activePentatonicB.degreeLabels)
        : buildDegreeLabelsFromScaleDegree(scaleB.notes, degreeReferenceB),
    [activePentatonicB, degreeReferenceB, materialModeB, scaleB.notes]
  );

  useEffect(() => {
    setSelectedArpeggioA(0);
  }, [rootA, scaleAId, arpeggioTypeA]);

  useEffect(() => {
    setSelectedArpeggioB(0);
  }, [rootB, scaleBId, arpeggioTypeB]);

  useEffect(() => {
    setSelectedPentatonicA(0);
  }, [rootA, scaleAId, pentatonicTypeA]);

  useEffect(() => {
    setSelectedPentatonicB(0);
  }, [rootB, scaleBId, pentatonicTypeB]);

  const materialA: ActiveMaterialSummary & { root: PitchClass } = useMemo(() => {
    const arpeggio = arpeggiosA[selectedArpeggioA];
    if (materialModeA === "arpeggios" && arpeggio) {
      return {
        label: `${arpeggio.roman} ${arpeggio.chordName}`,
        notes: arpeggio.notes,
        noteNames: arpeggio.noteNames,
        root: arpeggio.root
      };
    }
    if (materialModeA === "pentatonics" && activePentatonicA) {
      return {
        label: `${activePentatonicA.roman} ${activePentatonicA.name}`,
        notes: activePentatonicA.notes,
        noteNames: activePentatonicA.noteNames,
        root: activePentatonicA.root
      };
    }
    return {
      label: `${scaleA.noteNames[0]} ${scaleA.label}`,
      notes: scaleA.notes,
      noteNames: scaleA.noteNames,
      root: rootA
    };
  }, [activePentatonicA, arpeggiosA, materialModeA, rootA, scaleA, selectedArpeggioA]);

  const materialB: ActiveMaterialSummary & { root: PitchClass } = useMemo(() => {
    const arpeggio = arpeggiosB[selectedArpeggioB];
    if (materialModeB === "arpeggios" && arpeggio) {
      return {
        label: `${arpeggio.roman} ${arpeggio.chordName}`,
        notes: arpeggio.notes,
        noteNames: arpeggio.noteNames,
        root: arpeggio.root
      };
    }
    if (materialModeB === "pentatonics" && activePentatonicB) {
      return {
        label: `${activePentatonicB.roman} ${activePentatonicB.name}`,
        notes: activePentatonicB.notes,
        noteNames: activePentatonicB.noteNames,
        root: activePentatonicB.root
      };
    }
    return {
      label: `${scaleB.noteNames[0]} ${scaleB.label}`,
      notes: scaleB.notes,
      noteNames: scaleB.noteNames,
      root: rootB
    };
  }, [activePentatonicB, arpeggiosB, materialModeB, rootB, scaleB, selectedArpeggioB]);

  const activeComparison = useMemo(() => compareMaterials(materialA.notes, materialB.notes), [materialA.notes, materialB.notes]);

  const toggleVisualizationLayer = (layer: VisualizationLayer) => {
    setVisualizationLayers((current) => ({
      ...current,
      [layer]: !current[layer]
    }));
  };

  const toggleString = (stringNumber: number) => {
    setActiveStrings((current) => {
      const next = new Set(current);
      if (next.has(stringNumber)) {
        next.delete(stringNumber);
      } else {
        next.add(stringNumber);
      }
      return next;
    });
  };

  const resetPreset = () => {
    setDisplayMode("notes");
    setRootA(0);
    setScaleAId("ionian");
    setRootB(0);
    setScaleBId("ionian");
    setVisualizationLayers({ ...DEFAULT_VISUALIZATION_LAYERS });
    setMaterialModeA("scales");
    setMaterialModeB("scales");
    setArpeggioTypeA("seventh");
    setArpeggioTypeB("seventh");
    setSelectedArpeggioA(0);
    setSelectedArpeggioB(0);
    setPentatonicTypeA("major");
    setPentatonicTypeB("major");
    setSelectedPentatonicA(0);
    setSelectedPentatonicB(0);
    setFretRange({ ...DEFAULT_FRET_RANGE });
    setActiveStrings(allStrings());
  };

  const visualStates: PitchClassVisualState = useMemo(() => {
    const rootsA = [materialA.root];
    const rootsB = [materialB.root];
    const notesA = toSet(activeComparison.a);
    const notesB = toSet(activeComparison.b);
    const common = toSet(activeComparison.common);
    const showCommon = visualizationLayers.common || (visualizationLayers.notesA && visualizationLayers.notesB);
    const visibleCommon = showCommon ? common : new Set<PitchClass>();
    const visibleOnlyA = visualizationLayers.notesA ? withoutPitchClasses(notesA, visibleCommon) : new Set<PitchClass>();
    const visibleOnlyB = visualizationLayers.notesB ? withoutPitchClasses(notesB, visibleCommon) : new Set<PitchClass>();
    const visibleAForRoots = unionPitchClasses(visibleOnlyA, visibleCommon);
    const visibleBForRoots = unionPitchClasses(visibleOnlyB, visibleCommon);

    const base = {
      common: new Set<PitchClass>(),
      onlyA: new Set<PitchClass>(),
      onlyB: new Set<PitchClass>(),
      rootsA: new Set<PitchClass>(),
      rootsB: new Set<PitchClass>()
    };

    return {
      ...base,
      common: visibleCommon,
      onlyA: visibleOnlyA,
      onlyB: visibleOnlyB,
      rootsA: keepRootsIn(rootsA, visibleAForRoots),
      rootsB: keepRootsIn(rootsB, visibleBForRoots)
    };
  }, [activeComparison, materialA.root, materialB.root, visualizationLayers]);

  return (
    <main className="app-shell">
      <AppHeader />
      <div className="top-grid">
        <SystemSelector
          title="System A"
          root={rootA}
          scaleId={scaleAId}
          scale={scaleA}
          materialMode={materialModeA}
          arpeggioType={arpeggioTypeA}
          arpeggios={arpeggiosA}
          selectedArpeggio={selectedArpeggioA}
          pentatonicType={pentatonicTypeA}
          pentatonics={pentatonicsA}
          selectedPentatonic={selectedPentatonicA}
          displayMode={displayMode}
          degreeLabels={degreeLabelsA}
          onRootChange={setRootA}
          onScaleChange={setScaleAId}
          onMaterialModeChange={setMaterialModeA}
          onArpeggioTypeChange={setArpeggioTypeA}
          onSelectedArpeggioChange={setSelectedArpeggioA}
          onPentatonicTypeChange={setPentatonicTypeA}
          onSelectedPentatonicChange={setSelectedPentatonicA}
        />
        <div className="stack">
          <SystemSelector
            title="System B"
            root={rootB}
            scaleId={scaleBId}
            scale={scaleB}
            materialMode={materialModeB}
            arpeggioType={arpeggioTypeB}
            arpeggios={arpeggiosB}
            selectedArpeggio={selectedArpeggioB}
            pentatonicType={pentatonicTypeB}
            pentatonics={pentatonicsB}
            selectedPentatonic={selectedPentatonicB}
            displayMode={displayMode}
            degreeLabels={degreeLabelsB}
            onRootChange={setRootB}
            onScaleChange={setScaleBId}
            onMaterialModeChange={setMaterialModeB}
            onArpeggioTypeChange={setArpeggioTypeB}
            onSelectedArpeggioChange={setSelectedArpeggioB}
            onPentatonicTypeChange={setPentatonicTypeB}
            onSelectedPentatonicChange={setSelectedPentatonicB}
          />
        </div>
        <div className="stack">
          <DisplayModeSelector mode={displayMode} onChange={setDisplayMode} />
          <VisualizationSelector layers={visualizationLayers} onToggle={toggleVisualizationLayer} />
          <FretRangeSelector range={fretRange} onChange={setFretRange} />
          <StringSelector
            activeStrings={activeStrings}
            onToggle={toggleString}
            onSelectAll={() => setActiveStrings(allStrings())}
          />
          <PresetResetPanel onReset={resetPreset} />
        </div>
      </div>

      <div className="fretboard-block">
        <FretboardLegend />
        <Fretboard
          states={visualStates}
          spelling={spelling}
          displayMode={displayMode}
          degreeLabelsA={degreeLabelsA}
          degreeLabelsB={degreeLabelsB}
          fretRange={fretRange}
          activeStrings={activeStrings}
        />
      </div>

      <IntervalSelector interval={intervalToB} />

      <MaterialComparisonPanel
        materialA={materialA}
        materialB={materialB}
        comparison={activeComparison}
        spelling={spelling}
        displayMode={displayMode}
        degreeLabelsA={degreeLabelsA}
        degreeLabelsB={degreeLabelsB}
      />
    </main>
  );
}
