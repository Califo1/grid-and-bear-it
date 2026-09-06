// Additional puzzle generators. Every generator returns a puzzle with a known,
// verified solution. Pure logic, no DOM.

const rnd = (n) => Math.floor(Math.random() * n);
const shuffle = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const range = (n) => [...Array(n).keys()];

/* ============================================================ sudoku variants
   One generalised engine: any size, any region map, optional diagonal rule. */

function regionsBox(n, bh, bw) {
  const map = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) map[r * n + c] = Math.floor(r / bh) * (n / bw) + Math.floor(c / bw);
  return map;
}

function regionsJigsaw(n) {
  // grow n contiguous regions of n cells each
  for (let attempt = 0; attempt < 60; attempt++) {
    const map = new Array(n * n).fill(-1);
    const seeds = shuffle(range(n * n)).slice(0, n);
    const frontier = seeds.map((s, i) => { map[s] = i; return [s]; });
    const sizes = new Array(n).fill(1);
    let placed = n, ok = true;
    while (placed < n * n) {
      let moved = false;
      for (let i = 0; i < n; i++) {
        if (sizes[i] >= n) continue;
        const cands = [];
        for (const cell of frontier[i]) {
          const r = (cell / n) | 0, c = cell % n;
          for (const [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) {
            const nr = r + dr, nc = c + dc;
            if (nr < 0 || nc < 0 || nr >= n || nc >= n) continue;
            if (map[nr * n + nc] === -1) cands.push(nr * n + nc);
          }
        }
        if (!cands.length) continue;
        const pick = cands[rnd(cands.length)];
        map[pick] = i; frontier[i].push(pick); sizes[i]++; placed++; moved = true;
      }
      if (!moved) { ok = false; break; }
    }
    if (ok && sizes.every((s) => s === n)) return map;
  }
  return regionsBox(9, 3, 3);
}

function makeSolver(n, regions, diagonals) {
  const peers = [];
  for (let i = 0; i < n * n; i++) {
    const r = (i / n) | 0, c = i % n, set = new Set();
    for (let k = 0; k < n; k++) { set.add(r * n + k); set.add(k * n + c); }
    for (let j = 0; j < n * n; j++) if (regions[j] === regions[i]) set.add(j);
    if (diagonals) {
      if (r === c) for (let k = 0; k < n; k++) set.add(k * n + k);
      if (r + c === n - 1) for (let k = 0; k < n; k++) set.add(k * n + (n - 1 - k));
    }
    set.delete(i);
    peers.push([...set]);
  }
  const ok = (g, i, v) => !peers[i].some((p) => g[p] === v);
  const count = (g, limit) => {
    let best = -1, bestOpts = null;
    for (let i = 0; i < g.length; i++) {
      if (g[i]) continue;
      const opts = [];
      for (let v = 1; v <= n; v++) if (ok(g, i, v)) opts.push(v);
      if (!opts.length) return 0;
      if (!bestOpts || opts.length < bestOpts.length) { best = i; bestOpts = opts; if (opts.length === 1) break; }
    }
    if (best === -1) return 1;
    let found = 0;
    for (const v of bestOpts) {
      g[best] = v;
      found += count(g, limit - found);
      g[best] = 0;
      if (found >= limit) break;
    }
    return found;
  };
  const fill = (g, pos = 0) => {
    if (pos === g.length) return true;
    if (g[pos]) return fill(g, pos + 1);
    for (const v of shuffle(range(n).map((x) => x + 1))) {
      if (ok(g, pos, v)) { g[pos] = v; if (fill(g, pos + 1)) return true; g[pos] = 0; }
    }
    return false;
  };
  return { ok, count, fill, peers };
}

const GIVEN_RATIO = { beginner: 0.58, easy: 0.5, medium: 0.42, hard: 0.34, expert: 0.28 };

export function sudokuVariant(opts = {}) {
  const { size = 9, variant = "classic", difficulty = "medium" } = opts;
  const n = size;
  const regions = variant === "irregular" ? regionsJigsaw(n)
    : n === 6 ? regionsBox(6, 2, 3)
    : n === 12 ? regionsBox(12, 3, 4)
    : n === 4 ? regionsBox(4, 2, 2)
    : regionsBox(9, 3, 3);
  const diagonals = variant === "x";
  const S = makeSolver(n, regions, diagonals);
  const sol = new Array(n * n).fill(0);
  S.fill(sol);
  const target = Math.round(n * n * (GIVEN_RATIO[difficulty] || 0.42));
  const puz = sol.slice();
  let given = n * n;
  for (const i of shuffle(range(n * n))) {
    if (given <= target) break;
    const keep = puz[i];
    puz[i] = 0;
    if (S.count(puz.slice(), 2) !== 1) puz[i] = keep; else given--;
  }
  return {
    kind: variant === "classic" ? (n === 9 ? "sudoku" : "sudokuN") : variant === "x" ? "xsudoku" : "irregular",
    n, regions, diagonals, grid: puz, solution: sol, difficulty, givens: given,
    title: variant === "x" ? "X-Sudoku" : variant === "irregular" ? "Jigsaw Sudoku" : `Sudoku ${n}×${n}`,
  };
}

/* ==================================================================== kakuro */

function runSums(len, target, maxDigit = 9) {
  // all sets of `len` distinct digits 1..maxDigit summing to target
  const out = [];
  const rec = (start, left, sum, acc) => {
    if (!left) { if (sum === 0) out.push(acc.slice()); return; }
    for (let d = start; d <= maxDigit; d++) {
      if (d > sum) break;
      acc.push(d); rec(d + 1, left - 1, sum - d, acc); acc.pop();
    }
  };
  rec(1, len, target, []);
  return out;
}

// Digits that can legally appear anywhere in a run of `len` distinct digits
// summing to `target`. Used to prune the uniqueness search hard.
const RUN_DIGIT_CACHE = new Map();
function runDigits(len, target) {
  const k = len * 100 + target;
  const hit = RUN_DIGIT_CACHE.get(k);
  if (hit !== undefined) return hit;
  let mask = 0;
  for (const combo of runSums(len, target)) for (const d of combo) mask |= 1 << d;
  RUN_DIGIT_CACHE.set(k, mask);
  return mask;
}

// Denser block patterns mean shorter runs, which is what makes a kakuro
// uniquely solvable at all — sparse grids with long runs admit many solutions
// and the uniqueness search then costs seconds for nothing.
const KAKURO_SHAPE = {
  beginner: { n: 6, density: 0.42 },
  easy: { n: 7, density: 0.44 },
  medium: { n: 8, density: 0.46 },
  hard: { n: 9, density: 0.48 },
  expert: { n: 10, density: 0.5 },
};

export function kakuro(difficulty = "medium") {
  const order = ["expert", "hard", "medium", "easy", "beginner"];
  const want = KAKURO_SHAPE[difficulty] ? difficulty : "medium";
  // Try the requested shape, then progressively smaller ones, each with a time
  // budget. Never recurses, so a pathological search can not spin forever.
  for (let s = Math.max(0, order.indexOf(want)); s < order.length; s++) {
    const got = kakuroAttempt(KAKURO_SHAPE[order[s]], difficulty, 400);
    if (got) return got;
  }
  // Last resort: smallest grid, longest budget. Bounded, and in practice never
  // reached — beginner succeeds in tens of milliseconds.
  return kakuroAttempt(KAKURO_SHAPE.beginner, difficulty, 3000) || kakuroAttempt({ n: 5, density: 0.45 }, difficulty, 3000);
}

function kakuroAttempt(shape, difficulty, budgetMs) {
  const n = shape.n;
  const deadline = Date.now() + budgetMs;
  for (let attempt = 0; attempt < 4000; attempt++) {
    if (Date.now() > deadline) return null;
    // block pattern: first row/col are clue cells, plus scattered blocks
    const block = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => r === 0 || c === 0));
    for (let r = 1; r < n; r++) for (let c = 1; c < n; c++) if (Math.random() < shape.density) block[r][c] = true;
    // reject runs of length 1 or > 9
    const runsOf = (horiz) => {
      const runs = [];
      for (let a = 1; a < n; a++) {
        let cur = [];
        for (let b = 1; b < n; b++) {
          const r = horiz ? a : b, c = horiz ? b : a;
          if (block[r][c]) { if (cur.length) runs.push(cur); cur = []; }
          else cur.push([r, c]);
        }
        if (cur.length) runs.push(cur);
      }
      return runs;
    };
    const across = runsOf(true), down = runsOf(false);
    // Repair rather than reject: a length-1 run has no sum puzzle in it, so turn
    // that cell into a block and re-derive. Cells only ever become blocks, so
    // this converges. Rejecting instead made almost every pattern unusable.
    let repaired = true, guard = 0;
    while (repaired && guard++ < n * n) {
      repaired = false;
      for (const run of runsOf(true).concat(runsOf(false))) {
        if (run.length === 1) { block[run[0][0]][run[0][1]] = true; repaired = true; }
      }
    }
    const all = runsOf(true).concat(runsOf(false));
    const openCount = all.reduce((a, r) => a + r.length, 0);
    if (!all.length || all.some((r) => r.length < 2 || r.length > 9)) continue;
    // too sparse and the grid is mostly blocks rather than a puzzle
    if (openCount < (n - 1) * (n - 1) * 0.3) continue;
    // fill values: distinct within each run
    const val = Array.from({ length: n }, () => new Array(n).fill(0));
    const fits = (r, c, v) => {
      for (const run of all) if (run.some(([rr, cc]) => rr === r && cc === c) && run.some(([rr, cc]) => val[rr][cc] === v)) return false;
      return true;
    };
    const cells = [];
    for (let r = 1; r < n; r++) for (let c = 1; c < n; c++) if (!block[r][c]) cells.push([r, c]);
    const fill = (i) => {
      if (i === cells.length) return true;
      const [r, c] = cells[i];
      for (const v of shuffle(range(9).map((x) => x + 1))) {
        if (fits(r, c, v)) { val[r][c] = v; if (fill(i + 1)) return true; val[r][c] = 0; }
      }
      return false;
    };
    if (!fill(0)) continue;
    const clueList = all.map((run) => ({
      cells: run,
      horiz: run.length > 1 && run[0][0] === run[1][0],
      sum: run.reduce((s, [r, c]) => s + val[r][c], 0),
    }));
    // uniqueness: solve by run-combination search. -1 means the search blew its
    // node budget, which is treated exactly like "not unique" — discard and retry.
    const solutions = kakuroSolutions(n, block, clueList, 2, 40000);
    if (solutions !== 1) continue;
    const clues = Array.from({ length: n }, () => new Array(n).fill(null));
    for (const cl of clueList) {
      const [r0, c0] = cl.cells[0];
      const r = cl.horiz ? r0 : r0 - 1, c = cl.horiz ? c0 - 1 : c0;
      clues[r][c] = clues[r][c] || { across: null, down: null };
      if (cl.horiz) clues[r][c].across = cl.sum; else clues[r][c].down = cl.sum;
    }
    return { kind: "kakuro", n, block, clues, solution: val, runs: clueList, difficulty };
  }
  return null;
}

