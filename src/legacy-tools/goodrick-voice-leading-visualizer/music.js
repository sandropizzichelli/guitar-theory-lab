export const NOTE_NAMES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

export const NOTE_OPTIONS = NOTE_NAMES.map((label, pitchClass) => ({
  label,
  pitchClass
}));

export const SCALE_FAMILIES = [
  { id: "major", label: "Major scale modes" },
  { id: "melodicMinor", label: "Melodic minor modes" },
  { id: "harmonicMinor", label: "Harmonic minor modes" }
];

export const SCALE_OPTIONS = [
  { id: "ionian", family: "major", label: "Ionian / Major", pattern: [0, 2, 4, 5, 7, 9, 11] },
  { id: "dorian", family: "major", label: "Dorian", pattern: [0, 2, 3, 5, 7, 9, 10] },
  { id: "phrygian", family: "major", label: "Phrygian", pattern: [0, 1, 3, 5, 7, 8, 10] },
  { id: "lydian", family: "major", label: "Lydian", pattern: [0, 2, 4, 6, 7, 9, 11] },
  { id: "mixolydian", family: "major", label: "Mixolydian", pattern: [0, 2, 4, 5, 7, 9, 10] },
  { id: "aeolian", family: "major", label: "Aeolian / Natural Minor", pattern: [0, 2, 3, 5, 7, 8, 10] },
  { id: "locrian", family: "major", label: "Locrian", pattern: [0, 1, 3, 5, 6, 8, 10] },
  { id: "melodicMinor", family: "melodicMinor", label: "I - Melodic Minor", pattern: [0, 2, 3, 5, 7, 9, 11] },
  { id: "dorianFlat2", family: "melodicMinor", label: "II - Dorian b2", pattern: [0, 1, 3, 5, 7, 9, 10] },
  { id: "lydianAugmented", family: "melodicMinor", label: "III - Lydian Augmented", pattern: [0, 2, 4, 6, 8, 9, 11] },
  { id: "lydianDominant", family: "melodicMinor", label: "IV - Lydian Dominant", pattern: [0, 2, 4, 6, 7, 9, 10] },
  { id: "mixolydianFlat6", family: "melodicMinor", label: "V - Mixolydian b6", pattern: [0, 2, 4, 5, 7, 8, 10] },
  { id: "locrianSharp2", family: "melodicMinor", label: "VI - Locrian #2", pattern: [0, 2, 3, 5, 6, 8, 10] },
  { id: "altered", family: "melodicMinor", label: "VII - Altered / Super Locrian", pattern: [0, 1, 3, 4, 6, 8, 10] },
  { id: "harmonicMinor", family: "harmonicMinor", label: "I - Harmonic Minor", pattern: [0, 2, 3, 5, 7, 8, 11] },
  { id: "locrianSharp6", family: "harmonicMinor", label: "II - Locrian #6", pattern: [0, 1, 3, 5, 6, 9, 10] },
  { id: "ionianSharp5", family: "harmonicMinor", label: "III - Ionian #5", pattern: [0, 2, 4, 5, 8, 9, 11] },
  { id: "dorianSharp4", family: "harmonicMinor", label: "IV - Dorian #4", pattern: [0, 2, 3, 6, 7, 9, 10] },
  { id: "phrygianDominant", family: "harmonicMinor", label: "V - Phrygian Dominant", pattern: [0, 1, 4, 5, 7, 8, 10] },
  { id: "lydianSharp2", family: "harmonicMinor", label: "VI - Lydian #2", pattern: [0, 3, 4, 6, 7, 9, 11] },
  { id: "ultralocrian", family: "harmonicMinor", label: "VII - Ultralocrian", pattern: [0, 1, 3, 4, 6, 8, 9] }
];

export const CHORD_TYPES = [
  {
    id: "triads",
    label: "Triads",
    offsets: [0, 2, 4],
    toneLabels: ["R", "3", "5"],
    inversionLabels: ["Root position", "First inversion", "Second inversion"]
  },
  {
    id: "sevenths",
    label: "Seventh chords",
    offsets: [0, 2, 4, 6],
    toneLabels: ["R", "3", "5", "7"],
    inversionLabels: ["Root position", "First inversion", "Second inversion", "Third inversion"]
  }
];

export const CYCLE_DIRECTIONS = [
  { id: "ascending", label: "Ascending" },
  { id: "descending", label: "Descending" }
];

