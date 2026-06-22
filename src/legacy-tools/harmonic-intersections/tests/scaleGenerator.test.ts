import { describe, expect, it } from "vitest";
import { SCALE_FAMILIES, SCALES, SCALE_PATTERNS } from "../data/scales";
import { generateScale } from "../music/scaleGenerator";
import { compareMaterials } from "../music/intersectionAnalyzer";
import { pitchClassListNames, transposePitchClass } from "../music/pitchClass";

describe("scale generation and intersections", () => {
  it("generates C Ionian / Ab Ionian with the expected common notes", () => {
    const cIonian = generateScale(0, "ionian", "flats");
    const abIonian = generateScale(transposePitchClass(0, 8), "ionian", "flats");
    const comparison = compareMaterials(cIonian.notes, abIonian.notes);

    expect(cIonian.noteNames).toEqual(["C", "D", "E", "F", "G", "A", "B"]);
    expect(abIonian.noteNames).toEqual(["Ab", "Bb", "C", "Db", "Eb", "F", "G"]);
    expect(pitchClassListNames(comparison.common, "flats")).toEqual(["C", "F", "G"]);
    expect(comparison.commonCount).toBe(3);
  });

  it("generates C Ionian / G Ionian with six common notes", () => {
    const cIonian = generateScale(0, "ionian", "sharps");
    const gIonian = generateScale(transposePitchClass(0, 7), "ionian", "sharps");
    const comparison = compareMaterials(cIonian.notes, gIonian.notes);

    expect(gIonian.noteNames).toEqual(["G", "A", "B", "C", "D", "E", "F#"]);
    expect(pitchClassListNames(comparison.common, "sharps")).toEqual(["C", "D", "E", "G", "A", "B"]);
    expect(comparison.commonCount).toBe(6);
  });
});

describe("scale families", () => {
  it("separates major, melodic minor, and harmonic minor modal systems", () => {
    expect(SCALE_FAMILIES.map((family) => family.label)).toEqual([
      "Major scale modes",
      "Melodic minor modes",
      "Harmonic minor modes"
    ]);
    expect(SCALES.filter((scale) => scale.family === "majorModes")).toHaveLength(7);
    expect(SCALES.filter((scale) => scale.family === "melodicMinorModes")).toHaveLength(7);
    expect(SCALES.filter((scale) => scale.family === "harmonicMinorModes")).toHaveLength(7);
  });

  it("includes characteristic derived modes from melodic and harmonic minor", () => {
    expect(SCALE_PATTERNS.lydianDominant).toEqual([0, 2, 4, 6, 7, 9, 10]);
    expect(SCALE_PATTERNS.altered).toEqual([0, 1, 3, 4, 6, 8, 10]);
    expect(SCALE_PATTERNS.phrygianDominant).toEqual([0, 1, 4, 5, 7, 8, 10]);
  });
});