// Returns the number of solutions found (capped at `limit`), or -1 if the node
// budget was exhausted before the search completed.
function kakuroSolutions(n, block, runs, limit, budget = 120000) {
  const grid = Array.from({ length: n }, () => new Array(n).fill(0));
  const open = [];
  for (let r = 1; r < n; r++) for (let c = 1; c < n; c++) if (!block[r][c]) open.push([r, c]);

  const key = (r, c) => r * n + c;
  const runsFor = new Map();
  open.forEach(([r, c]) => runsFor.set(key(r, c), runs.filter((run) => run.cells.some(([rr, cc]) => rr === r && cc === c))));
  // Precomputed legal-digit mask per run — the strongest available pruning.
  const maskOf = new Map();
  for (const run of runs) maskOf.set(run, runDigits(run.cells.length, run.sum));

  // Order cells so each one shares a run with cells already placed; this makes
  // both across and down constraints bite immediately instead of at the leaves.
  const cells = [];
  const placed = new Set();
  const touch = new Map(open.map(([r, c]) => [key(r, c), 0]));
  while (cells.length < open.length) {
    let best = null, bestScore = -Infinity;
    for (const [r, c] of open) {
      const k = key(r, c);
      if (placed.has(k)) continue;
      const score = touch.get(k) * 100 - runsFor.get(k).reduce((a, run) => a + run.cells.length, 0);
      if (score > bestScore) { bestScore = score; best = [r, c]; }
    }
    const k = key(best[0], best[1]);
    placed.add(k);
    cells.push(best);
    for (const run of runsFor.get(k)) {
      for (const [rr, cc] of run.cells) {
        const kk = key(rr, cc);
        if (!placed.has(kk)) touch.set(kk, (touch.get(kk) || 0) + 1);
      }
    }
  }

  let found = 0, nodes = 0, blown = false;
  const rec = (i) => {
    if (blown || found >= limit) return;
    if (++nodes > budget) { blown = true; return; }
    if (i === cells.length) { found++; return; }
    const [r, c] = cells[i];
    const mine = runsFor.get(key(r, c));
    let allowed = 0x3fe; // digits 1..9
    for (const run of mine) allowed &= maskOf.get(run);
    for (let v = 1; v <= 9; v++) {
      if (!(allowed & (1 << v))) continue;
      let ok = true;
      for (const run of mine) {
        let sum = v, empty = 0, dup = false;
        for (const [rr, cc] of run.cells) {
          if (rr === r && cc === c) continue;
          const g = grid[rr][cc];
          if (g === v) { dup = true; break; }
          if (g) sum += g; else empty++;
        }
        // remaining cells need distinct unused digits, so bound the tail sum
        if (dup || sum + empty > run.sum || (empty === 0 && sum !== run.sum)) { ok = false; break; }
      }
      if (!ok) continue;
      grid[r][c] = v; rec(i + 1); grid[r][c] = 0;
      if (blown || found >= limit) return;
    }
  };
  rec(0);
  return blown ? -1 : found;
}

