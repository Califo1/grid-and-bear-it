# Start here

Three separate things. Do them in this order.

---

## Goal 0 — Test it (15 minutes, do this first)

Nothing below matters until you have looked at a real book. Open
`Grid and Bear It Studio (offline app).html` — double-click it, any browser.

Work through this and note anything that looks wrong:

**1. Guided setup.** Sidebar → Help → Walkthrough → **Start guided setup**.
Twelve steps. The panel you need to answer gets a violet ring and an "answer
this" badge; everything else dims. Confirm: **Next** stays greyed until you
actually choose, and pressing **Choose for me** answers the current step.

**2. A whole book without deciding anything.** Start a new book, open the
Assistant, type into the brief — vibe, occasion, who it is for — then press
**Fill the whole book**. Check it read you correctly: "my mother in assisted
living" should give memory care in large print, not a gift book.

**3. Build and look at pages.** Press **Build**, wait for the bar, then
**Preview**. Page through. Look specifically at:
- a section divider (the picture-frame placeholder and the coloured shape)
- a puzzle page (grid size, does it sit inside the margins)
- an answer-key page (do the numbers match the puzzles)

**4. Interior looks.** Step 4 → Interior look. Click each of the six families
and page through Preview after each. Playhouse and Funfair are the most
decorated — if any of them look wrong or plain, that is the thing to tell me.
Try **Print in colour** and watch the royalty panel go negative.

**5. Workbench.** Produce → Workbench → **Logic grid**, then **Expert**. You
should get a four-category staircase grid: categories banded across the top,
extra categories stacked below-left. Click squares to cycle blank → ✓ → ✗.
Press **Check**, then **Reveal**. Then **Print this puzzle**.

**6. Export one interior.** KDP wizard → Interior PDF. In the print dialogue
choose **Save as PDF**, margins **None**, scale **100%**. Open the PDF and
confirm the page size is your trim size and nothing is cut off.

> I was unable to see any of this rendered — the preview tool I use was down when
> I built it. The logic was verified without a browser, which proves nothing
> crashes but cannot prove nothing looks ugly. Steps 3, 4 and 5 are where to look
> hardest, and telling me "this page looks wrong" is the most useful thing you
> can do next.

---

## Goal 1 — Get it on GitHub (30 minutes, no coding)

You do not need Claude Code for this. The app already works.

### 1. Make a GitHub account
Go to **github.com** → Sign up. Free.

### 2. Create the repository
Click **+** (top right) → **New repository**.

- Repository name: `grid-and-bear-it`
- Description: `Puzzle and activity book generator with print-ready KDP export`
- **Public**
- Do **not** check "Add a README" (you already have one)
- **Create repository**

### 3. Upload the files
On the empty repo page, click **uploading an existing file**.

Drag in everything from the download:

```
Grid & Bear It Studio.dc.html
Grid and Bear It Studio (offline app).html
puzzle-engine.js
puzzle-engine-extra.js
kdp-guru.js
engines.bundle.js
support.js
README.md
HANDOFF.md
START-HERE.md
LICENSE
.gitignore
docs/          (the whole folder — index.html + screenshot-studio.png)
```

Commit message: `Initial commit`. Click **Commit changes**.

> If drag-and-drop misses the `docs` folder, upload the two files inside it
> separately: click **Add file → Upload files**, and type `docs/` at the start of
> the filename field to create the folder.

### 4. Turn on the live demo
**Settings** → **Pages** (left sidebar).

- Source: **Deploy from a branch**
- Branch: `main`, folder: **/docs**
- **Save**

Wait about two minutes. Your app is now live at:

```
https://YOUR-USERNAME.github.io/grid-and-bear-it/
```

Anyone can click that and use it. Test it yourself.

### 5. Fix the demo link in the README
Click `README.md` → pencil icon → replace `YOUR-USERNAME` with your actual
username in the live-demo line → **Commit changes**.

**You are done.** That URL is your portfolio piece. Put it on your résumé and
LinkedIn.

---

## Goal 2 — Hand it to Claude Code for the remaining engineering

Only needed when you want the four gaps closed. **Publishing books does not
depend on any of this.**

`HANDOFF.md` is current — nothing in it needs updating before you hand it over.
It already carries the file map, the architecture decisions and why they were
made, the bugs that have bitten twice and how to avoid them, a prioritised
backlog where every item has an acceptance criterion, and the desktop-wrapper
recipe. Claude Code should read it first, not be told about it.

One thing worth saying out loud: **the preview harness I use was down**, so ask
Claude Code to run the app and look at it before changing anything. HANDOFF §3
describes the headless verification technique, which is a supplement to looking,
not a replacement.

### What to do

1. Open Claude Code in the folder containing these files.
2. Paste the prompt below.
3. Work **one numbered item at a time**. Do not ask for all four at once —
   each one is a real change and you want to test between them.

### The prompt to paste

```
Read HANDOFF.md and README.md first, then confirm you understand the
architecture before changing anything.

This is a working puzzle-book generator that exports print-ready KDP files.
It is one self-contained HTML file with three dependency-free ES modules.
It must keep opening by double-clicking a single file — do not add a build
step, a framework, or an npm dependency to the app itself.

Two rules that have caused real bugs before, both explained in HANDOFF.md §3:
- Selection state must be read from raw(), never cfg()
- After editing any engine module, regenerate engines.bundle.js and re-inline
  the single-file build, or changes appear to do nothing

Start with backlog item 1 (Web Worker generation). Its acceptance criterion
is in HANDOFF.md §4. Show me your plan before you write code.
```

### The four items, in order

| # | What | Why it matters to you |
| --- | --- | --- |
| 1 | Generation in a Web Worker | The window stops freezing during big builds |
| 2 | Real PDF export | One click instead of the print dialogue — and no chance of a wrong page box getting rejected by KDP |
| 3 | Drag-and-drop image slots | Place your cover and divider art in the app instead of an image editor |
| 4 | Tauri desktop wrapper | A real `.exe` with an icon and a Start-menu entry |

Item 4 is the only one that adds npm dependencies, and they live in a separate
wrapper folder — the app itself stays a single file.

### After each item

Ask Claude Code to:

1. Regenerate `engines.bundle.js` and the single-file build
2. Copy the rebuilt single file to `docs/index.html`
3. Commit and push

Then reload your GitHub Pages URL and confirm it still works.

---

## Which order should you actually work in?

Publish books first. The app is ready and the market does not care about your
Web Worker. Do Goal 1 this week, start making books, and treat Goal 2 as
background work when something annoys you enough.
