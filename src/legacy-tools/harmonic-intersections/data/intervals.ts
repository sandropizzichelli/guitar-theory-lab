export const INTERVAL_LABELS = [
  "unison",
  "minor second",
  "major second",
  "minor third",
  "major third",
  "perfect fourth",
  "tritone",
  "perfect fifth",
  "minor sixth",
  "major sixth",
  "minor seventh",
  "major seventh"
];

export const INTERVAL_OPTIONS = INTERVAL_LABELS.map((label, semitones) => ({
  semitones,
  label
}));