/* ================================================================= nonogram */

export function nonogram(difficulty = "medium") {
  const n = { beginner: 5, easy: 8, medium: 10, hard: 12, expert: 15 }[difficulty] || 10;
  const density = 0.55;
  for (let attempt = 0; attempt < 30; attempt++) {
    const g = Array.from({ length: n }, () => Array.from({ length: n }, () => (Math.random() < density ? 1 : 0)));
    const clues = (line) => {
      const out = [];
      let run = 0;
      line.forEach((v) => { if (v) run++; else if (run) { out.push(run); run = 0; } });
      if (run) out.push(run);
      return out.length ? out : [0];
    };
    const rows = g.map(clues);
    const cols = range(n).map((c) => clues(g.map((row) => row[c])));
    if (rows.some((r) => r[0] === 0) || cols.some((c) => c[0] === 0)) continue;
    if (nonogramSolutions(rows, cols, n, 2) !== 1) continue;
    return { kind: "nonogram", n, rows, cols, solution: g, difficulty };
  }
  return nonogram("beginner");
}

function linePatterns(clue, len) {
  const out = [];
  const rec = (i, pos, acc) => {
    if (i === clue.length) { out.push(acc.concat(new Array(len - acc.length).fill(0))); return; }
    const remaining = clue.slice(i).reduce((a, b) => a + b, 0) + (clue.length - i - 1);
    for (let s = pos; s <= len - remaining; s++) {
      const next = acc.concat(new Array(s - acc.length).fill(0), new Array(clue[i]).fill(1));
      if (i < clue.length - 1) next.push(0);
      rec(i + 1, next.length, next);
    }
  };
  rec(0, 0, []);
  return out;
}

