import { normalizePitchClass, type PitchClass } from "./pitchClass";

export type FretPosition = {
  stringNumber: number;
  stringName: string;
  stringPitchClass: PitchClass;
  fret: number;
  pitchClass: PitchClass;
};

export const STANDARD_TUNING = [
  { stringNumber: 1, stringName: "E", pitchClass: 4 },
  { stringNumber: 2, stringName: "B", pitchClass: 11 },
  { stringNumber: 3, stringName: "G", pitchClass: 7 },
  { stringNumber: 4, stringName: "D", pitchClass: 2 },
  { stringNumber: 5, stringName: "A", pitchClass: 9 },
  { stringNumber: 6, stringName: "E", pitchClass: 4 }
];

export const buildFretboard = (fretCount = 17): FretPosition[][] =>
  STANDARD_TUNING.map((string) =>
    Array.from({ length: fretCount + 1 }, (_, fret) => ({
      stringNumber: string.stringNumber,
      stringName: string.stringName,
      stringPitchClass: string.pitchClass,
      fret,
      pitchClass: normalizePitchClass(string.pitchClass + fret)
    }))
  );
