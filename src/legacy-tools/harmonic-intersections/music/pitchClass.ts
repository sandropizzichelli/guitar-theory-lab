import { NOTE_NAMES, type SpellingPreference } from "../data/noteNames";

export type PitchClass = number;

export const normalizePitchClass = (value: number): PitchClass => ((value % 12) + 12) % 12;

export const transposePitchClass = (pitchClass: PitchClass, semitones: number): PitchClass =>
  normalizePitchClass(pitchClass + semitones);

export const pitchClassName = (pitchClass: PitchClass, spelling: SpellingPreference): string =>
  NOTE_NAMES[spelling][normalizePitchClass(pitchClass)];

export const pitchClassListNames = (pitchClasses: PitchClass[], spelling: SpellingPreference): string[] =>
  pitchClasses.map((pitchClass) => pitchClassName(pitchClass, spelling));

export const uniquePitchClasses = (pitchClasses: PitchClass[]): PitchClass[] =>
  Array.from(new Set(pitchClasses.map(normalizePitchClass)));

export const pitchClassSet = (pitchClasses: PitchClass[]): Set<PitchClass> => new Set(uniquePitchClasses(pitchClasses));

export const intervalFormulaFromRoot = (root: PitchClass, notes: PitchClass[]): number[] =>
  notes.map((note) => normalizePitchClass(note - root));
