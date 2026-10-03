import { expect, test } from "@playwright/test";

for (const width of [1440, 390, 320]) {
  test(`Harmonic comparison controls and layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/tools/harmonic-intersections");
    await expect(page.locator("h1")).toHaveText("Harmonic Intersections");
    await expect(page.locator(".platform-tool-meta")).toHaveCount(0);
    const systemB = page.locator(".system-selector").nth(1);
    await expect(page.locator(".overlap-summary strong")).toHaveText("100%");
    await systemB.getByRole("combobox", { name: "Mode", exact: true }).selectOption("dorian");
    await expect(page.locator(".overlap-summary strong")).toHaveText("71%");
    await systemB.getByRole("combobox", { name: "Tonic", exact: true }).selectOption("2");
    await expect(page.locator(".interval-data-value")).toContainText("+2 semitones");
    await systemB.getByRole("button", { name: "Arpeggio", exact: true }).click();
    await systemB.getByRole("combobox", { name: "Arpeggio type", exact: true }).selectOption("triad");
    await systemB.getByRole("combobox", { name: "Degree", exact: true }).selectOption("2");
    await expect(systemB.locator(".note-chip")).toHaveCount(3);
    await systemB.getByRole("button", { name: "Pentatonic", exact: true }).click();
    await expect(systemB.getByRole("combobox", { name: "Pentatonic type", exact: true })).toBeVisible();
    await systemB.getByRole("combobox", { name: "Root degree", exact: true }).selectOption("1");
    await expect(systemB.locator(".note-chip")).toHaveCount(5);
    await page.getByRole("button", { name: "Degrees", exact: true }).click();
    await expect(page.getByRole("button", { name: "Degrees", exact: true })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "System A notes", exact: true }).click();
    await expect(page.getByRole("button", { name: "System A notes", exact: true })).toHaveAttribute("aria-pressed", "false");
    await page.getByRole("button", { name: "5-8", exact: true }).click();
    await expect(page.getByRole("combobox", { name: "From fret", exact: true })).toHaveValue("5");
    await expect(page.getByRole("combobox", { name: "To fret", exact: true })).toHaveValue("8");
    await page.getByRole("button", { name: "1 · E", exact: true }).click();
    await expect(page.locator(".string-disabled")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Reset C Ionian / C Ionian", exact: true }).click();
    await expect(page.locator(".overlap-summary strong")).toHaveText("100%");
    await expect(page.locator(".string-disabled")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Notes", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(systemB.getByRole("button", { name: "Full scale", exact: true })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByRole("combobox", { name: "From fret", exact: true })).toHaveValue("0");
    await expect(page.getByRole("combobox", { name: "To fret", exact: true })).toHaveValue("12");
    expect(errors).toEqual([]);
  });
}
