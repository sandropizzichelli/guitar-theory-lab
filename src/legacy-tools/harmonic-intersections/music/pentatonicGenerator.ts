import { ROMAN_NUMERALS } from "../data/chordQualities";
import type { SpellingPreference } from "../data/noteNames";
import { pitchClassListNames, transposePitchClass, type PitchClass } from "./pitchClass";
import type { ScaleMaterial } from "./scaleGenerator";

export type PentatonicType = "major" | "minor";

type PentatonicDefinition = {
  label: string;
  pattern: number[];
  degreeLabels: string[];
};

export const PENTATONIC_DEFINITIONS: Record<PentatonicType, PentatonicDefinition> = {
  major: {
    label: "Major pentatonic",
    pattern: [0, 2, 4, 7, 9],
    degreeLabels: ["1", "2", "3", "5", "6"]
  },
  minor: {
    label: "Minor pentatonic",
    pattern: [0, 3, 5, 7, 10],
    degreeLabels: ["1", "b3", "4", "5", "b7"]
  }
};

export const PENTATONIC_TYPE_OPTIONS: { id: PentatonicType; label: string }[] = [
  { id: "major", label: PENTATONIC_DEFINITIONS.major.label },
  { id: "minor", label: PENTATONIC_DEFINITIONS.minor.label }
];

export type Pentatonic = {
  id: string;
  degree: number;
  roman: string;
  root: PitchClass;
  name: string;
  notes: PitchClass[];
  noteNames: string[];
  degreeLabels: string[];
  type: PentatonicType;
};

export const generatePentatonics = (
  scale: ScaleMaterial,
  spelling: SpellingPreference,
  systemId: "A" | "B" = "A",
  type: PentatonicType = "major"
): Pentatonic[] => {
  const definition = PENTATONIC_DEFINITIONS[type];

  return scale.notes.map((root, degree) => {
    const notes = definition.pattern.map((interval) => transposePitchClass(root, interval));
    const rootName = pitchClassListNames([root], spelling)[0];

    return {
      id: `${systemId}-${type}-pentatonic-${degree}`,
      degree,
      roman: ROMAN_NUMERALS[degree],
      root,
      name: `${rootName} ${definition.label}`,
      notes,
      noteNames: pitchClassListNames(notes, spelling),
      degreeLabels: definition.degreeLabels,
      type
    };
  });
};
