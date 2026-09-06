// KDP domain knowledge: geometry, costs, metadata strategy, cover families,
// audience styling, launch checklist. Grounded in 2026 category research.

export const TRIMS = [
  { id: "5.5x8.5", w: 5.5, h: 8.5, label: '5.5 × 8.5"', note: "travel / stocking stuffer" },
  { id: "6x9", w: 6, h: 9, label: '6 × 9"', note: "portable, $7.99–8.99" },
  { id: "7x10", w: 7, h: 10, label: '7 × 10"', note: "roomy grids" },
  { id: "8x10", w: 8, h: 10, label: '8 × 10"', note: "large print sweet spot" },
  { id: "8.5x11", w: 8.5, h: 11, label: '8.5 × 11"', note: "biggest grids, best $/puzzle" },
  { id: "a4", w: 8.27, h: 11.69, label: "A4", note: "metric markets" },
];

export const PAPER_THICKNESS = { white: 0.002252, cream: 0.0025, color: 0.002347 };

export function gutterFor(pages) {
  if (pages <= 150) return 0.375;
  if (pages <= 300) return 0.5;
  if (pages <= 500) return 0.625;
  if (pages <= 700) return 0.75;
  return 0.875;
}

export function kdpSpec({ trim, pages, paper = "white", bleed = false }) {
  const t = TRIMS.find((x) => x.id === trim) || TRIMS[4];
  const spine = +(pages * PAPER_THICKNESS[paper]).toFixed(4);
  const outside = bleed ? 0.5 : 0.375;
  const gutter = gutterFor(pages);
  return {
    trim: t, pages, paper, bleed, spine, gutter, outside, top: bleed ? 0.5 : 0.375,
    live: { w: +(t.w - outside - gutter).toFixed(3), h: +(t.h - 2 * (bleed ? 0.5 : 0.375)).toFixed(3) },
    cover: {
      w: +(t.w * 2 + spine + 0.25).toFixed(3),
      h: +(t.h + 0.25).toFixed(3),
      spineTextOk: pages >= 79,
      barcode: { w: 2, h: 1.2 },
    },
  };
}

// US paperback. KDP publishes these as fixed + per-page bands. Standard colour
// costs roughly three times black ink per page, which is why colour interiors
// are only worth it for children's books.
export function printCost({ trim, pages, paper, color }) {
  const t = TRIMS.find((x) => x.id === trim) || TRIMS[4];
  const large = t.w > 6.12 || t.h > 9;
  if (color) return +(1.0 + pages * (large ? 0.0525 : 0.0405)).toFixed(2);
  if (pages <= 108) return large ? 2.84 : 2.30;
  return +(0.85 + pages * (large ? 0.017 : 0.012)).toFixed(2);
}

export function royalty({ price, trim, pages, paper, color }) {
  const rate = price >= 2.99 && price <= 9.99 ? 0.6 : 0.35;
  const cost = printCost({ trim, pages, paper, color });
  return { rate, cost, net: +(price * rate - cost).toFixed(2) };
}

// Price ladder: what each list price actually earns.
export function priceLadder({ trim, pages, paper }) {
  return [5.99, 6.99, 7.99, 8.99, 9.99, 10.99, 12.99].map((price) => {
    const r = royalty({ price, trim, pages, paper });
    return { price, ...r, warn: price > 9.99 ? "drops to 35%" : r.net < 1.5 ? "thin margin" : null };
  });
}

/* -------------------------------------------------- audience style profiles */

