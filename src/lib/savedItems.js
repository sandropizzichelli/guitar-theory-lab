export const SAVED_ITEM_SCHEMA_VERSION = 1;

export function createSavedItemDraft({ toolId, title, data = {}, notes = "" }) {
  return {
    schemaVersion: SAVED_ITEM_SCHEMA_VERSION,
    toolId,
    title: title?.trim() || "Untitled study",
    data,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export function validateSavedItemDraft(item) {
  const errors = [];

  if (!item || typeof item !== "object") {
    return { valid: false, errors: ["Saved item must be an object."] };
  }

  if (!item.toolId) errors.push("Missing toolId.");
  if (!item.title) errors.push("Missing title.");
  if (!item.data || typeof item.data !== "object") errors.push("Missing data object.");

  return {
    valid: errors.length === 0,
    errors
  };
}

export const savedItemsProvider = {
  name: "supabase",
  table: "saved_items",
  status: "placeholder"
};