export const CYCLES = [
  {
    id: "seconds",
    label: "Seconds",
    shortLabel: "2e",
    step: 1,
    family: "seconds-sevenths",
    rotation: -1
  },
  {
    id: "thirds",
    label: "Thirds",
    shortLabel: "3e",
    step: 2,
    family: "thirds-sixths",
    rotation: -1
  },
  {
    id: "fourths",
    label: "Fourths",
    shortLabel: "4e",
    step: 3,
    family: "fourths-fifths",
    rotation: -1
  },
  {
    id: "fifths",
    label: "Fifths",
    shortLabel: "5e",
    step: 4,
    family: "fourths-fifths",
    rotation: 1
  },
  {
    id: "sixths",
    label: "Sixths",
    shortLabel: "6e",
    step: 5,
    family: "thirds-sixths",
    rotation: 1
  },
  {
    id: "sevenths",
    label: "Sevenths",
    shortLabel: "7e",
    step: 6,
    family: "seconds-sevenths",
    rotation: 1
  }
];

const LEGACY_CYCLES = {
  "seconds-sevenths": {
    id: "seconds-sevenths",
    label: "Seconds / Sevenths",
    shortLabel: "2e / 7e",
    family: "seconds-sevenths",
    steps: { ascending: 6, descending: 1 }
  },
  "thirds-sixths": {
    id: "thirds-sixths",
    label: "Thirds / Sixths",
    shortLabel: "3e / 6e",
    family: "thirds-sixths",
    steps: { ascending: 5, descending: 2 }
  },
  "fourths-fifths": {
    id: "fourths-fifths",
    label: "Fourths / Fifths",
    shortLabel: "4e / 5e",
    family: "fourths-fifths",
    steps: { ascending: 4, descending: 3 }
  }
};

const TRIAD_SPREAD_ORDERS = [
  ["R", "5", "3"],
  ["3", "R", "5"],
  ["5", "3", "R"]
];

const SEVENTH_DROP2_ORDERS = [
  ["R", "5", "7", "3"],
  ["3", "7", "R", "5"],
  ["5", "R", "3", "7"],
  ["7", "3", "5", "R"]
];

const SEVENTH_DROP3_ORDERS = [
  ["R", "7", "3", "5"],
  ["3", "R", "5", "7"],
  ["5", "3", "7", "R"],
  ["7", "5", "R", "3"]
];

const SEVENTH_DROP23_ORDERS = [
  ["R", "3", "7", "5"],
  ["3", "5", "R", "7"],
  ["5", "7", "3", "R"],
  ["7", "R", "5", "3"]
];

const SEVENTH_DROP24_ORDERS = [
  ["R", "5", "3", "7"],
  ["3", "7", "5", "R"],
  ["5", "R", "7", "3"],
  ["7", "3", "R", "5"]
];

