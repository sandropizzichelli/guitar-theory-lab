import { pitchClassSet, type PitchClass } from "./pitchClass";

export type MaterialComparison = {
  a: PitchClass[];
  b: PitchClass[];
  common: PitchClass[];
  onlyA: PitchClass[];
  onlyB: PitchClass[];
  commonCount: number;
  overlapPercent: number;
};

export const compareMaterials = (a: PitchClass[], b: PitchClass[]): MaterialComparison => {
  const aSet = pitchClassSet(a);
  const bSet = pitchClassSet(b);
  const common = [...aSet].filter((note) => bSet.has(note));
  const onlyA = [...aSet].filter((note) => !bSet.has(note));
  const onlyB = [...bSet].filter((note) => !aSet.has(note));
  const denominator = Math.max(aSet.size, bSet.size, 1);

  return {
    a: [...aSet],
    b: [...bSet],
    common,
    onlyA,
    onlyB,
    commonCount: common.length,
    overlapPercent: Math.round((common.length / denominator) * 100)
  };
};
