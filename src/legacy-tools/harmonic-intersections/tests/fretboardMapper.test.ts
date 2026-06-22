import { describe, expect, it } from "vitest";
import { buildFretboard, STANDARD_TUNING } from "../music/fretboardMapper";

describe("fretboard mapping", () => {
  it("displays standard tuning from high E to low E", () => {
    expect(STANDARD_TUNING.map((string) => string.stringName)).toEqual(["E", "B", "G", "D", "A", "E"]);
    expect(STANDARD_TUNING.map((string) => string.stringNumber)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("maps the second string from high E as B", () => {
    const fretboard = buildFretboard(12);
    const secondString = fretboard[1];

    expect(secondString[0].stringName).toBe("B");
    expect(secondString[0].pitchClass).toBe(11);
    expect(secondString[1].pitchClass).toBe(0);
  });
});