export const STRING_SETS = {
  triads: [
    { id: "triad-high", label: "1-2-3", voicing: "close", strings: [1, 2, 3] },
    { id: "triad-upper-mid", label: "2-3-4", voicing: "close", strings: [2, 3, 4] },
    { id: "triad-lower-mid", label: "3-4-5", voicing: "close", strings: [3, 4, 5] },
    { id: "triad-low", label: "4-5-6", voicing: "close", strings: [4, 5, 6] },
    { id: "triad-spread-top", label: "1-2-4", voicing: "spread", strings: [1, 2, 4], toneOrders: TRIAD_SPREAD_ORDERS },
    { id: "triad-spread-1-3-4", label: "1-3-4", voicing: "spread", strings: [1, 3, 4], toneOrders: TRIAD_SPREAD_ORDERS },
    { id: "triad-spread-1-3-5", label: "1-3-5", voicing: "spread", strings: [1, 3, 5], toneOrders: TRIAD_SPREAD_ORDERS },
    { id: "triad-spread-middle", label: "2-3-5", voicing: "spread", strings: [2, 3, 5], toneOrders: TRIAD_SPREAD_ORDERS },
    { id: "triad-spread-2-4-5", label: "2-4-5", voicing: "spread", strings: [2, 4, 5], toneOrders: TRIAD_SPREAD_ORDERS },
    { id: "triad-spread-2-4-6", label: "2-4-6", voicing: "spread", strings: [2, 4, 6], toneOrders: TRIAD_SPREAD_ORDERS },
    { id: "triad-spread-low", label: "3-4-6", voicing: "spread", strings: [3, 4, 6], toneOrders: TRIAD_SPREAD_ORDERS },
    { id: "triad-spread-3-5-6", label: "3-5-6", voicing: "spread", strings: [3, 5, 6], toneOrders: TRIAD_SPREAD_ORDERS }
  ],
  sevenths: [
    { id: "seventh-high", label: "1-2-3-4", voicing: "close", strings: [1, 2, 3, 4] },
    { id: "seventh-middle", label: "2-3-4-5", voicing: "close", strings: [2, 3, 4, 5] },
    { id: "seventh-low", label: "3-4-5-6", voicing: "close", strings: [3, 4, 5, 6] },
    { id: "seventh-drop2-top", label: "1-2-3-4", voicing: "spread", dropType: "drop2", dropLabel: "Drop 2", strings: [1, 2, 3, 4], toneOrders: SEVENTH_DROP2_ORDERS },
    { id: "seventh-drop2-mid", label: "2-3-4-5", voicing: "spread", dropType: "drop2", dropLabel: "Drop 2", strings: [2, 3, 4, 5], toneOrders: SEVENTH_DROP2_ORDERS },
    { id: "seventh-drop2-low", label: "3-4-5-6", voicing: "spread", dropType: "drop2", dropLabel: "Drop 2", strings: [3, 4, 5, 6], toneOrders: SEVENTH_DROP2_ORDERS },
    { id: "seventh-drop3-top", label: "1-2-3-5", voicing: "spread", dropType: "drop3", dropLabel: "Drop 3", strings: [1, 2, 3, 5], toneOrders: SEVENTH_DROP3_ORDERS },
    { id: "seventh-drop3-low", label: "2-3-4-6", voicing: "spread", dropType: "drop3", dropLabel: "Drop 3", strings: [2, 3, 4, 6], toneOrders: SEVENTH_DROP3_ORDERS },
    { id: "seventh-drop23-top", label: "1-2-4-5", voicing: "spread", dropType: "drop23", dropLabel: "Drop 2&3", strings: [1, 2, 4, 5], toneOrders: SEVENTH_DROP23_ORDERS },
    { id: "seventh-drop23-low", label: "2-3-5-6", voicing: "spread", dropType: "drop23", dropLabel: "Drop 2&3", strings: [2, 3, 5, 6], toneOrders: SEVENTH_DROP23_ORDERS },
    { id: "seventh-drop24-top", label: "1-2-4-5", voicing: "spread", dropType: "drop24", dropLabel: "Drop 2&4", strings: [1, 2, 4, 5], toneOrders: SEVENTH_DROP24_ORDERS },
    { id: "seventh-drop24-low", label: "2-3-5-6", voicing: "spread", dropType: "drop24", dropLabel: "Drop 2&4", strings: [2, 3, 5, 6], toneOrders: SEVENTH_DROP24_ORDERS }
  ]
};

export const STANDARD_TUNING = [
  { stringNumber: 1, name: "E", pitchClass: 4, midi: 64 },
  { stringNumber: 2, name: "B", pitchClass: 11, midi: 59 },
  { stringNumber: 3, name: "G", pitchClass: 7, midi: 55 },
  { stringNumber: 4, name: "D", pitchClass: 2, midi: 50 },
  { stringNumber: 5, name: "A", pitchClass: 9, midi: 45 },
  { stringNumber: 6, name: "E", pitchClass: 4, midi: 40 }
];

export const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V", "VI", "VII"];

export function normalizePitchClass(value) {
  return ((value % 12) + 12) % 12;
}

export function noteName(pitchClass) {
  return NOTE_NAMES[normalizePitchClass(pitchClass)];
}

export function getScaleDefinition(scaleId) {
  const scale = SCALE_OPTIONS.find((item) => item.id === scaleId);
  if (!scale) throw new Error(`Unknown scale: ${scaleId}`);
  return scale;
}

export function getChordType(chordTypeId) {
  const chordType = CHORD_TYPES.find((item) => item.id === chordTypeId);
  if (!chordType) throw new Error(`Unknown chord type: ${chordTypeId}`);
  return chordType;
}

export function getCycle(cycleId) {
  const cycle = CYCLES.find((item) => item.id === cycleId) ?? LEGACY_CYCLES[cycleId];
  if (!cycle) throw new Error(`Unknown cycle: ${cycleId}`);
  return cycle;
}

