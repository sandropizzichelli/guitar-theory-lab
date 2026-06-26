import { expect, test } from "@playwright/test";

function monitorConsole(page) {
  const errors = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return {
    expectClean() {
      expect(errors, `Console/page errors:\n${errors.join("\n")}`).toEqual([]);
    }
  };
}

async function expectSelectsToHaveAccessibleNames(page) {
  const unnamedSelects = await page.locator("select").evaluateAll((selects) =>
    selects
      .map((select, index) => {
        const id = select.getAttribute("id");
        const hasLabel =
          select.closest("label") ||
          (id && document.querySelector(`label[for="${CSS.escape(id)}"]`));
        const hasName =
          select.getAttribute("aria-label") ||
          select.getAttribute("aria-labelledby") ||
          select.getAttribute("title") ||
          hasLabel;

        return hasName ? null : index;
      })
      .filter((index) => index !== null)
  );

  expect(unnamedSelects, `Unnamed select indexes: ${unnamedSelects.join(", ")}`).toEqual([]);
}

test("Set-class Explorer opens, changes access mode, and stays error-free", async ({ page }) => {
  const consoleMonitor = monitorConsole(page);

  await page.goto("/tools/set-class-explorer");
  await expectSelectsToHaveAccessibleNames(page);
  await expect(page.getByRole("heading", { name: "Set-class Explorer" })).toBeVisible();
  await page.getByRole("button", { name: "Tetrachords" }).click();
  await page.getByRole("button", { name: "By interval vector" }).click();
  await expect(page.getByRole("combobox", { name: "Interval vector" })).toBeVisible();
  await expectSelectsToHaveAccessibleNames(page);
  await expect(page.getByText("Fretboard controls")).toBeVisible();

  consoleMonitor.expectClean();
});

test("Harmonic Intersections opens, changes a select, and stays error-free", async ({ page }) => {
  const consoleMonitor = monitorConsole(page);

  await page.goto("/tools/harmonic-intersections");
  await expect(page.getByRole("heading", { name: "Harmonic Intersections" })).toBeVisible();
  await page.getByRole("combobox", { name: "Mode" }).nth(1).selectOption("dorian");
  await page.getByRole("button", { name: "Arpeggio" }).nth(1).click();
  await page.getByRole("button", { name: "5-8" }).click();
  await expect(page.getByRole("button", { name: "5-8" })).toHaveClass(/active/);
  await expect(page.getByRole("button", { name: "Common notes" })).toBeVisible();

  consoleMonitor.expectClean();
});

test("Goodrick Voice Leading opens, changes voicing controls, and stays error-free", async ({ page }) => {
  const consoleMonitor = monitorConsole(page);

  await page.goto("/tools/goodrick-voice-leading-visualization");
  await expect(page.getByRole("heading", { name: "Goodrick Voice Leading Visualization" })).toBeVisible();
  await page.getByRole("button", { name: "Seventh chords" }).click();
  await page.getByRole("button", { name: "Spread" }).click();
  await page.getByRole("combobox", { name: "Drop type" }).selectOption("drop2");
  await page.getByRole("combobox", { name: "String set" }).selectOption("seventh-drop2-mid");
  await page.getByRole("combobox", { name: "Starting inversion" }).selectOption("3");
  await expect(page.getByRole("combobox", { name: "Starting inversion" })).toHaveValue("3");
  await expect(page.locator(".cycle-map-board")).toBeVisible();

  consoleMonitor.expectClean();
});
