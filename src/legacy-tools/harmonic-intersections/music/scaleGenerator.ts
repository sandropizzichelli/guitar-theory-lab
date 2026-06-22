import { getScaleDefinition, type ScaleId } from "../data/scales";
import { pitchClassListNames, transposePitchClass, type PitchClass } from "./pitchClass";
import type { SpellingPreference } from "../data/noteNames";

export type ScaleMaterial = {
  root: PitchClass;
  scaleId: ScaleId;
  label: string;
  notes: PitchClass[];
  noteNames: string[];
};

export const generateScale = (
  root: PitchClass,
  scaleId: ScaleId,
  spelling: SpellingPreference
): ScaleMaterial => {
  const definition = getScaleDefinition(scaleId);
  const notes = definition.pattern.map((interval) => transposePitchClass(root, interval));

  return {
    root,
    scaleId,
    label: definition.shortLabel ?? definition.label,
    notes,
    noteNames: pitchClassListNames(notes, spelling)
  };
};