export function getCycleStep(cycleId, cycleDirection = null) {
  const cycle = getCycle(cycleId);
  if (typeof cycle.step === "number") return cycle.step;

  const direction = cycleDirection ?? "descending";
  const step = cycle.steps?.[direction];
  if (!step) throw new Error(`Unknown cycle direction: ${cycleDirection}`);
  return step;
}

export function getStringSet(chordTypeId, stringSetId) {
  const stringSet = STRING_SETS[chordTypeId]?.find((item) => item.id === stringSetId);
  if (!stringSet) throw new Error(`Unknown string set: ${stringSetId}`);
  return stringSet;
}

export function generateScale(root, scaleId) {
  const definition = getScaleDefinition(scaleId);
  const notes = definition.pattern.map((interval) => normalizePitchClass(root + interval));

  return {
    root,
    id: definition.id,
    label: definition.label,
    notes,
    noteNames: notes.map(noteName)
  };
}

function intervalFormula(root, notes) {
  return notes.map((note) => normalizePitchClass(note - root));
}

function chordQuality(formula, chordTypeId) {
  const key = formula.join(",");

  if (chordTypeId === "triads") {
    if (key === "0,4,7") return "";
    if (key === "0,3,7") return "m";
    if (key === "0,3,6") return "dim";
    if (key === "0,4,8") return "aug";
  }

  if (key === "0,4,7,11") return "maj7";
  if (key === "0,4,7,10") return "7";
  if (key === "0,3,7,10") return "m7";
  if (key === "0,3,6,10") return "m7b5";
  if (key === "0,3,6,9") return "dim7";
  if (key === "0,3,7,11") return "mMaj7";
  if (key === "0,4,8,11") return "maj7#5";
  if (key === "0,4,8,10") return "7#5";

  return `(${formula.join("-")})`;
}

export function buildDiatonicChords(scale, chordTypeId) {
  const chordType = getChordType(chordTypeId);

  return scale.notes.map((root, degree) => {
    const tones = chordType.offsets.map((offset, toneIndex) => {
      const scaleDegree = (degree + offset) % scale.notes.length;
      const pitchClass = scale.notes[scaleDegree];

      return {
        pitchClass,
        noteName: noteName(pitchClass),
        toneLabel: chordType.toneLabels[toneIndex],
        scaleDegree
      };
    });
    const notes = tones.map((tone) => tone.pitchClass);
    const formula = intervalFormula(root, notes);
    const quality = chordQuality(formula, chordTypeId);

    return {
      id: `${scale.root}-${scale.id}-${chordTypeId}-${degree}`,
      degree,
      roman: ROMAN_NUMERALS[degree],
      root,
      chordName: `${noteName(root)}${quality}`,
      quality,
      notes,
      noteNames: notes.map(noteName),
      formula,
      tones
    };
  });
}

export function nextDegree(degree, cycleId, cycleDirection = null, scaleLength = 7) {
  if (typeof cycleDirection === "number") {
    return (degree + getCycleStep(cycleId)) % cycleDirection;
  }

  return (degree + getCycleStep(cycleId, cycleDirection)) % scaleLength;
}

function cycleFamily(cycleId) {
  return getCycle(cycleId).family;
}

function cycleRotation(cycleId, cycleDirection = "descending") {
  const cycle = getCycle(cycleId);

  if (typeof cycle.rotation === "number") {
    return cycle.rotation;
  }

  return cycleDirection === "ascending" ? 1 : -1;
}

function rotate(items, amount) {
  return [...items.slice(amount), ...items.slice(0, amount)];
}

function stringData(stringNumber) {
  const item = STANDARD_TUNING.find((string) => string.stringNumber === stringNumber);
  if (!item) throw new Error(`Unknown string number: ${stringNumber}`);
  return item;
}

function fretChoicesFor(tone, stringNumber, fretWindow, allowOpenStrings) {
  const string = stringData(stringNumber);
  const start = allowOpenStrings ? fretWindow.start : Math.max(1, fretWindow.start);
  const choices = [];

  for (let fret = start; fret <= fretWindow.end; fret += 1) {
    if (normalizePitchClass(string.pitchClass + fret) === tone.pitchClass) {
      choices.push({
        stringNumber,
        stringName: string.name,
        fret,
        pitchClass: tone.pitchClass,
        midi: string.midi + fret,
        tone
      });
    }
  }

  return choices;
}