function nonogramSolutions(rows, cols, n, limit) {
  const rowOpts = rows.map((c) => linePatterns(c, n));
  if (rowOpts.some((o) => !o.length) || rowOpts.reduce((a, o) => a * Math.min(o.length, 50), 1) > 4e6) return 1;
  let found = 0;
  const grid = [];
  const colOk = (depth) => {
    for (let c = 0; c < n; c++) {
      const partial = [];
      for (let r = 0; r < depth; r++) partial.push(grid[r][c]);
      // prefix feasibility against col clue
      const need = cols[c];
      const runs = [];
      let run = 0;
      partial.forEach((v) => { if (v) run++; else if (run) { runs.push(run); run = 0; } });
      const closed = runs.length;
      if (closed > need.length) return false;
      for (let i = 0; i < closed; i++) if (runs[i] !== need[i]) return false;
      if (run && (closed >= need.length || run > need[closed])) return false;
      const placed = runs.reduce((a, b) => a + b, 0) + run;
      const total = need.reduce((a, b) => a + b, 0);
      if (placed > total) return false;
      if (depth === n && (placed !== total || (run ? closed + 1 : closed) !== need.length)) return false;
    }
    return true;
  };
  const rec = (r) => {
    if (found >= limit) return;
    if (r === n) { if (colOk(n)) found++; return; }
    for (const opt of rowOpts[r]) {
      grid[r] = opt;
      if (colOk(r + 1)) rec(r + 1);
      if (found >= limit) return;
    }
    grid.length = r;
  };
  rec(0);
  return found;
}

/* ============================================================== logic grids */

const LOGIC_SETS = [
  { subject: "Neighbour", items: ["Alice", "Bram", "Cleo", "Dov", "Esme"], cats: [
    { name: "House colour", items: ["blue", "green", "grey", "yellow", "red"] },
    { name: "Pet", items: ["cat", "dog", "parrot", "turtle", "rabbit"] },
    { name: "Car", items: ["estate", "hatchback", "pickup", "saloon", "van"] },
    { name: "Street", items: ["Ash Lane", "Birch Row", "Cedar Way", "Dell Road", "Elm Rise"] }] },
  { subject: "Friend", items: ["Nadia", "Otto", "Pia", "Quinn", "Rex"], cats: [
    { name: "Drink", items: ["coffee", "cocoa", "tea", "cider", "lemonade"] },
    { name: "Day off", items: ["Monday", "Tuesday", "Friday", "Sunday", "Thursday"] },
    { name: "Hobby", items: ["birding", "knitting", "pottery", "running", "sketching"] },
    { name: "Hometown", items: ["Bangor", "Denver", "Mobile", "Salem", "Tucson"] }] },
  { subject: "Baker", items: ["Ruth", "Sam", "Tess", "Uma", "Vince"], cats: [
    { name: "Bake", items: ["brioche", "scones", "tart", "rye loaf", "babka"] },
    { name: "Ribbon", items: ["first", "second", "third", "fourth", "fifth"] },
    { name: "Filling", items: ["apple", "cherry", "custard", "pecan", "plum"] },
    { name: "Oven", items: ["back left", "back right", "centre", "front left", "front right"] }] },
  { subject: "Gardener", items: ["Vic", "Wren", "Xan", "Yuri", "Zola"], cats: [
    { name: "Plant", items: ["basil", "dahlia", "fern", "tomato", "lupin"] },
    { name: "Plot", items: ["north", "south", "east", "west", "centre"] },
    { name: "Tool", items: ["dibber", "hoe", "rake", "trowel", "shears"] },
    { name: "Watering day", items: ["Monday", "Wednesday", "Friday", "Saturday", "Sunday"] }] },
  { subject: "Sailor", items: ["Bo", "Cass", "Dee", "Finn", "Gale"], cats: [
    { name: "Boat", items: ["Kestrel", "Mariner", "Petrel", "Sandpiper", "Tern"] },
    { name: "Sail colour", items: ["amber", "crimson", "ivory", "navy", "teal"] },
    { name: "Catch", items: ["cod", "haddock", "mackerel", "pollock", "skate"] },
    { name: "Berth", items: ["one", "two", "three", "four", "five"] }] },
  { subject: "Camper", items: ["Hal", "Iris", "Jo", "Kit", "Lena"], cats: [
    { name: "Tent colour", items: ["blue", "forest", "orange", "sand", "slate"] },
    { name: "Site", items: ["creekside", "hilltop", "meadow", "pine grove", "lakeside"] },
    { name: "Supper", items: ["chilli", "foil packets", "pancakes", "stew", "tacos"] },
    { name: "Arrival", items: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] }] },
];

const LOGIC_SHAPE = {
  beginner: { n: 3, c: 2 },
  easy: { n: 4, c: 2 },
  medium: { n: 4, c: 3 },
  hard: { n: 5, c: 3 },
  expert: { n: 5, c: 4 },
};

