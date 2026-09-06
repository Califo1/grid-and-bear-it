# Developer handoff — Grid &amp; Bear It Studio

For a developer (human or Claude Code) picking this up. Read this before editing.

---

## 1. Current state

**Working and in production use.** Books can be generated, previewed and exported
today. The app is feature-complete for its purpose; what remains is engineering
polish, not missing capability.

- 21 puzzle generators, all with known solutions; 8 of them solver-verified unique
- Full KDP paperback geometry, preflight, 6 export paths
- 6 interior design families, 7 cover families, 5 audience profiles
- Guided setup, shelf with autosave, project save/load, batch build
- Metadata generation, portfolio balance, account auditor
- Optional AI layer that degrades cleanly to offline

**Not present:** automated tests, a build step, any dependency, any server.

## 2. File map

| File | Role | Edit with care |
| --- | --- | --- |
| `Grid & Bear It Studio.dc.html` | All UI, page-layout engine, exports | Large but flat; sections are commented |
| `puzzle-engine.js` | 8 generators + 30 topic libraries | Pure, no DOM |
| `puzzle-engine-extra.js` | 13 generators incl. all verifiers | Pure, no DOM |
| `kdp-guru.js` | All KDP domain knowledge | Single source of truth — do not inline these values elsewhere |
| `engines.bundle.js` | **Generated.** Never hand-edit | Regenerate after any engine change |
| `docs/index.html` | GitHub Pages demo copy | Regenerate from the bundle |

### Regenerating after an engine change

`engines.bundle.js` exists because the single-file bundler cannot follow dynamic
`import()`. It is produced by, for each of the three modules: stripping `export`
keywords, wrapping the file in an IIFE (they share helper names like `shuffle`),
and assigning `globalThis.PZ_ENGINE` / `PZ_EXTRA` / `PZ_GURU` with the collected
export names — `globalThis` rather than `window` because the generation Worker
(see §4 item 1) runs this same bundle in a scope with no `window`. A fourth
section then embeds those three sections' own text as a string in
`globalThis.PZ_BUNDLE_SRC`, so the main thread can build the Worker from a
`Blob` URL without fetching a sibling file (`file://` blocks `fetch`/`import()`/
`new Worker(url)` for local files; a `Blob` URL minted from in-memory text is
unaffected). Then re-inline the app to a single file and copy it to
`docs/index.html`.

Any change to an engine module that is not followed by regenerating the bundle
will appear to do nothing in the offline build. This is the most likely source of
confusion for a new contributor.

## 3. Architecture notes and the reasoning behind them

**`cfg()` returns effective values; `raw()` returns stored state.** A book starts
genuinely empty — `audience: null`, `types: []`, `trim: null`. `cfg()` substitutes
sensible values so the preview can render; `raw()` is what drives selection
highlighting and the preflight "not chosen yet" list. **Any new UI that shows
whether something is selected must read `raw()`, not `cfg()`.** Getting this wrong
reintroduces phantom preselection, which was a real bug twice.

**All layout is inline styles computed in inches.** Page geometry is expressed in
real print units (`in`, `pt`) and scaled for screen with `zoom`, not `transform`,
so the layout box shrinks with the visual and flex wrapping stays correct.
`transform: scale()` was tried first and left dead space.

**One generalised sudoku solver.** `makeSolver(n, regions, diagonals)` in
`puzzle-engine-extra.js` builds a peer map from a region assignment, so 9×9, 6×6,
12×12, X-sudoku and jigsaw all share one constraint engine and one uniqueness
counter. Add a variant by supplying a region map, not a new solver.

**Never leak internal identifiers into customer-facing copy.** Type ids like
`wordsearch` and `logicgrid` are not English. `kdp-guru.js` holds `TYPE_PHRASE`
(search language) and `TYPE_TITLE` (title case); listing copy must go through
those. Likewise `themeLabels()` in the DC deliberately excludes the `none` theme
placeholder. Both of these leaked into generated Amazon copy at one point.

**Generated prose is assembled from clause lists, not one big template.** An
empty interpolated variable before punctuation produces `"kinds , climbing"`.
Build arrays, `filter(Boolean)`, then join.

## 4. Backlog, in priority order

Each item has an acceptance criterion so it can be verified rather than eyeballed.

