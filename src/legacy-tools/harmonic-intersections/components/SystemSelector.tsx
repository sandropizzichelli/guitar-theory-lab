import { NOTE_OPTIONS } from "../data/noteNames";
import { SCALE_FAMILIES, SCALES, type ScaleId } from "../data/scales";
import { ARPEGGIO_TYPE_OPTIONS, type Arpeggio, type ArpeggioType } from "../music/arpeggioGenerator";
import { labelsForPitchClasses, type DegreeLabels } from "../music/degreeLabels";
import {
  PENTATONIC_TYPE_OPTIONS,
  type Pentatonic,
  type PentatonicType
} from "../music/pentatonicGenerator";
import type { ScaleMaterial } from "../music/scaleGenerator";
import type { DisplayMode } from "./DisplayModeSelector";
import { NoteChips } from "./NoteChips";

export type MaterialMode = "scales" | "arpeggios" | "pentatonics";

type Props = {
  title: string;
  root: number;
  scaleId: ScaleId;
  scale: ScaleMaterial;
  materialMode: MaterialMode;
  arpeggioType: ArpeggioType;
  arpeggios: Arpeggio[];
  selectedArpeggio: number;
  pentatonicType: PentatonicType;
  pentatonics: Pentatonic[];
  selectedPentatonic: number;
  displayMode: DisplayMode;
  degreeLabels: DegreeLabels;
  rootLocked?: boolean;
  rootLabel?: string;
  onRootChange?: (value: number) => void;
  onScaleChange: (value: ScaleId) => void;
  onMaterialModeChange: (value: MaterialMode) => void;
  onArpeggioTypeChange: (value: ArpeggioType) => void;
  onSelectedArpeggioChange: (value: number) => void;
  onPentatonicTypeChange: (value: PentatonicType) => void;
  onSelectedPentatonicChange: (value: number) => void;
};

const arpeggioOptionLabel = (arpeggio: Arpeggio) =>
  `${arpeggio.roman} - ${arpeggio.chordName} - ${arpeggio.noteNames.join(" ")}`;
const pentatonicOptionLabel = (pentatonic: Pentatonic) =>
  `${pentatonic.roman} - ${pentatonic.name} - ${pentatonic.noteNames.join(" ")}`;

export function SystemSelector({
  title,
  root,
  scaleId,
  scale,
  materialMode,
  arpeggioType,
  arpeggios,
  selectedArpeggio,
  pentatonicType,
  pentatonics,
  selectedPentatonic,
  displayMode,
  degreeLabels,
  rootLocked = false,
  rootLabel,
  onRootChange,
  onScaleChange,
  onMaterialModeChange,
  onArpeggioTypeChange,
  onSelectedArpeggioChange,
  onPentatonicTypeChange,
  onSelectedPentatonicChange
}: Props) {
  const activeArpeggio = arpeggios[selectedArpeggio];
  const activePentatonic = pentatonics[selectedPentatonic];
  const activePitchClasses =
    materialMode === "arpeggios" && activeArpeggio
      ? activeArpeggio.notes
      : materialMode === "pentatonics" && activePentatonic
        ? activePentatonic.notes
        : scale.notes;
  const activeNotes =
    displayMode === "degrees"
      ? labelsForPitchClasses(activePitchClasses, degreeLabels)
      : materialMode === "arpeggios" && activeArpeggio
        ? activeArpeggio.noteNames
        : materialMode === "pentatonics" && activePentatonic
          ? activePentatonic.noteNames
        : scale.noteNames;

  return (
    <section className="panel">
      <div className="panel-title-row">
        <h2>{title}</h2>
      </div>
      <label className="field">
        <span>Tonic</span>
        {rootLocked ? (
          <output className="locked-value">{rootLabel}</output>
        ) : (
          <select value={root} onChange={(event) => onRootChange?.(Number(event.target.value))}>
            {NOTE_OPTIONS.map((note) => (
              <option value={note.pitchClass} key={note.pitchClass}>
                {note.label}
              </option>
            ))}
          </select>
        )}
      </label>
      <label className="field">
        <span>Mode</span>
        <select value={scaleId} onChange={(event) => onScaleChange(event.target.value as ScaleId)}>
          {SCALE_FAMILIES.map((family) => (
            <optgroup label={family.label} key={family.id}>
              {SCALES.filter((scaleOption) => scaleOption.family === family.id).map((scaleOption) => (
                <option value={scaleOption.id} key={scaleOption.id}>
                  {scaleOption.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="segmented-control material-toggle three-materials">
        <button className={materialMode === "scales" ? "active" : ""} onClick={() => onMaterialModeChange("scales")}>
          Full scale
        </button>
        <button className={materialMode === "arpeggios" ? "active" : ""} onClick={() => onMaterialModeChange("arpeggios")}>
          Arpeggio
        </button>
        <button className={materialMode === "pentatonics" ? "active" : ""} onClick={() => onMaterialModeChange("pentatonics")}>
          Pentatonic
        </button>
      </div>
      {materialMode === "arpeggios" ? (
        <>
          <label className="field material-field">
            <span>Arpeggio type</span>
            <select value={arpeggioType} onChange={(event) => onArpeggioTypeChange(event.target.value as ArpeggioType)}>
              {ARPEGGIO_TYPE_OPTIONS.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Degree</span>
            <select value={selectedArpeggio} onChange={(event) => onSelectedArpeggioChange(Number(event.target.value))}>
              {arpeggios.map((arpeggio, index) => (
                <option value={index} key={arpeggio.id}>
                  {arpeggioOptionLabel(arpeggio)}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : null}
      {materialMode === "pentatonics" ? (
        <>
          <label className="field material-field">
            <span>Pentatonic type</span>
            <select value={pentatonicType} onChange={(event) => onPentatonicTypeChange(event.target.value as PentatonicType)}>
              {PENTATONIC_TYPE_OPTIONS.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Root degree</span>
            <select value={selectedPentatonic} onChange={(event) => onSelectedPentatonicChange(Number(event.target.value))}>
              {pentatonics.map((pentatonic, index) => (
                <option value={index} key={pentatonic.id}>
                  {pentatonicOptionLabel(pentatonic)}
                </option>
              ))}
            </select>
          </label>
        </>
      ) : null}
      <NoteChips
        label={
          displayMode === "degrees"
            ? materialMode === "arpeggios"
              ? "Arpeggio degrees"
              : materialMode === "pentatonics"
                ? "Pentatonic degrees"
              : "Scale degrees"
            : materialMode === "arpeggios"
              ? "Arpeggio notes"
              : materialMode === "pentatonics"
                ? "Pentatonic notes"
              : "Scale notes"
        }
        notes={activeNotes}
      />
    </section>
  );
}