function permutations(n) {
  const out = [];
  const rec = (acc, left) => {
    if (!left.length) { out.push(acc.slice()); return; }
    for (let i = 0; i < left.length; i++) {
      acc.push(left[i]);
      rec(acc, left.slice(0, i).concat(left.slice(i + 1)));
      acc.pop();
    }
  };
  rec([], range(n));
  return out;
}

// A clue is a predicate over `assign` (assign[ci][subjectIndex] = itemIndex),
// plus the categories it mentions so the solver knows when it can be tested.
function logicCluePool(set, n, c, assign) {
  const sub = (i) => set.items[i];
  const cat = (ci) => set.cats[ci].name.toLowerCase();
  const item = (ci, vi) => set.cats[ci].items[vi];
  const out = [];
  for (let si = 0; si < n; si++) {
    for (let ci = 0; ci < c; ci++) {
      out.push({ cats: [ci], weight: 1,
        text: `${sub(si)}'s ${cat(ci)} is ${item(ci, assign[ci][si])}.`,
        test: (a) => a[ci][si] === assign[ci][si] });
      for (let vi = 0; vi < n; vi++) {
        if (vi === assign[ci][si]) continue;
        out.push({ cats: [ci], weight: 3,
          text: `${sub(si)}'s ${cat(ci)} is not ${item(ci, vi)}.`,
          test: (a) => a[ci][si] !== vi });
      }
    }
  }
  for (let a1 = 0; a1 < c; a1++) for (let b1 = 0; b1 < c; b1++) {
    if (a1 === b1) continue;
    for (let si = 0; si < n; si++) {
      const xa = assign[a1][si], yb = assign[b1][si];
      out.push({ cats: [a1, b1], weight: 2,
        text: `Whoever has ${item(a1, xa)} for ${cat(a1)} also has ${item(b1, yb)} for ${cat(b1)}.`,
        test: (arr) => { const i = arr[a1].indexOf(xa); return i >= 0 && arr[b1][i] === yb; } });
      for (let vj = 0; vj < n; vj++) {
        if (vj === yb) continue;
        out.push({ cats: [a1, b1], weight: 4,
          text: `Whoever has ${item(a1, xa)} for ${cat(a1)} does not have ${item(b1, vj)} for ${cat(b1)}.`,
          test: (arr) => { const i = arr[a1].indexOf(xa); return i >= 0 && arr[b1][i] !== vj; } });
      }
    }
  }
  return out;
}

function logicSolutions(clues, n, c, perms, limit) {
  let found = 0, nodes = 0;
  const chosen = [];
  const rec = (ci) => {
    if (found >= limit || ++nodes > 300000) return;
    if (ci === c) { found++; return; }
    for (const p of perms) {
      chosen[ci] = p;
      let ok = true;
      for (const cl of clues) {
        if (cl.cats.some((x) => x > ci)) continue;
        if (!cl.test(chosen)) { ok = false; break; }
      }
      if (ok) rec(ci + 1);
      if (found >= limit) { chosen.length = ci; return; }
    }
    chosen.length = ci;
  };
  rec(0);
  return found;
}

export function logicGrid(difficulty = "medium", seed = 0) {
  const shape = LOGIC_SHAPE[difficulty] || LOGIC_SHAPE.medium;
  const n = shape.n, c = shape.c;
  const base = LOGIC_SETS[seed % LOGIC_SETS.length];
  const catPick = shuffle(range(base.cats.length)).slice(0, c).sort((a, b) => a - b);
  const set = {
    subject: base.subject,
    items: base.items.slice(0, n),
    cats: catPick.map((i) => ({ name: base.cats[i].name, items: base.cats[i].items.slice(0, n) })),
  };
  const perms = permutations(n);
  const assign = set.cats.map(() => shuffle(range(n)));
  // Clue mix matters more than clue count. Sorting purely by weight fills the
  // list with "X's pet is the dog" givens until the grid is simply stated — a
  // lookup table, not a deduction. So allow only a couple of outright givens
  // and make the solver work from negatives and cross-category links.
  const pool = logicCluePool(set, n, c, assign);
  const posQuota = difficulty === "beginner" ? 2 : 1;
  const positives = shuffle(pool.filter((cl) => cl.weight === 1)).slice(0, posQuota);
  const rest = shuffle(pool.filter((cl) => cl.weight !== 1));
  const clues = [];
  // Growing one clue at a time means a full solve per clue, which at 5×4 costs
  // about a second. Add in small batches, then let the prune pass below remove
  // whatever the batch overshot — same result, roughly a third of the solves.
  const batch = n * c >= 15 ? 4 : n * c >= 12 ? 3 : 1;
  const queue = positives.concat(rest);
  for (let i = 0; i < queue.length; i += batch) {
    if (logicSolutions(clues, n, c, perms, 2) === 1) break;
    for (let j = i; j < Math.min(i + batch, queue.length); j++) clues.push(queue[j]);
  }
  for (let i = clues.length - 1; i >= 0; i--) {
    const without = clues.slice(0, i).concat(clues.slice(i + 1));
    if (logicSolutions(without, n, c, perms, 2) === 1) clues.splice(i, 1);
  }
  const truth = set.items.map((_, i) => set.cats.map((cat, ci) => cat.items[assign[ci][i]]));
  return {
    kind: "logicgrid", subject: base.subject, subjects: set.items, cats: set.cats,
    unique: logicSolutions(clues, n, c, perms, 2) === 1,
    clues: shuffle(clues).map((cl, i) => ({ n: i + 1, text: cl.text })),
    solution: truth, difficulty,
  };
}

