import { CHORD_QUALITIES, ROMAN_NUMERALS } from "../data/chordQualities";
import { intervalFormulaFromRoot, normalizePitchClass, pitchClassListNames, type PitchClass } from "./pitchClass";
import type { ScaleMaterial } from "./scaleGenerator";
import type { SpellingPreference } from "../data/noteNames";

export type ArpeggioType = "triad" | "seventh" | "ninth" | "eleventh" | "thirteenth";

export const ARPEGGIO_TYPE_OPTIONS: { id: ArpeggioType; label: string }[] = [
  { id: "triad", label: "Triad" },
  { id: "seventh", label: "Diatonic seventh" },
  { id: "ninth", label: "Diatonic ninth" },
  { id: "eleventh", label: "Diatonic eleventh" },
  { id: "thirteenth", label: "Diatonic thirteenth" }
];

const DIATONIC_OFFSETS: Record<ArpeggioType, number[]> = {
  triad: [0, 2, 4],
  seventh: [0, 2, 4, 6],
  ninth: [0, 2, 4, 6, 8],
  eleventh: [0, 2, 4, 6, 8, 10],
  thirteenth: [0, 2, 4, 6, 8, 10, 12]
};

export type Arpeggio = {
  id: string;
  degree: number;
  roman: string;
  root: PitchClass;
  quality: string | null;
  chordName: string;
  notes: PitchClass[];
  noteNames: string[];
  formula: number[];
  type: ArpeggioType;
};

const triadQuality = (formula: number[]) => {
  const key = formula.slice(0, 3).join(",");
  if (key === "0,4,7") return "";
  if (key === "0,3,7") return "m";
  if (key === "0,3,6") return "dim";
  if (key === "0,4,8") return "aug";
  return null;
};

const fallbackExtensionLabel = (type: ArpeggioType) => {
  if (type === "ninth") return "add9";
  if (type === "eleventh") return "add11";
  if (type === "thirteenth") return "add13";
  return "";
};

export const generateArpeggios = (
  scale: ScaleMaterial,
  spelling: SpellingPreference,
  systemId: "A" | "B" = "A",
  type: ArpeggioType = "seventh"
): Arpeggio[] => {
  if (scale.notes.length !== 7) {
    return [];
  }

  return scale.notes.map((root, degree) => {
    const notes = DIATONIC_OFFSETS[type].map((offset) => scale.notes[(degree + offset) % 7]);
    const formula = intervalFormulaFromRoot(root, notes);
    const quality = CHORD_QUALITIES[formula.join(",")] ?? null;
    const rootName = pitchClassListNames([root], spelling)[0];
    const triadLabel = triadQuality(formula);
    const chordLabel =
      quality ??
      (type === "triad" && triadLabel !== null ? triadLabel : null) ??
      (type !== "triad" && triadLabel !== null ? `${triadLabel}${fallbackExtensionLabel(type)}` : null);

    return {
      id: `${systemId}-${type}-${degree}`,
      degree,
      roman: ROMAN_NUMERALS[degree],
      root,
      quality: chordLabel,
      chordName: chordLabel !== null ? `${rootName}${chordLabel}` : `${rootName}(${formula.join("-")})`,
      notes,
      noteNames: pitchClassListNames(notes, spelling),
      formula,
      type
    };
  });
};

export const generateSeventhArpeggios = (
  scale: ScaleMaterial,
  spelling: SpellingPreference,
  systemId: "A" | "B" = "A"
): Arpeggio[] => generateArpeggios(scale, spelling, systemId, "seventh");
