import { describe, expect, it } from "vitest";
import {
  buildDiatonicChords,
  buildCycleVoicingChain,
  buildInversionOptions,
  buildMovements,
  CYCLES,
  expectedFunctionalToneLabels,
  expectedStaticVoiceCount,
  findVoicings,
  findVoiceLeadingVoicings,
  functionalVoiceLeadingMismatch,
  generateScale,
  getChordType,
  getStringSet,
  nextDegree,
  rankTargetVoicings,
  rootPositionForVoicing,
  staticVoiceCountMismatch,
  STRING_SETS,
  summarizeMovements
} from "../src/music";

describe("diatonic material", () => {
  it("builds C Ionian triads and seventh chords", () => {
    const cIonian = generateScale(0, "ionian");
    const triads = buildDiatonicChords(cIonian, "triads");
    const sevenths = buildDiatonicChords(cIonian, "sevenths");

    expect(triads.map((chord) => `${chord.roman} ${chord.chordName}`)).toEqual([
      "I C",
      "II Dm",
      "III Em",
      "IV F",
      "V G",
      "VI Am",
      "VII Bdim"
    ]);
    expect(sevenths.map((chord) => `${chord.roman} ${chord.chordName}`)).toEqual([
      "I Cmaj7",
      "II Dm7",
      "III Em7",
      "IV Fmaj7",
      "V G7",
      "VI Am7",
      "VII Bm7b5"
    ]);
  });

  it("keeps Goodrick cycle motions separated", () => {
    expect(CYCLES.map((cycle) => cycle.label)).toEqual([
      "Seconds",
      "Thirds",
      "Fourths",
      "Fifths",
      "Sixths",
      "Sevenths"
    ]);
    expect(nextDegree(0, "seconds")).toBe(1);
    expect(nextDegree(0, "thirds")).toBe(2);
    expect(nextDegree(0, "fourths")).toBe(3);
    expect(nextDegree(0, "fifths")).toBe(4);
    expect(nextDegree(0, "sixths")).toBe(5);
    expect(nextDegree(0, "sevenths")).toBe(6);
  });

  it("splits string sets into close and spread voicing families", () => {
    expect(STRING_SETS.triads.filter((item) => item.voicing === "close").map((item) => item.label)).toEqual([
      "1-2-3",
      "2-3-4",
      "3-4-5",
      "4-5-6"
    ]);
    expect(STRING_SETS.triads.filter((item) => item.voicing === "spread").map((item) => item.label)).toEqual([
      "1-2-4",
      "1-3-4",
      "1-3-5",
      "2-3-5",
      "2-4-5",
      "2-4-6",
      "3-4-6",
      "3-5-6"
    ]);
    expect(STRING_SETS.sevenths.filter((item) => item.voicing === "close").map((item) => item.label)).toEqual([
      "1-2-3-4",
      "2-3-4-5",
      "3-4-5-6"
    ]);
    expect(STRING_SETS.sevenths.filter((item) => item.voicing === "spread").map((item) => item.label)).toEqual([
      "1-2-3-4",
      "2-3-4-5",
      "3-4-5-6",
      "1-2-3-5",
      "2-3-4-6",
      "1-2-4-5",
      "2-3-5-6",
      "1-2-4-5",
      "2-3-5-6"
    ]);
    expect([...new Map(
      STRING_SETS.sevenths
        .filter((item) => item.voicing === "spread")
        .map((item) => [item.dropType, item.dropLabel])
    ).values()]).toEqual([
      "Drop 2",
      "Drop 3",
      "Drop 2&3",
      "Drop 2&4"
    ]);
  });
});