/* ============================================================== word ladder */

const LADDER_DICT = "ABLE ACHE ACID AGED AIDE ALSO AREA BAKE BALD BALE BALL BAND BANE BANK BARE BARK BARN BASE BASK BATE BEAD BEAM BEAN BEAR BEAT BELL BELT BEND BENT BEST BIKE BILL BIND BIRD BITE BLED BLOW BLUE BOAR BOAT BOLD BOLT BONE BOOK BOOM BOOT BORE BORN BOWL BRAG BRAN BRED BREW BRIM BROW BUCK BULK BULL BUMP BUNK BUNT BURN BURY BUSH BUST BUSY CAGE CAKE CALF CALL CALM CAME CAMP CANE CAPE CARD CARE CARP CART CASE CASH CAST CAVE CELL CHAT CHEW CHIN CHIP CHOP CITY CLAD CLAM CLAN CLAP CLAW CLAY CLIP CLOG CLOT CLUB CLUE COAL COAT CODE COIL COIN COLD COLT COMB COME CONE COOK COOL COPE CORD CORE CORK CORN COST COVE CRAB CRAM CREW CRIB CROP CROW CUBE CURB CURD CURE CURL DAMP DARE DARK DARN DART DASH DATE DAWN DEAF DEAL DEAN DEAR DEBT DECK DEED DEEP DEER DENT DESK DIAL DIET DIME DINE DIRT DISH DISK DIVE DOCK DOLL DOME DONE DOOM DOOR DOSE DOVE DOWN DRAG DRAW DREW DRIP DROP DRUM DUCK DUNE DUSK DUST EACH EARL EARN EASE EAST EDGE FACE FACT FADE FAIL FAIR FALL FAME FARE FARM FAST FATE FEAR FEAT FEED FEEL FELL FELT FERN FILE FILL FILM FIND FINE FIRE FIRM FISH FIST FIVE FLAG FLAP FLAT FLAW FLED FLEE FLEW FLIP FLOW FOAM FOLD FOLK FOND FOOD FOOL FOOT FORD FORE FORK FORM FORT FOUL FOUR FOWL FROG FROM FUEL FULL FUND FUSE GAIN GAIT GALE GAME GATE GAVE GEAR GERM GIFT GILD GIRL GIVE GLAD GLEN GLOW GLUE GOAL GOAT GOLD GOLF GONE GOOD GOWN GRAB GRAM GRAY GREW GRID GRIM GRIN GRIP GROW GULF GULL GUSH HAIL HAIR HALF HALL HALT HAND HANG HARD HARE HARM HARP HASH HATE HAUL HAVE HAWK HAZE HEAD HEAL HEAP HEAR HEAT HEEL HELD HELM HELP HERD HERO HIDE HIGH HIKE HILL HINT HIRE HIVE HOLD HOLE HOLY HOME HOOD HOOF HOOK HOOP HOPE HORN HOSE HOST HOUR HUNT HURT HUSH ICON IDEA IDLE INCH IRON ITEM JADE JAIL JAZZ JEST JOIN JOKE JUMP JUNE JURY JUST KEEL KEEN KEEP KELP KEPT KICK KILN KILT KIND KING KISS KITE KNEE KNEW KNIT KNOB KNOT LACE LACK LAKE LAMB LAME LAMP LAND LANE LAST LATE LAWN LEAD LEAF LEAK LEAN LEAP LEFT LEND LENS LENT LESS LIAR LIFE LIFT LIKE LIMB LIME LIMP LINE LINK LION LIST LIVE LOAD LOAF LOAM LOAN LOCK LODE LOFT LONE LONG LOOK LOOM LOOP LORD LORE LOSE LOSS LOST LOUD LOVE LUCK LUNG LURE LUSH MADE MAID MAIL MAIN MAKE MALE MALL MALT MANE MANY MARE MARK MASK MAST MATE MAZE MEAL MEAN MEAT MEET MELT MEND MENU MERE MESH MICE MILD MILE MILK MILL MIND MINE MINT MIST MOAT MODE MOLD MOLE MOOD MOON MOOR MORE MOSS MOST MOTH MOVE MUCH MULE MUTE NAIL NAME NEAR NEAT NECK NEED NEST NEWS NEXT NICE NINE NODE NONE NOON NORM NOSE NOTE NOUN OATH OBEY ODDS OMEN ONCE OPEN OVAL OVEN OWED PACE PACK PAGE PAID PAIL PAIN PAIR PALE PALM PANE PARK PART PASS PAST PATH PAVE PEAK PEAL PEAR PEAT PECK PEEL PEER PELT PERK PEST PICK PIER PIKE PILE PILL PINE PINK PINT PIPE PITY PLAN PLAY PLEA PLOT PLOW PLUG PLUM POEM POET POLE POLL POND PONY POOL POOR PORE PORK PORT POSE POST POUR PRAY PREY PROP PULL PUMP PURE PUSH QUIT RACE RACK RAFT RAGE RAID RAIL RAIN RAKE RAMP RANG RANK RARE RASH RATE READ REAL REAP REAR REED REEF REEL REND RENT REST RICE RICH RIDE RIFT RIND RING RINK RIPE RISE RISK ROAD ROAM ROAR ROBE ROCK RODE ROLE ROLL ROOF ROOM ROOT ROPE ROSE RUDE RUIN RULE RUSH RUST SAFE SAGE SAID SAIL SAKE SALE SALT SAME SAND SANE SANG SANK SASH SAVE SCAN SCAR SEAL SEAM SEAT SEED SEEK SEEM SEEN SELF SELL SEND SENT SHED SHIN SHIP SHOE SHOP SHOT SHOW SHUT SICK SIDE SIGN SILK SILL SING SINK SITE SIZE SKIN SKIP SLAB SLAM SLAP SLED SLID SLIM SLIP SLOT SLOW SNAP SNOW SOAK SOAP SOAR SOCK SOFT SOIL SOLD SOLE SOME SONG SOON SORE SORT SOUL SOUP SOUR SPAN SPAR SPIN SPOT SPUR STAR STAY STEM STEP STEW STIR STOP STOW SUCH SUIT SUNG SUNK SURE SWAM SWAN SWAP SWAY SWIM TACK TAIL TAKE TALE TALK TALL TAME TANK TAPE TASK TEAL TEAM TEAR TELL TEND TENT TERM TEST TEXT THAN THAT THAW THEM THEN THEY THIN THIS THUS TIDE TIDY TIED TILE TILL TILT TIME TINY TIRE TOAD TOIL TOLD TOLL TOMB TONE TOOK TOOL TORE TORN TOSS TOUR TOWN TRAM TRAP TRAY TREE TRIM TRIP TROT TRUE TUBE TUCK TUNE TURF TURN TWIG TWIN TYPE VAIN VALE VAN VASE VAST VEIL VEIN VENT VERB VERY VEST VIEW VINE VOTE WADE WAGE WAIL WAIT WAKE WALK WALL WAND WANE WANT WARD WARM WARN WARP WASH WASP WAVE WEAK WEAR WEED WEEK WEEP WELD WELL WENT WERE WEST WHAT WHEN WHIP WIDE WIFE WILD WILL WIND WINE WING WINK WIRE WISE WISH WITH WOLF WOOD WOOL WORD WORE WORK WORM WORN WRAP YARD YARN YEAR YELL YOUR ZEAL ZONE".split(" ");