function tonesForVoicing(chord, stringSet, inversion) {
  const labels = stringSet.toneOrders?.[inversion % stringSet.toneOrders.length];

  if (!labels) {
    return rotate(chord.tones, inversion % chord.tones.length);
  }

  return labels.map((label) => {
    const tone = chord.tones.find((item) => item.toneLabel === label);
    if (!tone) throw new Error(`Unknown tone label: ${label}`);
    return tone;
  });
}

function cartesian(groups) {
  return groups.reduce((acc, group) => acc.flatMap((prefix) => group.map((item) => [...prefix, item])), [[]]);
}

function scoreVoicing(positions, fretWindow) {
  const fretted = positions.filter((position) => position.fret > 0);
  const gripFrets = fretted.length ? fretted.map((position) => position.fret) : positions.map((position) => position.fret);
  const span = Math.max(...gripFrets) - Math.min(...gripFrets);
  const averageFret = positions.reduce((sum, position) => sum + position.fret, 0) / positions.length;
  const center = (fretWindow.start + fretWindow.end) / 2;
  const openPenalty = positions.filter((position) => position.fret === 0).length * 1.5;

  return span * 4 + Math.abs(averageFret - center) * 0.35 + openPenalty;
}

export function findVoicings({ chord, stringSet, inversion, fretWindow, maxSpan, allowOpenStrings }) {
  const stringsLowToHigh = [...stringSet.strings].sort((a, b) => b - a);
  const tonesLowToHigh = tonesForVoicing(chord, stringSet, inversion);
  const choicesByString = stringsLowToHigh.map((stringNumber, index) =>
    fretChoicesFor(tonesLowToHigh[index], stringNumber, fretWindow, allowOpenStrings)
  );

  if (choicesByString.some((choices) => choices.length === 0)) return [];

  return cartesian(choicesByString)
    .filter((positions) => {
      const frets = positions.map((position) => position.fret);
      const ascends = positions.every((position, index) => index === 0 || position.midi > positions[index - 1].midi);
      return ascends && Math.max(...frets) - Math.min(...frets) <= maxSpan;
    })
    .map((positions) => {
      const frets = positions.map((position) => position.fret);
      const id = positions.map((position) => `${position.stringNumber}:${position.fret}`).join("|");

      return {
        id,
        chord,
        stringSet,
        inversion,
        positions,
        fretSpan: Math.max(...frets) - Math.min(...frets),
        minFret: Math.min(...frets),
        maxFret: Math.max(...frets),
        score: scoreVoicing(positions, fretWindow)
      };
    })
    .sort((a, b) => a.score - b.score || a.minFret - b.minFret || a.id.localeCompare(b.id));
}

export function findVoiceLeadingVoicings({ chord, stringSet, fretWindow, maxSpan, allowOpenStrings }) {
  return chord.tones
    .flatMap((_, inversion) =>
      findVoicings({
        chord,
        stringSet,
        inversion,
        fretWindow,
        maxSpan,
        allowOpenStrings
      })
    )
    .sort((a, b) => a.score - b.score || a.minFret - b.minFret || a.id.localeCompare(b.id));
}

export function rootPositionForVoicing(voicing) {
  return voicing?.positions.find((position) => position.pitchClass === voicing.chord.root) ?? null;
}

export function buildMovements(fromVoicing, toVoicing) {
  if (!fromVoicing || !toVoicing) return [];

  return fromVoicing.positions.map((from, index) => {
    const to = toVoicing.positions[index];
    const semitones = to.midi - from.midi;

    return {
      voiceIndex: index,
      from,
      to,
      semitones,
      fretDelta: to.fret - from.fret,
      direction: semitones === 0 ? "static" : semitones > 0 ? "up" : "down",
      keepsPitchClass: from.pitchClass === to.pitchClass
    };
  });
}

export function summarizeMovements(movements) {
  const absolute = movements.map((movement) => Math.abs(movement.semitones));

  return {
    totalSemitones: absolute.reduce((sum, value) => sum + value, 0),
    maxSemitones: Math.max(0, ...absolute),
    staticVoices: movements.filter((movement) => movement.direction === "static").length,
    commonPitchClasses: new Set(
      movements.filter((movement) => movement.keepsPitchClass).map((movement) => movement.from.pitchClass)
    ).size,
    contour: movements.map((movement) => (movement.direction === "static" ? "0" : movement.direction === "up" ? "+" : "-")).join(" ")
  };
}