export const AUDIENCES = {
  senior: {
    label: "Seniors", note: "large print",
    minGridPt: 20, minBodyPt: 14, perPage: 1, largePrint: true,
    palette: ["#1d4e6e", "#f4c145", "#fdfbf6"], cover: "senior",
    voice: "calm, dignified, never patronising",
    keywords: ["large print", "for seniors", "easy on the eyes", "big font"],
    titleBenefit: "Extra-Large Print, Easy on the Eyes",
  },
  adult: {
    label: "Adults", note: "general",
    minGridPt: 12, minBodyPt: 10, perPage: 2, largePrint: false,
    palette: ["#14312e", "#d8622f", "#f6f1e6"], cover: "newsstand",
    voice: "brisk, confident, a little wry",
    keywords: ["for adults", "brain games", "puzzle book"],
    titleBenefit: "Sharpen Your Focus",
  },
  kids: {
    label: "Kids 6–12", note: "playful",
    minGridPt: 16, minBodyPt: 13, perPage: 1, largePrint: false,
    palette: ["#2f6fd0", "#ffc93c", "#fff8ec"], cover: "kid",
    voice: "warm, fun, direct — short sentences",
    keywords: ["for kids", "ages 8-12", "activity book", "fun"],
    titleBenefit: "Hours of Screen-Free Fun",
  },
  gift: {
    label: "Gift / seasonal", note: "occasion",
    minGridPt: 14, minBodyPt: 11, perPage: 1, largePrint: false,
    palette: ["#7a2230", "#e8b64c", "#fbf4ea"], cover: "seasonal",
    voice: "charming, giftable, occasion-forward",
    keywords: ["gift", "stocking stuffer", "gifts for"],
    titleBenefit: "The Perfect Gift",
  },
  memory: {
    label: "Memory care", note: "gentle",
    minGridPt: 22, minBodyPt: 15, perPage: 1, largePrint: true,
    palette: ["#3c6e57", "#f2d3a0", "#fdfaf4"], cover: "senior",
    voice: "gentle, encouraging, zero pressure",
    keywords: ["memory care", "dementia", "large print easy", "calming"],
    titleBenefit: "Gentle, Calming, Never Frustrating",
  },
};

/* ------------------------------------------------------- cover families */

export const COVER_FAMILIES = {
  newsstand: {
    label: "Classic newsstand", note: "bold banner, big number",
    fonts: { display: "'Bodoni Moda', serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#0f2b45", panel: "#f7f1e4", ink: "#0f2b45", accent: "#d33a2c", counter: "#f4c145" },
    describe: "A banner across the top, the puzzle count set enormous, high contrast. Reads at thumbnail size like a magazine on a rack.",
  },
  grid: {
    label: "Modern grid", note: "flat blocks, geometric",
    fonts: { display: "'Archivo', sans-serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#f2ede2", panel: "#14312e", ink: "#14312e", accent: "#d8622f", counter: "#14312e" },
    describe: "Flat colour blocks in a strict grid, confident type, no ornament. Feels designed rather than assembled.",
  },
  cozy: {
    label: "Cozy illustrated", note: "warm scene",
    fonts: { display: "'Bodoni Moda', serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#f6e7d0", panel: "#7a4a2b", ink: "#43301f", accent: "#b6552f", counter: "#7a4a2b" },
    describe: "Warm ground, hand-lettered feel, room for a seasonal scene. Sells on comfort.",
  },
  minimal: {
    label: "Minimal type", note: "typography only",
    fonts: { display: "'Bodoni Moda', serif", ui: "'IBM Plex Mono', monospace" },
    palette: { bg: "#f7f4ec", panel: "#1a1a18", ink: "#1a1a18", accent: "#b3402f", counter: "#1a1a18" },
    describe: "All typography, no art needed. The cheapest to produce and the hardest to get wrong.",
  },
  kid: {
    label: "Kid playful", note: "bright, rounded",
    fonts: { display: "'Archivo', sans-serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#2f6fd0", panel: "#ffc93c", ink: "#123a6d", accent: "#ff5c5c", counter: "#fff8ec" },
    describe: "Bright primaries, rounded shapes, energy. Parents scan for age range — it goes on the cover.",
  },
  seasonal: {
    label: "Seasonal / gift", note: "occasion framing",
    fonts: { display: "'Bodoni Moda', serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#7a2230", panel: "#f6ead2", ink: "#4a151f", accent: "#2f6b4f", counter: "#e8b64c" },
    describe: "Occasion first: the holiday or event is the headline, the puzzle type is the subhead.",
  },
  senior: {
    label: "Large-print senior", note: "calm, uncluttered",
    fonts: { display: "'Archivo', sans-serif", ui: "'Archivo', sans-serif" },
    palette: { bg: "#1d4e6e", panel: "#fdfbf6", ink: "#12354d", accent: "#f4c145", counter: "#fdfbf6" },
    describe: "Enormous title, calm ground, LARGE PRINT set as a badge. Nothing competes with the words.",
  },
};