export function wordLadder(difficulty = "medium", seed = 0) {
  const steps = { beginner: 3, easy: 4, medium: 5, hard: 6, expert: 7 }[difficulty] || 5;
  const words = LADDER_DICT.filter((w) => w.length === 4);
  const set = new Set(words);
  const neighbours = (w) => {
    const out = [];
    for (let i = 0; i < w.length; i++) for (let ch = 65; ch <= 90; ch++) {
      const c = String.fromCharCode(ch);
      if (c === w[i]) continue;
      const cand = w.slice(0, i) + c + w.slice(i + 1);
      if (set.has(cand)) out.push(cand);
    }
    return out;
  };
  for (let attempt = 0; attempt < 400; attempt++) {
    const start = words[rnd(words.length)];
    // BFS to depth `steps` and take an endpoint at exactly that distance
    let frontier = [[start]];
    const seen = new Set([start]);
    for (let d = 0; d < steps; d++) {
      const next = [];
      for (const path of frontier) for (const nb of shuffle(neighbours(path[path.length - 1]))) {
        if (seen.has(nb)) continue;
        seen.add(nb);
        next.push(path.concat([nb]));
      }
      frontier = next;
      if (!frontier.length) break;
    }
    if (!frontier.length) continue;
    const path = frontier[rnd(frontier.length)];
    // confirm the shortest route really is this long
    if (path.length !== steps + 1) continue;
    return {
      kind: "wordladder", start: path[0], end: path[path.length - 1],
      rungs: path.length - 2, solution: path, difficulty,
    };
  }
  return { kind: "wordladder", start: "COLD", end: "WARM", rungs: 3, solution: ["COLD","CORD","WORD","WARD","WARM"], difficulty };
}

/* ============================================================ anagram pairs */

export function anagramMatch(words, count = 10) {
  const picks = shuffle(words.filter((w) => w.length >= 4)).slice(0, count);
  const scrambled = picks.map((w) => {
    let s = w, guard = 0;
    while (s === w && guard++ < 20) s = shuffle(w.split("")).join("");
    return s;
  });
  const order = shuffle(range(picks.length));
  return {
    kind: "anagram",
    left: scrambled.map((s, i) => ({ label: String.fromCharCode(65 + i), text: s, answerIdx: order.indexOf(i) })),
    right: order.map((i, pos) => ({ label: String(pos + 1), text: picks[i] })),
    solution: scrambled.map((s, i) => ({ from: String.fromCharCode(65 + i), to: String(order.indexOf(i) + 1), word: picks[i] })),
  };
}

/* ============================================================== fill-in grid */

export function fillIn(crosswordPuzzle) {
  const p = crosswordPuzzle;
  return {
    kind: "fillin", size: p.size, grid: p.grid, entries: p.entries,
    numbers: p.numbers,
    bank: p.entries.map((e) => e.word).sort((a, b) => a.length - b.length || a.localeCompare(b)),
    solution: p.grid,
  };
}

