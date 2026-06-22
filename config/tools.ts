export const TOOL_STATUSES = ["experimental", "alpha", "beta", "stable", "deprecated"];

export const TOOL_CATEGORIES = [
  "Set Theory",
  "Harmony",
  "Voice Leading",
  "Fretboard",
  "Improvisation",
  "Analysis",
  "Experimental"
];

export const tools = [
  {
    id: "set-class-explorer",
    slug: "set-class-explorer",
    title: "Set-class Explorer",
    shortTitle: "Set-class",
    description:
      "Explore pitch-class set classes, prime forms, interval vectors, transformations, subsets and supersets on the guitar fretboard.",
    longDescription:
      "A modular set-theory workbench for guitar: tricords, tetrachords, pentachords, hexachords, Forte names, complements and playable fretboard realizations.",
    category: "Set Theory",
    status: "beta",
    version: "0.1.0",
    route: "/tools/set-class-explorer",
    icon: "sets",
    isPublic: true,
    isPro: false,
    tags: ["set theory", "set class", "pitch-class sets", "prime form", "interval vector", "fretboard"],
    component: () => import("../src/tools/set-class-explorer"),
    createdAt: "2026-04-16",
    updatedAt: "2026-06-22"
  },
  {
    id: "harmonic-intersections",
    slug: "harmonic-intersections",
    title: "Harmonic Intersections",
    shortTitle: "Intersections",
    description:
      "Explore intersections between harmonic materials, common tones, scales, chords, modes and intervallic structures.",
    longDescription:
      "Compare two harmonic materials and inspect common tones, roots, degrees and fretboard visibility across scales, arpeggios and pentatonic structures.",
    category: "Harmony",
    status: "beta",
    version: "0.1.0",
    route: "/tools/harmonic-intersections",
    icon: "intersections",
    isPublic: true,
    isPro: false,
    tags: ["harmony", "intersections", "common tones", "scales", "chords", "modes", "improvisation"],
    component: () => import("../src/tools/harmonic-intersections"),
    createdAt: "2026-06-02",
    updatedAt: "2026-06-22"
  },
  {
    id: "goodrick-voice-leading-visualization",
    slug: "goodrick-voice-leading-visualization",
    title: "Goodrick Voice Leading Visualization",
    shortTitle: "Goodrick Voice Leading",
    description:
      "Visualize voice-leading paths, string-set movements and harmonic connections on the guitar fretboard.",
    longDescription:
      "A Goodrick-inspired laboratory for diatonic triads and seventh chords, cycles, rotations, string sets, close voicings and practical spread/drop voicings.",
    category: "Voice Leading",
    status: "beta",
    version: "0.1.0",
    route: "/tools/goodrick-voice-leading-visualization",
    icon: "voice-leading",
    isPublic: true,
    isPro: false,
    tags: ["voice leading", "Goodrick", "guitar", "harmony", "fretboard", "string sets"],
    component: () => import("../src/tools/goodrick-voice-leading-visualization"),
    createdAt: "2026-06-21",
    updatedAt: "2026-06-22"
  }
];

export function getToolBySlug(slug) {
  return tools.find((tool) => tool.slug === slug) ?? null;
}

export function getPublicTools() {
  return tools.filter((tool) => tool.isPublic);
}
