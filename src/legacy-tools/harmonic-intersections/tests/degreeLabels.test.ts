import { describe, expect, it } from "vitest";
import {
  buildDegreeLabels,
  buildDegreeLabelsFromPitchClasses,
  buildDegreeLabelsFromScaleDegree,
  combinedDegreeLabel,
  labelsForPitchClasses,
  rotateScaleNotes
} from "../music/degreeLabels";

describe("degree labels", () => {
  const cIonian = buildDegreeLabels([0, 2, 4, 5, 7, 9, 11]);
  const abIonian = buildDegreeLabels([8, 10, 0, 1, 3, 5, 7]);

  it("labels pitch classes by their scale degree", () => {
    expect(labelsForPitchClasses([0, 5, 7], cIonian)).toEqual(["1", "4", "5"]);
  });

  it("includes modal alterations in degree labels", () => {
    const cDorian = buildDegreeLabels([0, 2, 3, 5, 7, 9, 10]);
    expect(labelsForPitchClasses([0, 2, 3, 5, 7, 9, 10], cDorian)).toEqual([
      "1",
      "2",
      "b3",
      "4",
      "5",
      "6",
      "b7"
    ]);
  });

  it("shows both degrees for a common note when they differ", () => {
    expect(combinedDegreeLabel(0, cIonian, abIonian, true, true)).toBe("1/3");
  });

  it("collapses equal common degrees into one label", () => {
    expect(combinedDegreeLabel(0, cIonian, cIonian, true, true)).toBe("1");
  });

  it("rotates the parent scale to the selected arpeggio degree", () => {
    expect(rotateScaleNotes([8, 10, 0, 1, 3, 5, 7], 4)).toEqual([3, 5, 7, 8, 10, 0, 1]);
  });

  it("labels an Eb7 arpeggio from Ab Ionian relative to Eb Mixolydian", () => {
    const ebMixolydian = buildDegreeLabelsFromScaleDegree([8, 10, 0, 1, 3, 5, 7], 4);
    expect(labelsForPitchClasses([3, 7, 10, 1], ebMixolydian)).toEqual(["1", "3", "5", "b7"]);
  });

  it("labels a Dm7 arpeggio from C Ionian relative to D Dorian", () => {
    const dDorian = buildDegreeLabelsFromScaleDegree([0, 2, 4, 5, 7, 9, 11], 1);
    expect(labelsForPitchClasses([2, 5, 9, 0], dDorian)).toEqual(["1", "b3", "5", "b7"]);
  });

  it("uses the selected pentatonic formula as the degree reference", () => {
    const aMinorPentatonic = buildDegreeLabelsFromPitchClasses(
      [9, 0, 2, 4, 7],
      ["1", "b3", "4", "5", "b7"]
    );
    expect(labelsForPitchClasses([9, 0, 2, 4, 7], aMinorPentatonic)).toEqual(["1", "b3", "4", "5", "b7"]);
  });
});
