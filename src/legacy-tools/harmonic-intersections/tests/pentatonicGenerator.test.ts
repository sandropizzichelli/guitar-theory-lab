import { describe, expect, it } from "vitest";
import { generatePentatonics } from "../music/pentatonicGenerator";
import { generateScale } from "../music/scaleGenerator";

describe("pentatonic generation", () => {
  const cIonian = generateScale(0, "ionian", "flats");

  it("generates major pentatonics from every system degree", () => {
    const pentatonics = generatePentatonics(cIonian, "flats", "A", "major");

    expect(pentatonics).toHaveLength(7);
    expect(pentatonics[0].name).toBe("C Major pentatonic");
    expect(pentatonics[0].noteNames).toEqual(["C", "D", "E", "G", "A"]);
    expect(pentatonics[0].degreeLabels).toEqual(["1", "2", "3", "5", "6"]);
  });

  it("generates minor pentatonics from every system degree", () => {
    const pentatonics = generatePentatonics(cIonian, "flats", "B", "minor");

    expect(pentatonics[5].name).toBe("A Minor pentatonic");
    expect(pentatonics[5].noteNames).toEqual(["A", "C", "D", "E", "G"]);
    expect(pentatonics[5].degreeLabels).toEqual(["1", "b3", "4", "5", "b7"]);
  });
});
