import { expect, test } from '@playwright/test';

for (const width of [1440, 390, 320]) {
  test(`Goodrick layout and cycle controls at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/tools/goodrick-voice-leading-visualization');
    await expect(page.getByRole('heading', { name: 'Goodrick Voice Leading Visualization' })).toHaveCount(1);
    const assertFits = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await assertFits();
    await page.getByRole('combobox', { name: 'Mode', exact: true }).selectOption('dorian');
    await page.getByRole('combobox', { name: 'Start chord' }).selectOption('1');
    const cycle = page.getByRole('combobox', { name: 'Cycle', exact: true });
    const cycles = await cycle.locator('option').evaluateAll(options => options.map(option => option.value));
    for (const value of cycles) {
      await cycle.selectOption(value);
      await expect(page.locator('.cycle-strip button')).toHaveCount(7);
    }
    for (const type of ['Triads', 'Seventh chords']) {
      await page.getByRole('button', { name: type, exact: true }).click();
      for (const family of ['Close', 'Spread']) {
        await page.getByRole('button', { name: family, exact: true }).click();
        const drop = page.getByRole('combobox', { name: 'Drop type' });
        const drops = await drop.count() ? await drop.locator('option').evaluateAll(options => options.map(option => option.value)) : [null];
        for (const dropValue of drops) {
          if (dropValue) await drop.selectOption(dropValue);
          const strings = page.getByRole('combobox', { name: 'String set' });
          const sets = await strings.locator('option').evaluateAll(options => options.map(option => option.value));
          for (const set of sets) {
            await strings.selectOption(set);
            const inversion = page.getByRole('combobox', { name: 'Starting inversion' });
            if (await inversion.isEnabled()) {
              const values = await inversion.locator('option').evaluateAll(options => options.map(option => option.value));
              for (const value of values) {
                await inversion.selectOption(value);
                await expect(inversion).toHaveValue(value);
              }
            }
            await expect(strings).toHaveValue(set);
          }
        }
      }
    }
    await page.getByRole('checkbox', { name: 'Open strings' }).check();
    await page.getByRole('button', { name: 'Degrees', exact: true }).click();
    for (const mode of ['Overview', 'Chord', 'Transition', 'All']) {
      const button = page.getByRole('button', { name: mode, exact: true });
      await button.click();
      await expect(button).toHaveClass(/active/);
      await expect(page.locator('.cycle-dot').first()).toBeVisible();
      const scroll = page.locator('.fretboard-scroll');
      await scroll.scrollIntoViewIfNeeded();
      await expect(page.locator('.fretboard-surface')).toBeInViewport();
      await expect(page.locator('.string-row')).toHaveCount(6);
      await expect(page.locator('.fret-label').first()).toBeInViewport();
      await scroll.evaluate(el => { el.scrollLeft = 256; });
      expect(await scroll.evaluate(el => el.scrollLeft)).toBe(256);
      await expect(page.locator('.fretboard-surface')).toBeInViewport();
      await scroll.evaluate(el => { el.scrollLeft = 0; });
      await assertFits();
    }
    await page.getByRole('button', { name: 'Transition', exact: true }).click();
    await page.locator('.cycle-legend-item').nth(1).click();
    await expect(page.locator('.cycle-legend-item').nth(1)).toHaveClass(/--active/);
    await expect(page.locator('.cycle-status')).toContainText('->');
    await page.getByRole('button', { name: 'Note', exact: true }).click();
    await page.getByRole('checkbox', { name: 'Open strings' }).uncheck();
    expect(errors).toEqual([]);
  });
}