/* ================================================================== trivia */

const TRIVIA = [
  ["Which planet is closest to the sun?", "Mercury", "Science"],
  ["How many strings does a standard violin have?", "Four", "Music"],
  ["What is the largest ocean on Earth?", "The Pacific", "Geography"],
  ["Which gas do plants absorb from the air?", "Carbon dioxide", "Science"],
  ["What is the tallest mountain above sea level?", "Mount Everest", "Geography"],
  ["How many sides does a hexagon have?", "Six", "Math"],
  ["What is the main ingredient in traditional hummus?", "Chickpeas", "Food"],
  ["Which metal is liquid at room temperature?", "Mercury", "Science"],
  ["How many minutes are in a full day?", "1,440", "Math"],
  ["What is a group of crows called?", "A murder", "Nature"],
  ["Which sea creature has three hearts?", "The octopus", "Nature"],
  ["What is the smallest prime number?", "Two", "Math"],
  ["Which country gave us the tulip trade boom?", "The Netherlands", "History"],
  ["What do you call a shape with eight sides?", "An octagon", "Math"],
  ["Which vitamin does sunlight help your body make?", "Vitamin D", "Health"],
  ["What is the hardest natural substance?", "Diamond", "Science"],
  ["How many bones are in the adult human body?", "206", "Health"],
  ["Which bird can fly backwards?", "The hummingbird", "Nature"],
  ["What is the longest river in South America?", "The Amazon", "Geography"],
  ["How many degrees are in a circle?", "360", "Math"],
  ["What is dried plum called?", "A prune", "Food"],
  ["Which instrument has 88 keys?", "The piano", "Music"],
  ["What is the study of fossils called?", "Palaeontology", "Science"],
  ["How many players are on a baseball field per team?", "Nine", "Sports"],
];

export function trivia(count = 10, seed = 0) {
  const picks = shuffle(TRIVIA).slice(0, count);
  return {
    kind: "trivia",
    items: picks.map(([q, a, cat], i) => ({ n: i + 1, q, a, cat })),
    solution: picks.map(([, a]) => a),
  };
}

/* ============================================================== dot to dot */
// Parametric outlines only — plain geometry, numbered in order.

const SHAPES = {
  star: (t, k) => { const r = k % 2 ? 0.42 : 1; return [Math.cos(t) * r, Math.sin(t) * r]; },
  flower: (t) => { const r = 0.55 + 0.45 * Math.cos(6 * t); return [Math.cos(t) * r, Math.sin(t) * r]; },
  heart: (t) => [0.62 * Math.pow(Math.sin(t), 3), -(0.5 * Math.cos(t) - 0.2 * Math.cos(2 * t) - 0.09 * Math.cos(3 * t) - 0.02 * Math.cos(4 * t))],
  spiral: (t) => { const r = 0.15 + (t / (Math.PI * 6)) * 0.85; return [Math.cos(t) * r, Math.sin(t) * r]; },
  moon: (t) => { const r = 0.9 - 0.35 * Math.max(0, Math.cos(t)); return [Math.cos(t) * r, Math.sin(t) * r]; },
  leaf: (t) => { const r = Math.abs(Math.sin(t)) * 0.5 + 0.5 * Math.abs(Math.cos(t / 2)); return [Math.cos(t) * r * 0.8, Math.sin(t) * r]; },
};

export function dotToDot(difficulty = "easy", seed = 0) {
  const names = Object.keys(SHAPES);
  const name = names[seed % names.length];
  const count = { beginner: 14, easy: 20, medium: 28, hard: 38, expert: 48 }[difficulty] || 24;
  const turns = name === "spiral" ? 6 : 2;
  const pts = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * turns;
    const [x, y] = SHAPES[name](t, i);
    pts.push({ n: i + 1, x: +(50 + x * 44).toFixed(2), y: +(50 + y * 44).toFixed(2) });
  }
  return { kind: "dottodot", shape: name, points: pts, solution: name, difficulty };
}

/* =========================================================== coloring page */
// Geometric repeat patterns built from primitives — no illustration required.

export function coloringPattern(seed = 0) {
  const styles = ["rings", "tiles", "petals", "scales"];
  const style = styles[seed % styles.length];
  const cells = [];
  if (style === "rings") {
    for (let i = 0; i < 9; i++) cells.push({ size: 100 - i * 10, rot: i * 10, shape: i % 2 ? "circle" : "square" });
  } else if (style === "tiles") {
    for (let r = 0; r < 6; r++) for (let c = 0; c < 5; c++) cells.push({ r, c, shape: (r + c) % 3 === 0 ? "circle" : (r + c) % 3 === 1 ? "square" : "diamond", rot: ((r * 5 + c) % 4) * 15 });
  } else if (style === "petals") {
    for (let i = 0; i < 12; i++) cells.push({ rot: i * 30, shape: "petal" });
  } else {
    for (let r = 0; r < 8; r++) for (let c = 0; c < 7; c++) cells.push({ r, c, shape: "arc", rot: 0 });
  }
  return { kind: "coloring", style, cells, solution: null };
}