describe("guitar voicings", () => {
  it("finds C major root position on the upper three strings", () => {
    const cIonian = generateScale(0, "ionian");
    const [cMajor] = buildDiatonicChords(cIonian, "triads");
    const voicings = findVoicings({
      chord: cMajor,
      stringSet: getStringSet("triads", "triad-high"),
      inversion: 0,
      fretWindow: { start: 0, end: 8 },
      maxSpan: 5,
      allowOpenStrings: true
    });

    expect(voicings.some((voicing) => voicing.positions.map((position) => position.fret).join("-") === "5-5-3")).toBe(true);
  });

  it("offers all three tonic string placements for an upper-string C triad start", () => {
    const cIonian = generateScale(0, "ionian");
    const [cMajor] = buildDiatonicChords(cIonian, "triads");
    const voicings = findVoiceLeadingVoicings({
      chord: cMajor,
      stringSet: getStringSet("triads", "triad-high"),
      fretWindow: { start: 0, end: 12 },
      maxSpan: 5,
      allowOpenStrings: true
    });
    const rootStrings = [...new Set(voicings.map((voicing) => rootPositionForVoicing(voicing)?.stringNumber))]
      .filter(Boolean)
      .sort((a, b) => a - b);

    expect(rootStrings).toEqual([1, 2, 3]);
  });

  it("lists every theoretical starting inversion in the selector", () => {
    expect(buildInversionOptions(getChordType("triads")).map((option) => option.label)).toEqual([
      "Root position",
      "First inversion",
      "Second inversion"
    ]);
    expect(buildInversionOptions(getChordType("sevenths")).map((option) => option.label)).toEqual([
      "Root position",
      "First inversion",
      "Second inversion",
      "Third inversion"
    ]);
  });

  it("finds all close-position starting inversions inside the displayed fretboard", () => {
    const cIonian = generateScale(0, "ionian");
    const cases = [
      ["triads", buildDiatonicChords(cIonian, "triads")[0], [0, 1, 2]],
      ["sevenths", buildDiatonicChords(cIonian, "sevenths")[0], [0, 1, 2, 3]]
    ];

    cases.forEach(([chordTypeId, chord, expectedInversions]) => {
      STRING_SETS[chordTypeId]
        .filter((item) => item.voicing === "close")
        .forEach((stringSet) => {
          const voicings = findVoiceLeadingVoicings({
            chord,
            stringSet: getStringSet(chordTypeId, stringSet.id),
            fretWindow: { start: 0, end: 12 },
            maxSpan: 12,
            allowOpenStrings: true
          });
          const inversions = [...new Set(voicings.map((voicing) => voicing.inversion))]
            .sort((a, b) => a - b);

          expect(inversions).toEqual(expectedInversions);
        });
    });
  });

  it("uses Goodrick spread tone orders for triads and seventh-chord drops", () => {
    const cIonian = generateScale(0, "ionian");
    const [cMajor] = buildDiatonicChords(cIonian, "triads");
    const [cMajor7] = buildDiatonicChords(cIonian, "sevenths");
    const common = {
      fretWindow: { start: 0, end: 12 },
      maxSpan: 12,
      allowOpenStrings: true
    };
    const triadSpread = findVoicings({
      chord: cMajor,
      stringSet: getStringSet("triads", "triad-spread-1-3-5"),
      inversion: 0,
      ...common
    })[0];
    const seventhCases = [
      ["seventh-drop2-top", ["R", "5", "7", "3"]],
      ["seventh-drop3-top", ["R", "7", "3", "5"]],
      ["seventh-drop23-top", ["R", "3", "7", "5"]],
      ["seventh-drop24-top", ["R", "5", "3", "7"]]
    ];

    expect(triadSpread.positions.map((position) => position.tone.toneLabel)).toEqual(["R", "5", "3"]);

    seventhCases.forEach(([stringSetId, expectedLabels]) => {
      const voicing = findVoicings({
        chord: cMajor7,
        stringSet: getStringSet("sevenths", stringSetId),
        inversion: 0,
        ...common
      })[0];

      expect(voicing.positions.map((position) => position.tone.toneLabel)).toEqual(expectedLabels);
    });
  });

  it("ranks targets by efficient movement", () => {
    const cIonian = generateScale(0, "ionian");
    const chords = buildDiatonicChords(cIonian, "triads");
    const stringSet = getStringSet("triads", "triad-high");
    const current = findVoicings({
      chord: chords[0],
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    })[0];
    const targets = findVoiceLeadingVoicings({
      chord: chords[1],
      stringSet,
      fretWindow: { start: 0, end: 17 },
      maxSpan: 12,
      allowOpenStrings: true
    });
    const ranked = rankTargetVoicings(current, targets);
    const first = summarizeMovements(buildMovements(current, ranked[0]));
    const last = summarizeMovements(buildMovements(current, ranked[ranked.length - 1]));

    expect(ranked.length).toBeGreaterThan(1);
    expect(first.totalSemitones).toBeLessThanOrEqual(last.totalSemitones);
  });

  it("keeps two common tones fixed when triads move by thirds", () => {
    const cIonian = generateScale(0, "ionian");
    const chords = buildDiatonicChords(cIonian, "triads");
    const stringSet = getStringSet("triads", "triad-high");
    const current = findVoicings({
      chord: chords[0],
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    }).find((voicing) => voicing.positions.map((position) => position.fret).join("-") === "5-5-3");
    const targets = findVoiceLeadingVoicings({
      chord: chords[2],
      stringSet,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    });
    const [target] = rankTargetVoicings(current, targets, {
      cycleId: "thirds"
    });
    const summary = summarizeMovements(buildMovements(current, target));

    expect(target.positions.map((position) => position.fret)).toEqual([4, 5, 3]);
    expect(target.positions.map((position) => position.tone.toneLabel)).toEqual(["5", "R", "3"]);
    expect(summary.staticVoices).toBe(2);
    expect(summary.totalSemitones).toBe(1);
  });

  it("rotates triad functions through the strings for a descending seconds cycle", () => {
    const cIonian = generateScale(0, "ionian");
    const chords = buildDiatonicChords(cIonian, "triads");
    const stringSet = getStringSet("triads", "triad-high");
    const current = findVoicings({
      chord: chords[0],
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    }).find((voicing) => voicing.positions.map((position) => position.fret).join("-") === "5-5-3");
    const targets = findVoiceLeadingVoicings({
      chord: chords[1],
      stringSet,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    });
    const [target] = rankTargetVoicings(current, targets, {
      cycleId: "seconds"
    });

    expect(expectedFunctionalToneLabels(current, "seconds")).toEqual(["5", "R", "3"]);
    expect(target.positions.map((position) => position.tone.toneLabel)).toEqual(["5", "R", "3"]);
    expect(target.positions.map((position) => position.fret)).toEqual([2, 3, 1]);
    expect(target.positions.find((position) => position.tone.toneLabel === "R").stringNumber).toBe(2);
    expect(functionalVoiceLeadingMismatch(current, target, {
      cycleId: "seconds"
    })).toBe(0);
    expect(staticVoiceCountMismatch(current, target, {
      cycleId: "seconds"
    })).toBe(0);
  });

  it("uses Goodrick common-tone counts for separated triad cycles", () => {
    const cIonian = generateScale(0, "ionian");
    const chords = buildDiatonicChords(cIonian, "triads");
    const stringSet = getStringSet("triads", "triad-high");
    const current = findVoicings({
      chord: chords[0],
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    }).find((voicing) => voicing.positions.map((position) => position.fret).join("-") === "5-5-3");
    const cases = [
      ["seconds", 1, 0],
      ["thirds", 2, 2],
      ["fourths", 3, 1],
      ["fifths", 4, 1],
      ["sixths", 5, 2],
      ["sevenths", 6, 0]
    ];

    cases.forEach(([cycleId, targetDegree, expectedStaticVoices]) => {
      const targets = findVoiceLeadingVoicings({
        chord: chords[targetDegree],
        stringSet,
        fretWindow: { start: 0, end: 12 },
        maxSpan: 6,
        allowOpenStrings: true
      });
      const [target] = rankTargetVoicings(current, targets, {
        cycleId
      });
      const summary = summarizeMovements(buildMovements(current, target));

      expect(expectedStaticVoiceCount(3, cycleId)).toBe(expectedStaticVoices);
      expect(summary.staticVoices).toBe(expectedStaticVoices);
      expect(staticVoiceCountMismatch(current, target, {
        cycleId
      })).toBe(0);
    });
  });

  it("keeps one common tone and rotates seventh-chord functions in a seconds cycle", () => {
    const cIonian = generateScale(0, "ionian");
    const chords = buildDiatonicChords(cIonian, "sevenths");
    const stringSet = getStringSet("sevenths", "seventh-high");
    const current = findVoicings({
      chord: chords[0],
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    }).find((voicing) => voicing.positions.map((position) => position.fret).join("-") === "10-9-8-7");
    const targets = findVoiceLeadingVoicings({
      chord: chords[1],
      stringSet,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    });
    const [target] = rankTargetVoicings(current, targets, {
      cycleId: "seconds"
    });

    expect(expectedFunctionalToneLabels(current, "seconds")).toEqual(["7", "R", "3", "5"]);
    expect(target.positions.map((position) => position.tone.toneLabel)).toEqual(["7", "R", "3", "5"]);
    expect(summarizeMovements(buildMovements(current, target)).staticVoices).toBe(1);
  });

  it("uses Goodrick common-tone counts for separated seventh-chord cycles", () => {
    const cIonian = generateScale(0, "ionian");
    const chords = buildDiatonicChords(cIonian, "sevenths");
    const stringSet = getStringSet("sevenths", "seventh-high");
    const current = findVoicings({
      chord: chords[0],
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    }).find((voicing) => voicing.positions.map((position) => position.fret).join("-") === "10-9-8-7");
    const cases = [
      ["seconds", 1, 1],
      ["thirds", 2, 3],
      ["fourths", 3, 2],
      ["fifths", 4, 2],
      ["sixths", 5, 3],
      ["sevenths", 6, 1]
    ];

    cases.forEach(([cycleId, targetDegree, expectedStaticVoices]) => {
      const targets = findVoiceLeadingVoicings({
        chord: chords[targetDegree],
        stringSet,
        fretWindow: { start: 0, end: 12 },
        maxSpan: 6,
        allowOpenStrings: true
      });
      const [target] = rankTargetVoicings(current, targets, {
        cycleId
      });
      const summary = summarizeMovements(buildMovements(current, target));

      expect(expectedStaticVoiceCount(4, cycleId)).toBe(expectedStaticVoices);
      expect(summary.staticVoices).toBe(expectedStaticVoices);
      expect(staticVoiceCountMismatch(current, target, {
        cycleId
      })).toBe(0);
    });
  });

  it("builds a complete cycle chain from a selected voicing", () => {
    const cIonian = generateScale(0, "ionian");
    const chords = buildDiatonicChords(cIonian, "triads");
    const stringSet = getStringSet("triads", "triad-high");
    const initialVoicing = findVoicings({
      chord: chords[0],
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true
    })[0];
    const chain = buildCycleVoicingChain({
      degrees: [0, 2, 4, 6, 1, 3, 5],
      chords,
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 6,
      allowOpenStrings: true,
      cycleId: "thirds",
      initialVoicing
    });

    expect(chain).toHaveLength(7);
    expect(chain[0].voicing).toBe(initialVoicing);
    expect(chain.every((item) => item.chord && item.candidateCount >= 0)).toBe(true);
    expect(chain.slice(0, -1).map((item, index) =>
      summarizeMovements(buildMovements(item.voicing, chain[index + 1].voicing)).staticVoices
    )).toEqual([2, 2, 2, 2, 2, 2]);
  });

  it("keeps expected common tones across complete seventh-chord cycle chains", () => {
    const cIonian = generateScale(0, "ionian");
    const chords = buildDiatonicChords(cIonian, "sevenths");
    const stringSet = getStringSet("sevenths", "seventh-high");
    const initialVoicing = findVoicings({
      chord: chords[0],
      stringSet,
      inversion: 0,
      fretWindow: { start: 0, end: 12 },
      maxSpan: 10,
      allowOpenStrings: true
    }).find((voicing) => voicing.positions.map((position) => position.fret).join("-") === "10-9-8-7");
    const cases = [
      ["seconds", [0, 1, 2, 3, 4, 5, 6], 1],
      ["thirds", [0, 2, 4, 6, 1, 3, 5], 3],
      ["fourths", [0, 3, 6, 2, 5, 1, 4], 2],
      ["fifths", [0, 4, 1, 5, 2, 6, 3], 2],
      ["sixths", [0, 5, 3, 1, 6, 4, 2], 3],
      ["sevenths", [0, 6, 5, 4, 3, 2, 1], 1]
    ];

    cases.forEach(([cycleId, degrees, expectedStaticVoices]) => {
      const chain = buildCycleVoicingChain({
        degrees,
        chords,
        stringSet,
        inversion: 0,
        fretWindow: { start: 0, end: 12 },
        maxSpan: 10,
        allowOpenStrings: true,
        cycleId,
        initialVoicing
      });

      expect(chain.slice(0, -1).map((item, index) =>
        summarizeMovements(buildMovements(item.voicing, chain[index + 1].voicing)).staticVoices
      )).toEqual(Array(6).fill(expectedStaticVoices));
    });
  });
});
