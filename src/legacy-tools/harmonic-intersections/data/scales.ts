export type ScaleId =
  | "ionian"
  | "dorian"
  | "phrygian"
  | "lydian"
  | "mixolydian"
  | "aeolian"
  | "locrian"
  | "melodicMinor"
  | "dorianFlat2"
  | "lydianAugmented"
  | "lydianDominant"
  | "mixolydianFlat6"
  | "locrianSharp2"
  | "altered"
  | "harmonicMinor"
  | "locrianSharp6"
  | "ionianSharp5"
  | "dorianSharp4"
  | "phrygianDominant"
  | "lydianSharp2"
  | "ultralocrian";

export type ScaleFamilyId = "majorModes" | "melodicMinorModes" | "harmonicMinorModes";

export type ScaleDefinition = {
  id: ScaleId;
  label: string;
  shortLabel?: string;
  family: ScaleFamilyId;
  pattern: number[];
};

export const SCALE_PATTERNS: Record<ScaleId, number[]> = {
  ionian: [0, 2, 4, 5, 7, 9, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  locrian: [0, 1, 3, 5, 6, 8, 10],
  melodicMinor: [0, 2, 3, 5, 7, 9, 11],
  dorianFlat2: [0, 1, 3, 5, 7, 9, 10],
  lydianAugmented: [0, 2, 4, 6, 8, 9, 11],
  lydianDominant: [0, 2, 4, 6, 7, 9, 10],
  mixolydianFlat6: [0, 2, 4, 5, 7, 8, 10],
  locrianSharp2: [0, 2, 3, 5, 6, 8, 10],
  altered: [0, 1, 3, 4, 6, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  locrianSharp6: [0, 1, 3, 5, 6, 9, 10],
  ionianSharp5: [0, 2, 4, 5, 8, 9, 11],
  dorianSharp4: [0, 2, 3, 6, 7, 9, 10],
  phrygianDominant: [0, 1, 4, 5, 7, 8, 10],
  lydianSharp2: [0, 3, 4, 6, 7, 9, 11],
  ultralocrian: [0, 1, 3, 4, 6, 8, 9]
};

export const SCALE_FAMILIES: { id: ScaleFamilyId; label: string }[] = [
  { id: "majorModes", label: "Major scale modes" },
  { id: "melodicMinorModes", label: "Melodic minor modes" },
  { id: "harmonicMinorModes", label: "Harmonic minor modes" }
];

export const SCALES: ScaleDefinition[] = [
  { id: "ionian", label: "Ionian / Major", shortLabel: "Ionian", family: "majorModes", pattern: SCALE_PATTERNS.ionian },
  { id: "dorian", label: "Dorian", family: "majorModes", pattern: SCALE_PATTERNS.dorian },
  { id: "phrygian", label: "Phrygian", family: "majorModes", pattern: SCALE_PATTERNS.phrygian },
  { id: "lydian", label: "Lydian", family: "majorModes", pattern: SCALE_PATTERNS.lydian },
  { id: "mixolydian", label: "Mixolydian", family: "majorModes", pattern: SCALE_PATTERNS.mixolydian },
  { id: "aeolian", label: "Aeolian / Natural Minor", shortLabel: "Aeolian", family: "majorModes", pattern: SCALE_PATTERNS.aeolian },
  { id: "locrian", label: "Locrian", family: "majorModes", pattern: SCALE_PATTERNS.locrian },
  { id: "melodicMinor", label: "I - Melodic Minor", shortLabel: "Melodic Minor", family: "melodicMinorModes", pattern: SCALE_PATTERNS.melodicMinor },
  { id: "dorianFlat2", label: "II - Dorian b2", family: "melodicMinorModes", pattern: SCALE_PATTERNS.dorianFlat2 },
  { id: "lydianAugmented", label: "III - Lydian Augmented", family: "melodicMinorModes", pattern: SCALE_PATTERNS.lydianAugmented },
  { id: "lydianDominant", label: "IV - Lydian Dominant", family: "melodicMinorModes", pattern: SCALE_PATTERNS.lydianDominant },
  { id: "mixolydianFlat6", label: "V - Mixolydian b6", family: "melodicMinorModes", pattern: SCALE_PATTERNS.mixolydianFlat6 },
  { id: "locrianSharp2", label: "VI - Locrian #2", family: "melodicMinorModes", pattern: SCALE_PATTERNS.locrianSharp2 },
  { id: "altered", label: "VII - Altered / Super Locrian", shortLabel: "Altered", family: "melodicMinorModes", pattern: SCALE_PATTERNS.altered },
  { id: "harmonicMinor", label: "I - Harmonic Minor", shortLabel: "Harmonic Minor", family: "harmonicMinorModes", pattern: SCALE_PATTERNS.harmonicMinor },
  { id: "locrianSharp6", label: "II - Locrian #6", family: "harmonicMinorModes", pattern: SCALE_PATTERNS.locrianSharp6 },
  { id: "ionianSharp5", label: "III - Ionian #5", family: "harmonicMinorModes", pattern: SCALE_PATTERNS.ionianSharp5 },
  { id: "dorianSharp4", label: "IV - Dorian #4", family: "harmonicMinorModes", pattern: SCALE_PATTERNS.dorianSharp4 },
  { id: "phrygianDominant", label: "V - Phrygian Dominant", family: "harmonicMinorModes", pattern: SCALE_PATTERNS.phrygianDominant },
  { id: "lydianSharp2", label: "VI - Lydian #2", family: "harmonicMinorModes", pattern: SCALE_PATTERNS.lydianSharp2 },
  { id: "ultralocrian", label: "VII - Ultralocrian", family: "harmonicMinorModes", pattern: SCALE_PATTERNS.ultralocrian }
];

export const getScaleDefinition = (id: ScaleId) => {
  const scale = SCALES.find((item) => item.id === id);
  if (!scale) {
    throw new Error(`Unknown scale: ${id}`);
  }
  return scale;
};
