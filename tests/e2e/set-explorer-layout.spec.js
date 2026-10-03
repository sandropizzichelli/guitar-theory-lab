import { expect, test } from "@playwright/test";

const cardinalities = [
  ["Trichords", "Forte trichord", "trichord"],
  ["Tetrachords", "Forte tetrachord", "tetrachord"],
  ["Pentachords", "Forte pentachord", "pentachord"],
  ["Hexachords", "Forte hexachord", "hexachord"]
];

async function expectNoPageOverflow(page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const width of [1440, 390, 320]) {
  test(`Set explorer preserves controls across cardinalities at ${width}px`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/tools/set-class-explorer");
    await expect(page.locator("h1")).toHaveText("Set-class Explorer");
    await expect(page.locator(".platform-tool-header .platform-tool-meta")).toHaveCount(0);

    for (const [tab, classLabel, singular] of cardinalities) {
      await page.getByRole("button", { name: tab, exact: true }).click();
      await expect(page.getByRole("button", { name: tab, exact: true })).toHaveAttribute("aria-pressed", "true");
      await page.getByRole("button", { name: "By set class", exact: true }).click();
      const classPicker = page.getByRole("combobox", { name: classLabel, exact: true });
      await expect(classPicker).toBeVisible();
      const option = await classPicker.locator("option").nth(1).getAttribute("value");
      await classPicker.selectOption(option);
      await expect(page.locator(".hero-summary-item").first()).toContainText(option);
      await page.getByRole("button", { name: "Note", exact: true }).click();
      await page.getByRole("button", { name: "Tn", exact: true }).click();
      await page.getByRole("button", { name: "2", exact: true }).click();
      await expect(page.getByRole("button", { name: "2", exact: true })).toHaveAttribute("aria-pressed", "true");
      await expectNoPageOverflow(page);
      await page.getByRole("button", { name: "Original", exact: true }).click();
      await page.getByRole("button", { name: "Voicing", exact: true }).click();
      await page.getByRole("button", { name: "Close voicing", exact: true }).first().click();
      await page.getByRole("checkbox", { name: "Exclude open strings", exact: true }).check();
      await expectNoPageOverflow(page);
      await page.reload();
      await expect(page.getByRole("button", { name: "Voicing", exact: true })).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("button", { name: "Close voicing", exact: true }).first()).toHaveAttribute("aria-pressed", "true");
      await expect(page.getByRole("checkbox", { name: "Exclude open strings", exact: true })).toBeChecked();
      await page.getByRole("button", { name: "Show complement", exact: true }).click();
      await expect(page.locator(".hero-summary-item").first()).toContainText("Class");
      await expectNoPageOverflow(page);
      await page.getByRole("button", { name: `Show ${singular}`, exact: true }).click();
      await page.getByRole("button", { name: "By interval vector", exact: true }).click();
      await expect(page.getByRole("combobox", { name: "Interval vector", exact: true })).toBeVisible();
      await expect(page.getByRole("combobox", { name: "Matching class", exact: true })).toBeVisible();
      await page.getByRole("button", { name: "Subset-class", exact: true }).click();
      await expect(page.getByRole("button", { name: "Subset-class", exact: true })).toHaveAttribute("aria-pressed", "true");
      if (tab !== "Trichords") {
        await expect(page.getByRole("combobox", { name: "Subset type", exact: true })).toBeVisible();
      }
      await expectNoPageOverflow(page);
      await page.getByRole("button", { name: "Superset-class", exact: true }).click();
      await expect(page.getByRole("combobox", { name: "Superset type", exact: true })).toBeVisible();
      await expectNoPageOverflow(page);
      await page.getByRole("button", { name: "Superset-class", exact: true }).click();
      if (tab !== "Trichords") {
        await page.getByRole("button", { name: "By genera", exact: true }).click();
        await expect(page.getByRole("combobox", { name: "Genus", exact: true })).toBeVisible();
      }
    }
    expect(errors).toEqual([]);
  });
}