/* --------------------------------------------------------- metadata guru */

export const CATEGORY_TREE = {
  wordsearch: [
    "Books > Humor & Entertainment > Puzzles & Games > Word Search",
    "Books > Humor & Entertainment > Puzzles & Games > Logic & Brain Teasers",
    "Books > Health, Fitness & Dieting > Aging > Medical Conditions & Diseases",
  ],
  sudoku: [
    "Books > Humor & Entertainment > Puzzles & Games > Sudoku",
    "Books > Humor & Entertainment > Puzzles & Games > Logic & Brain Teasers",
    "Books > Science & Math > Mathematics > Recreation & Games",
  ],
  crossword: [
    "Books > Humor & Entertainment > Puzzles & Games > Crosswords",
    "Books > Humor & Entertainment > Puzzles & Games > Logic & Brain Teasers",
    "Books > Reference > Words, Language & Grammar > Vocabulary",
  ],
  mixed: [
    "Books > Humor & Entertainment > Puzzles & Games > Logic & Brain Teasers",
    "Books > Humor & Entertainment > Puzzles & Games > Word Search",
    "Books > Self-Help > Memory Improvement",
  ],
  kids: [
    "Books > Children's Books > Activities, Crafts & Games > Puzzle Books",
    "Books > Children's Books > Activities, Crafts & Games > Activity Books",
    "Books > Children's Books > Education & Reference > Vocabulary & Spelling",
  ],
};

// Puzzle-count expectations by type. Undershooting reads as thin; overshooting
// costs pages with no extra royalty.
export const EXPECTED_COUNT = {
  wordsearch: [50, 100], sudoku: [200, 400], crossword: [50, 100],
  cryptogram: [80, 150], maze: [60, 120], math: [80, 200],
  mixed: [100, 250], kids: [60, 100],
};

const STOP = new Set(["the", "a", "an", "of", "for", "and", "with", "in", "to"]);

// What buyers actually type. Internal type ids must never reach listing copy.
export const TYPE_PHRASE = {
  wordsearch: "word search", sudoku: "sudoku", sudoku6: "easy sudoku", sudoku12: "large grid sudoku",
  xsudoku: "sudoku x", irregular: "jigsaw sudoku", crossword: "crossword", fillin: "fill in crossword",
  cryptogram: "cryptogram", scramble: "word scramble", anagram: "anagram", wordladder: "word ladder",
  kenken: "kenken", kakuro: "kakuro", math: "math", nonogram: "nonogram picross", logicgrid: "logic",
  maze: "maze", trivia: "trivia", dottodot: "dot to dot", coloring: "coloring", mixed: "puzzle",
};
export const typePhrase = (id) => TYPE_PHRASE[id] || "puzzle";

const TYPE_TITLE = {
  wordsearch: "Word Search", sudoku: "Sudoku", sudoku6: "Easy Sudoku", sudoku12: "Large Grid Sudoku",
  xsudoku: "Sudoku X", irregular: "Jigsaw Sudoku", crossword: "Crossword", fillin: "Fill-In Crossword",
  cryptogram: "Cryptogram", scramble: "Word Scramble", anagram: "Anagram", wordladder: "Word Ladder",
  kenken: "KenKen", kakuro: "Kakuro", math: "Math", nonogram: "Nonogram", logicgrid: "Logic",
  maze: "Maze", trivia: "Trivia", dottodot: "Dot-to-Dot", coloring: "Coloring", mixed: "Puzzle",
};

