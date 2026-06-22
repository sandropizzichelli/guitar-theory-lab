export const FEATURE_IDS = {
  SAVE_ITEMS: "save-items",
  EXPORT_IMAGES: "export-images",
  EXPORT_PDF: "export-pdf",
  PERSONAL_LIBRARY: "personal-library",
  ADVANCED_PRESETS: "advanced-presets",
  MULTI_COMPARE: "multi-compare",
  HISTORY: "history",
  TEACHING_MATERIALS: "teaching-materials",
  INSTITUTION_LICENSE: "institution-license"
};

export const features = [
  {
    id: FEATURE_IDS.SAVE_ITEMS,
    label: "Salvataggi",
    tier: "pro",
    description: "Save tool states, notes and personal study materials."
  },
  {
    id: FEATURE_IDS.EXPORT_IMAGES,
    label: "Export immagini",
    tier: "pro",
    description: "Export visualizations as images."
  },
  {
    id: FEATURE_IDS.EXPORT_PDF,
    label: "Export PDF",
    tier: "pro",
    description: "Export study sheets and analysis snapshots as PDF."
  },
  {
    id: FEATURE_IDS.PERSONAL_LIBRARY,
    label: "Libreria personale",
    tier: "pro",
    description: "Organize saved materials across tools."
  },
  {
    id: FEATURE_IDS.ADVANCED_PRESETS,
    label: "Preset avanzati",
    tier: "pro",
    description: "Use deeper presets and tool-specific workflows."
  },
  {
    id: FEATURE_IDS.MULTI_COMPARE,
    label: "Confronto multiplo",
    tier: "pro",
    description: "Compare multiple harmonic materials or paths."
  },
  {
    id: FEATURE_IDS.HISTORY,
    label: "Storico",
    tier: "pro",
    description: "Review recent explorations and previous sessions."
  },
  {
    id: FEATURE_IDS.TEACHING_MATERIALS,
    label: "Materiali didattici",
    tier: "teacher",
    description: "Prepare teaching exports and lesson packs."
  },
  {
    id: FEATURE_IDS.INSTITUTION_LICENSE,
    label: "Licenza istituzionale",
    tier: "institution",
    description: "Future licensing model for schools and conservatories."
  }
];

export function getFeatureById(featureId) {
  return features.find((feature) => feature.id === featureId) ?? null;
}
