export type SpellingPreference = "flats" | "sharps";

export const NOTE_NAMES: Record<SpellingPreference, string[]> = {
  flats: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
  sharps: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
};

export const NOTE_OPTIONS = NOTE_NAMES.flats.map((label, pitchClass) => ({
  label,
  pitchClass
}));