export function keywordSet({ types, audience, themes, count, largePrint, trim, difficulties }) {
  const aud = AUDIENCES[audience] || AUDIENCES.adult;
  const primary = typePhrase(types[0]);
  const lp = largePrint ? "large print " : "";
  const theme = String((themes || [])[0] || "").toLowerCase().trim();
  const audWord = audience === "senior" ? "seniors" : audience === "kids" ? "kids ages 8-12" : audience === "memory" ? "memory care" : audience === "gift" ? "gifts" : "adults";
  const raw = [
    `${lp}${primary} puzzle book for ${audWord}`,
    theme ? `${theme} ${primary} puzzles ${largePrint ? "large print" : "book"}` : `themed ${primary} puzzle book`,
    `${count} ${primary} puzzles with answers`,
    `${lp}activity book for ${audWord}`,
    audience === "kids" ? "screen free activity book for kids" : "brain games to keep the mind sharp",
    `${primary} book ${(difficulties || ["easy"]).join(" to ")} difficulty`,
    audience === "gift" ? "puzzle book gift for puzzle lovers" : `${lp}puzzle book gift`,
  ];
  return raw.map((s) => s.replace(/\s+/g, " ").trim()).slice(0, 7);
}

export function categoriesFor({ types, audience }) {
  if (audience === "kids") return CATEGORY_TREE.kids;
  if (types.length > 2) return CATEGORY_TREE.mixed;
  return CATEGORY_TREE[types[0]] || CATEGORY_TREE.mixed;
}

// Broad category + specific audience + clear benefit.
export function titleFormula({ type, audience, themeLabel, count, largePrint, volume }) {
  const aud = AUDIENCES[audience] || AUDIENCES.adult;
  const lp = largePrint ? "Large Print " : "";
  const typeName = TYPE_TITLE[type] || "Puzzle";
  const audTag = { senior: "for Seniors", kids: "for Kids Ages 8–12", memory: "for Memory Care", gift: "", adult: "for Adults" }[audience] || "";
  const theme = String(themeLabel || "").trim();
  const title = theme
    ? `${lp}${theme} ${typeName} Puzzles ${audTag}`.replace(/\s+/g, " ").trim()
    : `${lp}${typeName} Puzzles ${audTag}`.replace(/\s+/g, " ").trim();
  const sub = `${count} ${audience === "kids" ? "Fun" : ""} Puzzles with Complete Solutions — ${aud.titleBenefit}`.replace(/\s+/g, " ");
  return { title: volume ? `${title} — Volume ${volume}` : title, sub };
}

export function seriesPlan({ baseType, audience, themeLabels, volumes = 5 }) {
  const rotate = ["Word Search", "Sudoku", "Crosswords", "Mixed Puzzles", "Holiday Special"];
  return Array.from({ length: volumes }, (_, i) => ({
    volume: i + 1,
    focus: i === 0 ? baseType : rotate[i % rotate.length],
    theme: themeLabels[i % Math.max(1, themeLabels.length)] || "Mixed",
    note: i === 0 ? "Anchor title — carries the series keywords" : i === volumes - 1 ? "Seasonal hook for Q4 traffic" : "Read-through volume",
  }));
}

export const LAUNCH_CHECKLIST = [
  { phase: "Before upload", items: [
    "Interior PDF exported at trim size with no bleed unless art runs to the edge",
    "Answer key checked against the printed puzzle numbers — wrong answers are the #1 review killer",
    "Cover PDF matches the spine width for the FINAL page count",
    "Title and subtitle carry the audience and the benefit, not just the puzzle type",
    "Cover legible at 200 px wide — check it as a thumbnail before you commit",
  ] },
  { phase: "In KDP", items: [
    "Paperback, black & white interior, white or cream paper",
    "Categories: pick from Puzzles & Games — a solutions section makes this an activity book, not low content",
    "All 7 keyword slots filled with phrases, not single words",
    "Large print flagged in title AND description if the interior is large print",
    "Price inside $2.99–$9.99 to keep the 60% royalty rate",
  ] },
  { phase: "First 90 days", items: [
    "Publish 3 volumes close together so the series looks established",
    "Order a proof copy and check the gutter — the inside margin is where books fail",
    "Amazon Ads on 10–15 high-intent keywords at low CPC",
    "Gift copies to activity directors or teachers if it is a senior or kids title",
    "Add 1–2 volumes a month for six months; steady state usually lands around month 4–5",
  ] },
];