### 1. Move generation into a Web Worker
*Why:* sudoku/kakuro/nonogram verification blocks the main thread; a 300-puzzle
build freezes the UI and the progress bar lies.
*Acceptance:* the progress bar animates smoothly during a 300-puzzle sudoku build;
the UI stays responsive; batch build runs 2+ books concurrently.
*Notes:* the engine modules are already DOM-free and dependency-free, so they can
be imported into a worker unchanged. Only `build()` needs restructuring.

### 2. Real PDF generation
*Why:* export currently opens the browser print dialogue and asks the user to
choose "Save as PDF", margins none, scale 100%. Every one of those is a chance to
get it wrong, and KDP rejects wrong page boxes.
*Acceptance:* one click produces a PDF whose page box is exactly the trim size (or
cover wrap), with no scaling, verified with a PDF inspector.
*Notes:* pdf-lib for vector text, or Playwright's `page.pdf()` if a Node side is
introduced by the desktop wrapper. Keep the print path as a fallback.

### 3. Drag-and-drop image slots
*Why:* interior divider frames and all cover art are placeholders; the user
supplies 300 dpi grayscale art and currently cannot place it in the app.
*Acceptance:* dropping an image onto a frame stores it, persists across reload,
warns below 300 dpi for the frame's printed size, and appears in exports.

### 4. Puzzle-level dedupe across a series
*Why:* `Reports → Duplicate risk` compares book configurations, not puzzles. Two
volumes could contain the same generated grid.
*Acceptance:* a hash per generated puzzle, stored per book; building a new book
rejects and regenerates any grid already present in the series.

### 5. Expand the crossword clue dictionary
*Why:* `CLUES` in `puzzle-engine.js` covers a few hundred words; anything outside
it falls back to a length clue.
*Acceptance:* every word in every built-in topic library has a clue.

### 6. Desktop wrapper
See §5.

## 5. Wrapping as a desktop app

The offline HTML is already a complete application: local storage, file
save/open, canvas export, print. Wrapping adds an icon, a Start-menu entry and a
native window — no functional change.

### Tauri (recommended — ~5 MB output, uses the OS webview)

```bash
npm create tauri-app@latest gridandbearit   # vanilla, no TypeScript
```

Copy the offline HTML to `src/index.html`, then in `src-tauri/tauri.conf.json`:

```jsonc
{
  "productName": "Grid & Bear It Studio",
  "identifier": "com.califopublishing.gridandbearit",
  "build": { "frontendDist": "../src" },
  "app": {
    "windows": [{
      "title": "Grid & Bear It Studio",
      "width": 1600, "height": 1000,
      "minWidth": 1180, "minHeight": 700
    }]
  },
  "bundle": {
    "active": true,
    "targets": ["msi", "nsis"],
    "icon": ["icons/icon.ico", "icons/icon.png"]
  }
}
```

`npm run tauri build` → installer in `src-tauri/target/release/bundle/`.

### Electron (only if Node APIs are wanted)

Worth it for real filesystem access, batch export to a folder, and PDF generation
without a dialogue. Costs ~120 MB of bundle.

```js
const { app, BrowserWindow } = require("electron");
app.whenReady().then(() => {
  const win = new BrowserWindow({ width: 1600, height: 1000 });
  win.loadFile("Grid and Bear It Studio (offline app).html");
});
```

### Signing

Unsigned Windows installers trigger SmartScreen. An OV code-signing certificate
(~$200–400/yr) removes it. macOS notarisation needs an Apple Developer account
($99/yr). Neither is required for personal use.

## 6. Wiring the AI in a wrapper

The app calls `window.claude.complete(prompt)` and expects raw JSON back. Provide:

```js
window.claude = { complete: async (prompt) => "...model response..." };
```

Call your API from the wrapper's **main process** and pass the result through IPC.
**Never embed an API key in the HTML** — the file is distributable.

The assistant must never be given puzzle generation. That boundary is the app's
core correctness guarantee: puzzles are produced and verified locally, so nothing
ambiguous or unsolvable can reach a printed page.

## 7. Things not to do

- Do not hand-edit `engines.bundle.js` or `docs/index.html`.
- Do not read selection state from `cfg()` — see §3.
- Do not put KDP constants (margins, paper thickness, royalty rates) anywhere
  except `kdp-guru.js`.
- Do not interpolate type ids or theme keys into anything a customer reads.
- Do not add a build step or a dependency without a reason that survives the
  question "does this still open by double-clicking one file?"
