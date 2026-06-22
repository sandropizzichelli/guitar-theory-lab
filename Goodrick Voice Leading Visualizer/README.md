# Goodrick Voice Leading Visualizer

Standalone React/Vite app for studying Goodrick-style diatonic voice leading on guitar.

The app generates triads and seventh chords from a selected modal system, places them on real guitar string sets, and ranks the target voicings by smallest voice movement.

The start position can be chosen by tonic placement: for example, on strings 1-2-3 a C triad can start with C on string 3, string 2, or string 1, and each choice generates its own seven-position cycle.

Cycles are grouped as complementary Goodrick motions:

- `Seconde / Settime`
- `Terze / Seste`
- `Quarte / Quinte`

The direction selector chooses which side of the pair is active: descending gives seconds, thirds, fourths; ascending gives sevenths, sixths, fifths.

Voice-leading follows the functional rotations shown in Goodrick's almanac:

- Triads, descending cycles 2/3/4: `R -> 5`, `3 -> R`, `5 -> 3`.
- Triads, ascending cycles 7/6/5: `R -> 3`, `3 -> 5`, `5 -> R`.
- Seventh chords, cycles 2/3: `R -> 7`, `3 -> R`, `5 -> 3`, `7 -> 5`.
- Seventh chords, cycles 7/6: `R -> 3`, `3 -> 5`, `5 -> 7`, `7 -> R`.
- Seventh chords, cycles 4/5: `R -> 5`, `3 -> 7`, `5 -> R`, `7 -> 3`.

The main fretboard view is a Cycle Map:

- **Glifi** mode shows one colored shape per chord in the selected cycle, reducing dot clutter.
- **Token** mode shows every occupied fret/string cell, aggregating overlaps into stacked tokens.
- Clicking a degree in the Cycle Map focuses that chord while keeping the rest of the cycle visible.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run build
```
