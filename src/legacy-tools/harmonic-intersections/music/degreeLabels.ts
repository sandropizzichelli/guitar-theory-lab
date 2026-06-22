import { normalizePitchClass, type PitchClass } from "./pitchClass";

export type DegreeLabels = Map<PitchClass, string>;

const MAJOR_SCALE_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

const accidentalForDifference = (difference: number): string => {
  if (difference < 0) return "b".repeat(Math.abs(difference));
  if (difference > 0) return "#".repeat(difference);
  return "";
};

export const buildDegreeLabels = (scaleNotes: PitchClass[]): DegreeLabels => {
  const root = scaleNotes[0];

  return new Map(
    scaleNotes.map((pitchClass, index) => {
      const intervalFromRoot = normalizePitchClass(pitchClass - root);
      const referenceInterval = MAJOR_SCALE_INTERVALS[index];
      const difference = intervalFromRoot - referenceInterval;
      return [pitchClass, `${accidentalForDifference(difference)}${index + 1}`];
    })
  );
};

export const rotateScaleNotes = (scaleNotes: PitchClass[], startingDegree: number): PitchClass[] => {
  if (!scaleNotes.length) return [];

  const normalizedDegree = ((startingDegree % scaleNotes.length) + scaleNotes.length) % scaleNotes.length;
  return [...scaleNotes.slice(normalizedDegree), ...scaleNotes.slice(0, normalizedDegree)];
};

export const buildDegreeLabelsFromScaleDegree = (
  scaleNotes: PitchClass[],
  startingDegree: number
): DegreeLabels => buildDegreeLabels(rotateScaleNotes(scaleNotes, startingDegree));

export const buildDegreeLabelsFromPitchClasses = (
  pitchClasses: PitchClass[],
  labels: string[]
): DegreeLabels => new Map(pitchClasses.map((pitchClass, index) => [pitchClass, labels[index] ?? "–"]));

export const labelsForPitchClasses = (pitchClasses: PitchClass[], degreeLabels: DegreeLabels): string[] =>
  pitchClasses.map((pitchClass) => degreeLabels.get(pitchClass) ?? "–");

export const combinedDegreeLabel = (
  pitchClass: PitchClass,
  degreeLabelsA: DegreeLabels,
  degreeLabelsB: DegreeLabels,
  belongsToA: boolean,
  belongsToB: boolean
): string => {
  const degreeA = belongsToA ? degreeLabelsA.get(pitchClass) : undefined;
  const degreeB = belongsToB ? degreeLabelsB.get(pitchClass) : undefined;

  if (degreeA && degreeB && degreeA !== degreeB) return `${degreeA}/${degreeB}`;
  return degreeA ?? degreeB ?? "–";
};