export const REVIEW_KILLERS = [
  "Missing or misnumbered solutions",
  "Puzzles with more than one answer",
  "Text lost in the gutter",
  "Grids too small for the stated audience",
  "Generic cover that looks like fifty others",
];

/* ------------------------------------------------------- accessibility check */

export function accessibilityReport({ audience, gridPt, bodPt, largePrint, contrast }) {
  const a = AUDIENCES[audience] || AUDIENCES.adult;
  const out = [];
  out.push({ ok: gridPt >= a.minGridPt, label: `Grid type ${gridPt.toFixed(1)}pt`, want: `≥ ${a.minGridPt}pt for ${a.label.toLowerCase()}` });
  out.push({ ok: bodPt >= a.minBodyPt, label: `Body type ${bodPt.toFixed(1)}pt`, want: `≥ ${a.minBodyPt}pt` });
  out.push({ ok: !a.largePrint || largePrint, label: largePrint ? "Large print on" : "Large print off", want: a.largePrint ? "required for this audience" : "optional" });
  out.push({ ok: contrast >= 7, label: `Grid contrast ${contrast.toFixed(1)}:1`, want: "≥ 7:1 for print legibility" });
  return out;
}

/* ------------------------------------------------- difficulty calibration */
// Deterministic scores so "hard" can be checked rather than asserted.

export function calibrate(puzzle) {
  const k = puzzle.kind;
  if (k === "sudoku" || k === "sudokuN" || k === "xsudoku" || k === "irregular") {
    const n = puzzle.n || 9;
    const cells = n * n;
    const givens = puzzle.grid.filter(Boolean).length;
    return { score: +(((cells - givens) / cells) * 100).toFixed(1), unit: "% empty", basis: `${givens}/${cells} givens` };
  }
  if (k === "wordsearch") {
    const diag = puzzle.placements.some((p) => p.dr && p.dc);
    const back = puzzle.placements.some((p) => p.dr < 0 || p.dc < 0);
    return { score: +(puzzle.words.length * (diag ? 1.4 : 1) * (back ? 1.3 : 1)).toFixed(1), unit: "load", basis: `${puzzle.words.length} words${diag ? ", diagonals" : ""}${back ? ", reversed" : ""}` };
  }
  if (k === "crossword" || k === "fillin") return { score: puzzle.entries.length, unit: "entries", basis: `${puzzle.size}×${puzzle.size} grid` };
  if (k === "kenken") return { score: puzzle.cages.length, unit: "cages", basis: `${puzzle.n}×${puzzle.n}` };
  if (k === "kakuro") return { score: puzzle.runs.length, unit: "runs", basis: `${puzzle.n}×${puzzle.n}` };
  if (k === "nonogram") return { score: puzzle.n, unit: "grid", basis: `${puzzle.n}×${puzzle.n}` };
  if (k === "maze") return { score: puzzle.path.length, unit: "path cells", basis: `${puzzle.n}×${puzzle.n}` };
  if (k === "wordladder") return { score: puzzle.rungs, unit: "rungs", basis: `${puzzle.start}→${puzzle.end}` };
  if (k === "logicgrid") return { score: puzzle.clues.length, unit: "clues", basis: `${puzzle.subjects.length} subjects` };
  if (k === "math") return { score: puzzle.items.length, unit: "problems", basis: puzzle.difficulty };
  if (k === "cryptogram") return { score: puzzle.plain.replace(/[^A-Za-z]/g, "").length, unit: "letters", basis: "1 letter given" };
  return { score: 0, unit: "", basis: "" };
}