export function functionalCycleShift(toneCount, cycleId, cycleDirection = "descending") {
  if (toneCount === 3) {
    return cycleRotation(cycleId, cycleDirection);
  }

  const family = cycleFamily(cycleId);

  if (toneCount === 4 && family === "fourths-fifths") {
    return 2;
  }

  if (toneCount === 4) {
    return cycleRotation(cycleId, cycleDirection);
  }

  return 0;
}

export function expectedStaticVoiceCount(toneCount, cycleId) {
  const family = cycleFamily(cycleId);
  const counts = {
    3: {
      "seconds-sevenths": 0,
      "thirds-sixths": 2,
      "fourths-fifths": 1
    },
    4: {
      "seconds-sevenths": 1,
      "thirds-sixths": 3,
      "fourths-fifths": 2
    }
  };

  return counts[toneCount]?.[family] ?? 0;
}

export function expectedFunctionalToneLabels(fromVoicing, cycleId, cycleDirection = "descending") {
  if (!fromVoicing || !cycleId) return [];

  const toneLabels = fromVoicing.chord.tones.map((tone) => tone.toneLabel);
  const shift = functionalCycleShift(toneLabels.length, cycleId, cycleDirection);

  return fromVoicing.positions.map((position) => {
    const index = toneLabels.indexOf(position.tone.toneLabel);
    if (index === -1) return position.tone.toneLabel;
    return toneLabels[normalizePitchClass(index + shift) % toneLabels.length];
  });
}

export function functionalVoiceLeadingMismatch(fromVoicing, toVoicing, { cycleId, cycleDirection = "descending" } = {}) {
  if (!fromVoicing || !toVoicing || !cycleId) return 0;

  const expectedLabels = expectedFunctionalToneLabels(fromVoicing, cycleId, cycleDirection);

  return toVoicing.positions.filter((position, index) => position.tone.toneLabel !== expectedLabels[index]).length;
}

export function staticVoiceCountMismatch(fromVoicing, toVoicing, { cycleId } = {}) {
  if (!fromVoicing || !toVoicing || !cycleId) return 0;

  const expected = expectedStaticVoiceCount(fromVoicing.positions.length, cycleId);
  const actual = summarizeMovements(buildMovements(fromVoicing, toVoicing)).staticVoices;

  return Math.abs(actual - expected);
}

export function rankTargetVoicings(currentVoicing, targetVoicings, voiceLeading = {}) {
  if (!currentVoicing) return [...targetVoicings];

  return [...targetVoicings].sort((a, b) => {
    const movementsA = buildMovements(currentVoicing, a);
    const movementsB = buildMovements(currentVoicing, b);
    const summaryA = summarizeMovements(movementsA);
    const summaryB = summarizeMovements(movementsB);
    const movingVoicesA = movementsA.length - summaryA.staticVoices;
    const movingVoicesB = movementsB.length - summaryB.staticVoices;
    const functionalMismatchA = functionalVoiceLeadingMismatch(currentVoicing, a, voiceLeading);
    const functionalMismatchB = functionalVoiceLeadingMismatch(currentVoicing, b, voiceLeading);
    const staticVoiceMismatchA = staticVoiceCountMismatch(currentVoicing, a, voiceLeading);
    const staticVoiceMismatchB = staticVoiceCountMismatch(currentVoicing, b, voiceLeading);

    return (
      staticVoiceMismatchA - staticVoiceMismatchB ||
      functionalMismatchA - functionalMismatchB ||
      movingVoicesA - movingVoicesB ||
      summaryA.maxSemitones - summaryB.maxSemitones ||
      summaryB.staticVoices - summaryA.staticVoices ||
      summaryA.totalSemitones - summaryB.totalSemitones ||
      a.fretSpan - b.fretSpan ||
      a.score - b.score ||
      a.id.localeCompare(b.id)
    );
  });
}

function initialPathScore(voicing) {
  return {
    functionalMismatches: 0,
    staticVoiceMismatches: 0,
    totalSemitones: 0,
    maxSemitones: 0,
    movingVoices: 0,
    staticVoices: 0,
    fretSpan: voicing?.fretSpan ?? 0,
    score: voicing?.score ?? 0,
    id: voicing?.id ?? ""
  };
}

