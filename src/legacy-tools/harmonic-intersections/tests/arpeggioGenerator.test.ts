import { describe, expect, it } from "vitest";
import { generateArpeggios, generateSeventhArpeggios } from "../music/arpeggioGenerator";
import { compareMaterials } from "../music/intersectionAnalyzer";
import { pitchClassListNames, transposePitchClass } from "../music/pitchClass";
import { generateScale } from "../music/scaleGenerator";

describe("seventh arpeggio generation", () => {
  it("generates the expected C Ionian seventh arpeggios", () => {
    const cIonian = generateScale(0, "ionian", "flats");
    const arpeggios = generateSeventhArpeggios(cIonian, "flats");

    expect(arpeggios.map((arpeggio) => `${arpeggio.roman} ${arpeggio.chordName}`)).toEqual([
      "I Cmaj7",
      "II Dm7",
      "III Em7",
      "IV Fmaj7",
      "V G7",
      "VI Am7",
      "VII Bm7b5"
    ]);
  });

  it("compares Cmaj7 and Abmaj7 with the expected common tones", () => {
    const cIonian = generateScale(0, "ionian", "flats");
    const abIonian = generateScale(transposePitchClass(0, 8), "ionian", "flats");
    const cmaj7 = generateSeventhArpeggios(cIonian, "flats", "A")[0];
    const abmaj7 = generateSeventhArpeggios(abIonian, "flats", "B")[0];
    const comparison = compareMaterials(cmaj7.notes, abmaj7.notes);

    expect(cmaj7.noteNames).toEqual(["C", "E", "G", "B"]);
    expect(abmaj7.noteNames).toEqual(["Ab", "C", "Eb", "G"]);
    expect(pitchClassListNames(comparison.common, "flats")).toEqual(["C", "G"]);
    expect(comparison.commonCount).toBe(2);
  });

  it("generates selectable arpeggio structures", () => {
    const cIonian = generateScale(0, "ionian", "flats");

    expect(generateArpeggios(cIonian, "flats", "A", "triad")[0].noteNames).toEqual(["C", "E", "G"]);
    expect(generateArpeggios(cIonian, "flats", "A", "seventh")[0].noteNames).toEqual(["C", "E", "G", "B"]);
    expect(generateArpeggios(cIonian, "flats", "A", "ninth")[0].noteNames).toEqual(["C", "E", "G", "B", "D"]);
    expect(generateArpeggios(cIonian, "flats", "A", "thirteenth")[0].noteNames).toEqual([
      "C",
      "E",
      "G",
      "B",
      "D",
      "F",
      "A"
    ]);
  });
});