function appendPathScore(score, fromVoicing, toVoicing, voiceLeading) {
  const movements = buildMovements(fromVoicing, toVoicing);
  const summary = summarizeMovements(movements);

  return {
    functionalMismatches: score.functionalMismatches + functionalVoiceLeadingMismatch(fromVoicing, toVoicing, voiceLeading),
    staticVoiceMismatches: score.staticVoiceMismatches + staticVoiceCountMismatch(fromVoicing, toVoicing, voiceLeading),
    totalSemitones: score.totalSemitones + summary.totalSemitones,
    maxSemitones: Math.max(score.maxSemitones, summary.maxSemitones),
    movingVoices: score.movingVoices + movements.length - summary.staticVoices,
    staticVoices: score.staticVoices + summary.staticVoices,
    fretSpan: score.fretSpan + toVoicing.fretSpan,
    score: score.score + toVoicing.score,
    id: `${score.id}>${toVoicing.id}`
  };
}

function comparePathScores(a, b) {
  return (
    a.staticVoiceMismatches - b.staticVoiceMismatches ||
    a.functionalMismatches - b.functionalMismatches ||
    a.movingVoices - b.movingVoices ||
    a.maxSemitones - b.maxSemitones ||
    a.totalSemitones - b.totalSemitones ||
    b.staticVoices - a.staticVoices ||
    a.fretSpan - b.fretSpan ||
    a.score - b.score ||
    a.id.localeCompare(b.id)
  );
}

function buildGreedyCycleVoicingChain({
  degrees,
  chords,
  stringSet,
  fretWindow,
  maxSpan,
  allowOpenStrings,
  cycleId,
  cycleDirection = "descending",
  initialVoicing = null
}) {
  let previousVoicing = initialVoicing;
  const voiceLeading = { cycleId, cycleDirection };

  return degrees.map((degree, order) => {
    const chord = chords[degree];
    const candidates = order === 0 && initialVoicing ? [initialVoicing] : findVoiceLeadingVoicings({
      chord,
      stringSet,
      fretWindow,
      maxSpan,
      allowOpenStrings
    });
    const voicing =
      order === 0 && initialVoicing
        ? initialVoicing
        : rankTargetVoicings(previousVoicing, candidates, voiceLeading)[0] ?? candidates[0] ?? null;

    if (voicing) {
      previousVoicing = voicing;
    }

    return {
      degree,
      order,
      chord,
      voicing,
      candidateCount: candidates.length
    };
  });
}

export function buildCycleVoicingChain({
  degrees,
  chords,
  stringSet,
  inversion,
  fretWindow,
  maxSpan,
  allowOpenStrings,
  cycleId,
  cycleDirection = "descending",
  initialVoicing = null
}) {
  const voiceLeading = { cycleId, cycleDirection };
  const entries = degrees.map((degree, order) => {
    const chord = chords[degree];
    const candidates = order === 0 && initialVoicing ? [initialVoicing] : findVoiceLeadingVoicings({
      chord,
      stringSet,
      fretWindow,
      maxSpan,
      allowOpenStrings
    });

    return { degree, order, chord, candidates };
  });

  if (entries.some((entry) => entry.candidates.length === 0)) {
    return buildGreedyCycleVoicingChain({
      degrees,
      chords,
      stringSet,
      inversion,
      fretWindow,
      maxSpan,
      allowOpenStrings,
      cycleId,
      cycleDirection,
      initialVoicing
    });
  }

  let states = entries[0].candidates.map((voicing) => ({
    voicing,
    path: [voicing],
    score: initialPathScore(voicing)
  }));

  entries.slice(1).forEach((entry) => {
    states = entry.candidates.map((candidate) => {
      let bestState = null;

      states.forEach((state) => {
        const score = appendPathScore(state.score, state.voicing, candidate, voiceLeading);
        const nextState = {
          voicing: candidate,
          path: [...state.path, candidate],
          score
        };

        if (!bestState || comparePathScores(nextState.score, bestState.score) < 0) {
          bestState = nextState;
        }
      });

      return bestState;
    });
  });

  const best = states.sort((a, b) => comparePathScores(a.score, b.score))[0];

  return entries.map((entry, index) => ({
    degree: entry.degree,
    order: entry.order,
    chord: entry.chord,
    voicing: best?.path[index] ?? null,
    candidateCount: entry.candidates.length
  }));
}

export function buildFretboard(fretCount) {
  return STANDARD_TUNING.map((string) =>
    Array.from({ length: fretCount + 1 }, (_, fret) => ({
      stringNumber: string.stringNumber,
      stringName: string.name,
      fret,
      pitchClass: normalizePitchClass(string.pitchClass + fret)
    }))
  );
}
