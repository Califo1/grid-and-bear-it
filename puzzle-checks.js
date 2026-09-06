/* Grid & Bear It — puzzle validator checks.
   Classic script: assigns self.PZ_CHECKS. Runs in a Worker and on a page.
   Independent of the engines: these solvers are written against the puzzle
   RULES, not against the generator, so a generator bug cannot hide itself.

   Every check returns { fails: [string], warns: [string] }. Empty fails = pass.
   Solvers take a node budget and report "inconclusive" rather than running long. */
(function () {
  var NODE_BUDGET = 400000;

  function fail(o, m) { o.fails.push(m); }
  function warn(o, m) { o.warns.push(m); }
  function res() { return { fails: [], warns: [] }; }

  /* ---------------------------------------------------------------- helpers */

  function isDigits(g, n, lo, hi) {
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) {
      var v = g[r][c];
      if (typeof v !== "number" || v < lo || v > hi) return false;
    }
    return true;
  }

  function dupIn(arr) {
    var seen = {}, out = [];
    for (var i = 0; i < arr.length; i++) {
      var k = String(arr[i]);
      if (seen[k]) out.push(arr[i]); else seen[k] = 1;
    }
    return out;
  }

  /* ------------------------------------------------- generic latin solver */
  // regions: array of cell-index arrays (each must hold 1..n exactly once).
  // grid: n×n of 0/null for blank. Returns {count, inconclusive}.
  function countLatin(grid, n, regions, extraOk, limit) {
    var cells = [], i, r, c;
    var g = [];
    for (r = 0; r < n; r++) { g.push([]); for (c = 0; c < n; c++) g[r].push(grid[r][c] || 0); }
    for (r = 0; r < n; r++) for (c = 0; c < n; c++) if (!g[r][c]) cells.push([r, c]);
    var regionsOf = {};
    for (i = 0; i < regions.length; i++) {
      for (var j = 0; j < regions[i].length; j++) {
        var k = regions[i][j];
        (regionsOf[k] = regionsOf[k] || []).push(i);
      }
    }
    var found = 0, nodes = 0, blown = false;
    function ok(rr, cc, v) {
      var x;
      for (x = 0; x < n; x++) if (g[rr][x] === v || g[x][cc] === v) return false;
      var mine = regionsOf[rr * n + cc] || [];
      for (x = 0; x < mine.length; x++) {
        var reg = regions[mine[x]];
        for (var y = 0; y < reg.length; y++) {
          var rr2 = Math.floor(reg[y] / n), cc2 = reg[y] % n;
          if (g[rr2][cc2] === v) return false;
        }
      }
      if (extraOk && !extraOk(g, rr, cc, v, n)) return false;
      return true;
    }
    function rec(idx) {
      if (blown || found >= limit) return;
      if (++nodes > NODE_BUDGET) { blown = true; return; }
      if (idx === cells.length) { found++; return; }
      var rr = cells[idx][0], cc = cells[idx][1];
      for (var v = 1; v <= n; v++) {
        if (!ok(rr, cc, v)) continue;
        g[rr][cc] = v; rec(idx + 1); g[rr][cc] = 0;
        if (blown || found >= limit) return;
      }
    }
    rec(0);
    return { count: found, inconclusive: blown };
  }

  function boxRegions(n) {
    var out = [], b = Math.round(Math.sqrt(n));
    if (b * b !== n) return out;
    for (var br = 0; br < n; br += b) for (var bc = 0; bc < n; bc += b) {
      var reg = [];
      for (var r = 0; r < b; r++) for (var c = 0; c < b; c++) reg.push((br + r) * n + bc + c);
      out.push(reg);
    }
    return out;
  }

  function diagOk(g, r, c, v, n) {
    if (r === c) { for (var i = 0; i < n; i++) if (g[i][i] === v) return false; }
    if (r + c === n - 1) { for (var j = 0; j < n; j++) if (g[j][n - 1 - j] === v) return false; }
    return true;
  }

  /* ------------------------------------------------------------ sudoku 9×9 */

  function checkSudoku(p) {
    var o = res();
    if (!p || !p.grid || !p.solution) { fail(o, "no grid/solution returned"); return o; }
    var flat = p.grid.length === 81 && typeof p.grid[0] === "number";
    var g = flat ? unflat(p.grid, 9) : p.grid, s = flat ? unflat(p.solution, 9) : p.solution;
    if (!isDigits(s, 9, 1, 9)) fail(o, "solution has non-digits or blanks");
    var regs = boxRegions(9);
    if (!latinValid(s, 9, regs)) fail(o, "solution breaks row/column/box rules");
    var givens = 0;
    for (var r = 0; r < 9; r++) for (var c = 0; c < 9; c++) {
      var v = g[r][c] || 0;
      if (v) { givens++; if (v !== s[r][c]) fail(o, "given at r" + r + "c" + c + " contradicts the solution"); }
    }
    if (!givens) fail(o, "puzzle has no givens");
    var u = countLatin(g, 9, regs, null, 2);
    if (u.inconclusive) warn(o, "uniqueness inconclusive (search budget)");
    else if (u.count === 0) fail(o, "puzzle has NO solution");
    else if (u.count > 1) fail(o, "puzzle has more than one solution");
    return o;
  }

  function unflat(a, n) {
    var out = [];
    for (var r = 0; r < n; r++) { var row = []; for (var c = 0; c < n; c++) row.push(a[r * n + c]); out.push(row); }
    return out;
  }

  function latinValid(g, n, regions) {
    var r, c, i, seen;
    for (r = 0; r < n; r++) { seen = {}; for (c = 0; c < n; c++) { if (seen[g[r][c]]) return false; seen[g[r][c]] = 1; } }
    for (c = 0; c < n; c++) { seen = {}; for (r = 0; r < n; r++) { if (seen[g[r][c]]) return false; seen[g[r][c]] = 1; } }
    for (i = 0; i < regions.length; i++) {
      seen = {};
      for (var j = 0; j < regions[i].length; j++) {
        var v = g[Math.floor(regions[i][j] / n)][regions[i][j] % n];
        if (seen[v]) return false; seen[v] = 1;
      }
    }
    return true;
  }

  /* --------------------------------------------------- sudoku variants */

  function checkSudokuVariant(p) {
    var o = res();
    if (!p || !p.grid || !p.solution) { fail(o, "no grid/solution returned"); return o; }
    var n = p.n || Math.round(Math.sqrt(p.grid.length));
    var g = (typeof p.grid[0] === "number") ? unflat(p.grid, n) : p.grid;
    var s = (typeof p.solution[0] === "number") ? unflat(p.solution, n) : p.solution;
    if (!isDigits(s, n, 1, n)) fail(o, "solution has non-digits or blanks");
    var regs = [];
    if (p.regions && p.regions.length) {
      // regions may be a flat region-id map, an n×n id map, or index arrays
      if (typeof p.regions[0] === "number") {
        var byId = {};
        for (var i = 0; i < p.regions.length; i++) (byId[p.regions[i]] = byId[p.regions[i]] || []).push(i);
        for (var k in byId) regs.push(byId[k]);
      } else if (Array.isArray(p.regions[0]) && typeof p.regions[0][0] === "number" && p.regions.length === n && p.regions[0].length === n) {
        var m = {};
        for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) (m[p.regions[r][c]] = m[p.regions[r][c]] || []).push(r * n + c);
        for (var k2 in m) regs.push(m[k2]);
      } else {
        regs = p.regions;
      }
    } else regs = boxRegions(n);
    for (var q = 0; q < regs.length; q++) if (regs[q].length !== n) fail(o, "region " + q + " covers " + regs[q].length + " cells, expected " + n);
    var extra = p.diagonals ? diagOk : null;
    if (!latinValid(s, n, regs)) fail(o, "solution breaks row/column/region rules");
    if (p.diagonals) {
      var d1 = {}, d2 = {};
      for (var x = 0; x < n; x++) {
        if (d1[s[x][x]]) fail(o, "solution repeats on the main diagonal"); d1[s[x][x]] = 1;
        if (d2[s[x][n - 1 - x]]) fail(o, "solution repeats on the anti-diagonal"); d2[s[x][n - 1 - x]] = 1;
      }
    }
    var givens = 0;
    for (var r2 = 0; r2 < n; r2++) for (var c2 = 0; c2 < n; c2++) {
      var v = g[r2][c2] || 0;
      if (v) { givens++; if (v !== s[r2][c2]) fail(o, "given at r" + r2 + "c" + c2 + " contradicts the solution"); }
    }
    if (!givens) fail(o, "puzzle has no givens");
    if (typeof p.givens === "number" && p.givens !== givens) warn(o, "stated givens " + p.givens + " but grid has " + givens);
    var u = countLatin(g, n, regs, extra, 2);
    if (u.inconclusive) warn(o, "uniqueness inconclusive (search budget)");
    else if (u.count === 0) fail(o, "puzzle has NO solution");
    else if (u.count > 1) fail(o, "puzzle has more than one solution");
    return o;
  }

  /* ---------------------------------------------------------------- kenken */

  function cageValue(op, vals) {
    var i, t;
    if (op === "+" || op === "sum") { t = 0; for (i = 0; i < vals.length; i++) t += vals[i]; return t; }
    if (op === "*" || op === "x" || op === "×") { t = 1; for (i = 0; i < vals.length; i++) t *= vals[i]; return t; }
    if (op === "-" || op === "−") return Math.abs(vals[0] - vals[1]);
    if (op === "/" || op === "÷") { var a = Math.max(vals[0], vals[1]), b = Math.min(vals[0], vals[1]); return b ? a / b : NaN; }
    return vals.length === 1 ? vals[0] : NaN;
  }

  function checkKenken(p) {
    var o = res();
    if (!p || !p.solution || !p.cages) { fail(o, "no solution/cages returned"); return o; }
    var n = p.n || p.solution.length, s = p.solution;
    if (!isDigits(s, n, 1, n)) fail(o, "solution has values outside 1.." + n);
    if (!latinValid(s, n, [])) fail(o, "solution is not a latin square");
    var covered = {}, total = 0;
    for (var i = 0; i < p.cages.length; i++) {
      var cg = p.cages[i], cells = cg.cells || cg.c || [];
      if (!cells.length) { fail(o, "cage " + i + " has no cells"); continue; }
      var vals = [];
      for (var j = 0; j < cells.length; j++) {
        var rr = Array.isArray(cells[j]) ? cells[j][0] : cells[j].r;
        var cc = Array.isArray(cells[j]) ? cells[j][1] : cells[j].c;
        var key = rr + "," + cc;
        if (covered[key]) fail(o, "cell r" + rr + "c" + cc + " is in more than one cage");
        covered[key] = 1; total++;
        vals.push(s[rr][cc]);
      }
      var op = cg.op || cg.o, target = cg.target != null ? cg.target : (cg.v != null ? cg.v : cg.value);
      if (target != null && op) {
        var got = cageValue(op, vals);
        if (got !== target) fail(o, "cage " + i + " says " + target + op + " but the solution gives " + got);
      } else if (target == null) warn(o, "cage " + i + " has no target value");
    }
    if (total !== n * n) fail(o, "cages cover " + total + " cells, grid has " + n * n);
    var blank = [];
    for (var r = 0; r < n; r++) { var row = []; for (var c = 0; c < n; c++) row.push(0); blank.push(row); }
    var u = countKenken(blank, n, p.cages, 2);
    if (u.inconclusive) warn(o, "uniqueness inconclusive (search budget)");
    else if (u.count === 0) fail(o, "cage clues admit NO solution");
    else if (u.count > 1) fail(o, "cage clues admit " + u.count + "+ solutions");
    return o;
  }

  function countKenken(grid, n, cages, limit) {
    var g = grid.map(function (r) { return r.slice(); });
    var cellsOf = [], i, j;
    var cageOfCell = {};
    for (i = 0; i < cages.length; i++) {
      var cells = cages[i].cells || cages[i].c || [];
      for (j = 0; j < cells.length; j++) {
        var rr = Array.isArray(cells[j]) ? cells[j][0] : cells[j].r;
        var cc = Array.isArray(cells[j]) ? cells[j][1] : cells[j].c;
        cageOfCell[rr + "," + cc] = i;
      }
    }
    for (i = 0; i < n; i++) for (j = 0; j < n; j++) cellsOf.push([i, j]);
    var found = 0, nodes = 0, blown = false;
    function cageOk(ci) {
      var cg = cages[ci], cells = cg.cells || cg.c || [];
      var vals = [], anyBlank = false;
      for (var k = 0; k < cells.length; k++) {
        var rr = Array.isArray(cells[k]) ? cells[k][0] : cells[k].r;
        var cc = Array.isArray(cells[k]) ? cells[k][1] : cells[k].c;
        if (!g[rr][cc]) { anyBlank = true; continue; }
        vals.push(g[rr][cc]);
      }
      if (anyBlank) return true;
      var op = cg.op || cg.o, target = cg.target != null ? cg.target : (cg.v != null ? cg.v : cg.value);
      if (target == null || !op) return true;
      return cageValue(op, vals) === target;
    }
    function rec(idx) {
      if (blown || found >= limit) return;
      if (++nodes > NODE_BUDGET) { blown = true; return; }
      if (idx === cellsOf.length) { found++; return; }
      var r = cellsOf[idx][0], c = cellsOf[idx][1];
      for (var v = 1; v <= n; v++) {
        var bad = false, x;
        for (x = 0; x < n; x++) if (g[r][x] === v || g[x][c] === v) { bad = true; break; }
        if (bad) continue;
        g[r][c] = v;
        if (cageOk(cageOfCell[r + "," + c])) rec(idx + 1);
        g[r][c] = 0;
        if (blown || found >= limit) return;
      }
    }
    rec(0);
    return { count: found, inconclusive: blown };
  }

  /* ---------------------------------------------------------------- kakuro */

  function checkKakuro(p) {
    var o = res();
    if (!p || !p.solution || !p.runs) { fail(o, "no solution/runs returned"); return o; }
    var n = p.n, s = p.solution, i, j;
    for (i = 0; i < p.runs.length; i++) {
      var run = p.runs[i], cells = run.cells || [];
      if (cells.length < 2) fail(o, "run " + i + " has length " + cells.length + " (a run must be 2 or more)");
      if (cells.length > 9) fail(o, "run " + i + " has length " + cells.length + " (over 9 digits cannot be distinct)");
      var sum = 0, seen = {};
      for (j = 0; j < cells.length; j++) {
        var v = s[cells[j][0]][cells[j][1]];
        if (!v || v < 1 || v > 9) fail(o, "run " + i + " covers a cell with value " + v);
        if (seen[v]) fail(o, "run " + i + " repeats the digit " + v);
        seen[v] = 1; sum += v;
      }
      if (run.sum != null && sum !== run.sum) fail(o, "run " + i + " is clued " + run.sum + " but sums to " + sum);
    }
    // every open cell must belong to an across run AND a down run, or the
    // clue numbers on the page do not constrain it.
    var inAcross = {}, inDown = {};
    for (i = 0; i < p.runs.length; i++) {
      var rn = p.runs[i], cs = rn.cells || [];
      var horiz = rn.horiz != null ? rn.horiz : (cs.length > 1 && cs[0][0] === cs[1][0]);
      for (j = 0; j < cs.length; j++) (horiz ? inAcross : inDown)[cs[j][0] + "," + cs[j][1]] = 1;
    }
    var orphans = 0;
    for (var r = 1; r < n; r++) for (var c = 1; c < n; c++) {
      if (p.block && p.block[r][c]) continue;
      var k = r + "," + c;
      if (!inAcross[k] || !inDown[k]) orphans++;
    }
    if (orphans) warn(o, orphans + " open cell(s) sit in only one run — solvable but under-clued");
    var u = countKakuro(n, p.block, p.runs, 2);
    if (u.inconclusive) warn(o, "uniqueness inconclusive (search budget)");
    else if (u.count === 0) fail(o, "clues admit NO solution");
    else if (u.count > 1) fail(o, "clues admit more than one solution");
    return o;
  }

  function countKakuro(n, block, runs, limit) {
    var cells = [], r, c, i;
    for (r = 1; r < n; r++) for (c = 1; c < n; c++) if (!block || !block[r][c]) cells.push([r, c]);
    var g = [];
    for (r = 0; r < n; r++) { var row = []; for (c = 0; c < n; c++) row.push(0); g.push(row); }
    var runsFor = {};
    for (i = 0; i < runs.length; i++) {
      var cs = runs[i].cells || [];
      for (var j = 0; j < cs.length; j++) (runsFor[cs[j][0] + "," + cs[j][1]] = runsFor[cs[j][0] + "," + cs[j][1]] || []).push(runs[i]);
    }
    var found = 0, nodes = 0, blown = false;
    function rec(idx) {
      if (blown || found >= limit) return;
      if (++nodes > NODE_BUDGET) { blown = true; return; }
      if (idx === cells.length) { found++; return; }
      var r0 = cells[idx][0], c0 = cells[idx][1];
      var mine = runsFor[r0 + "," + c0] || [];
      for (var v = 1; v <= 9; v++) {
        var ok = true;
        for (var m = 0; m < mine.length && ok; m++) {
          var run = mine[m], cs = run.cells, sum = v, empty = 0;
          for (var k = 0; k < cs.length; k++) {
            if (cs[k][0] === r0 && cs[k][1] === c0) continue;
            var gv = g[cs[k][0]][cs[k][1]];
            if (gv === v) { ok = false; break; }
            if (gv) sum += gv; else empty++;
          }
          if (!ok) break;
          if (run.sum != null && (sum > run.sum - empty || (empty === 0 && sum !== run.sum))) ok = false;
        }
        if (!ok) continue;
        g[r0][c0] = v; rec(idx + 1); g[r0][c0] = 0;
        if (blown || found >= limit) return;
      }
    }
    rec(0);
    return { count: found, inconclusive: blown };
  }

  /* -------------------------------------------------------------- nonogram */

  function lineClues(line) {
    var out = [], run = 0;
    for (var i = 0; i < line.length; i++) {
      if (line[i]) run++;
      else if (run) { out.push(run); run = 0; }
    }
    if (run) out.push(run);
    return out.length ? out : [0];
  }

  function sameClue(a, b) {
    var A = (a && a.length ? a : [0]), B = (b && b.length ? b : [0]);
    if (A.length === 1 && A[0] === 0 && B.length === 1 && B[0] === 0) return true;
    if (A.length !== B.length) return false;
    for (var i = 0; i < A.length; i++) if (A[i] !== B[i]) return false;
    return true;
  }

  function checkNonogram(p) {
    var o = res();
    if (!p || !p.solution || !p.rows || !p.cols) { fail(o, "no solution/rows/cols returned"); return o; }
    var n = p.n || p.solution.length, r, c;
    for (r = 0; r < n; r++) {
      var got = lineClues(p.solution[r]);
      if (!sameClue(got, p.rows[r])) fail(o, "row " + (r + 1) + " clue " + JSON.stringify(p.rows[r]) + " does not match the solution " + JSON.stringify(got));
    }
    for (c = 0; c < n; c++) {
      var col = [];
      for (r = 0; r < n; r++) col.push(p.solution[r][c]);
      var gotc = lineClues(col);
      if (!sameClue(gotc, p.cols[c])) fail(o, "column " + (c + 1) + " clue " + JSON.stringify(p.cols[c]) + " does not match the solution " + JSON.stringify(gotc));
    }
    var u = countNonogram(n, p.rows, p.cols, 2);
    if (u.inconclusive) warn(o, "uniqueness inconclusive (search budget)");
    else if (u.count === 0) fail(o, "clues admit NO solution");
    else if (u.count > 1) fail(o, "clues admit more than one picture — the printed solution is not the only answer");
    return o;
  }

  function rowOptions(clue, n) {
    var cl = (clue && clue.length && !(clue.length === 1 && clue[0] === 0)) ? clue : [];
    var out = [];
    (function place(i, pos, acc) {
      if (out.length > 20000) return;
      if (i === cl.length) {
        var line = acc.slice();
        while (line.length < n) line.push(0);
        out.push(line); return;
      }
      var need = 0;
      for (var k = i; k < cl.length; k++) need += cl[k] + (k > i ? 1 : 0);
      for (var s = pos; s + need <= n; s++) {
        var line = acc.slice();
        while (line.length < s) line.push(0);
        for (var b = 0; b < cl[i]; b++) line.push(1);
        if (i < cl.length - 1) line.push(0);
        place(i + 1, line.length, line);
      }
    })(0, 0, []);
    return out;
  }

  function countNonogram(n, rows, cols, limit) {
    var opts = [], r;
    for (r = 0; r < n; r++) {
      opts.push(rowOptions(rows[r], n));
      if (!opts[r].length) return { count: 0, inconclusive: false };
    }
    var found = 0, nodes = 0, blown = false;
    var grid = [];
    function colFeasible(upto) {
      for (var c = 0; c < n; c++) {
        var seg = [], run = 0;
        for (var r2 = 0; r2 < upto; r2++) {
          if (grid[r2][c]) run++; else if (run) { seg.push(run); run = 0; }
        }
        var closed = seg.slice();
        var target = (cols[c] && cols[c].length && !(cols[c].length === 1 && cols[c][0] === 0)) ? cols[c] : [];
        if (closed.length > target.length) return false;
        for (var i = 0; i < closed.length; i++) if (closed[i] !== target[i]) return false;
        if (run) {
          if (closed.length >= target.length) return false;
          if (run > target[closed.length]) return false;
        }
        if (upto === n) {
          var full = seg.slice(); if (run) full.push(run);
          if (full.length !== target.length) return false;
          for (var j = 0; j < full.length; j++) if (full[j] !== target[j]) return false;
        }
      }
      return true;
    }
    function rec(r2) {
      if (blown || found >= limit) return;
      if (++nodes > NODE_BUDGET) { blown = true; return; }
      if (r2 === n) { if (colFeasible(n)) found++; return; }
      for (var i = 0; i < opts[r2].length; i++) {
        grid[r2] = opts[r2][i];
        if (colFeasible(r2 + 1)) rec(r2 + 1);
        if (blown || found >= limit) return;
      }
      grid[r2] = null;
    }
    rec(0);
    return { count: found, inconclusive: blown };
  }

  /* ------------------------------------------------------------- crossword */

  var PLACEHOLDER = /\b\d+\s+letters\s*$/i;

  function checkCrossword(p) {
    var o = res();
    if (!p || !p.grid || !p.entries) { fail(o, "no grid/entries returned"); return o; }
    var size = p.size || p.grid.length, i, j;
    if (!p.entries.length) { fail(o, "no entries placed"); return o; }
    var covered = {};
    for (i = 0; i < p.entries.length; i++) {
      var e = p.entries[i], w = e.word || "";
      if (!w) { fail(o, "entry " + i + " has no word"); continue; }
      for (j = 0; j < w.length; j++) {
        var r = e.r + (e.horiz ? 0 : j), c = e.c + (e.horiz ? j : 0);
        if (r < 0 || c < 0 || r >= size || c >= size) { fail(o, w + " runs off the grid"); break; }
        if (p.grid[r][c] !== w[j]) fail(o, w + " does not match the grid at r" + r + "c" + c + " (grid has " + p.grid[r][c] + ", word has " + w[j] + ")");
        covered[r + "," + c] = 1;
      }
      if (!e.clue) fail(o, w + " has no clue");
      else if (PLACEHOLDER.test(e.clue)) fail(o, w + " has a placeholder clue, not a clue: \u201c" + e.clue + "\u201d");
    }
    // grid letters not covered by any entry = an unsolvable stray
    var stray = 0;
    for (var rr = 0; rr < size; rr++) for (var cc = 0; cc < size; cc++) {
      if (p.grid[rr][cc] && !covered[rr + "," + cc]) stray++;
    }
    if (stray) fail(o, stray + " filled cell(s) belong to no entry");
    var dups = dupIn(p.entries.map(function (e) { return e.word; }));
    if (dups.length) fail(o, "the same word appears twice: " + dups.join(", "));
    // every entry after the first must cross something
    var isolated = [];
    for (i = 0; i < p.entries.length; i++) {
      var e2 = p.entries[i], crosses = 0;
      for (j = 0; j < e2.word.length; j++) {
        var r2 = e2.r + (e2.horiz ? 0 : j), c2 = e2.c + (e2.horiz ? j : 0);
        for (var k = 0; k < p.entries.length; k++) {
          if (k === i) continue;
          var f = p.entries[k];
          if (f.horiz === e2.horiz) continue;
          for (var m = 0; m < f.word.length; m++) {
            var r3 = f.r + (f.horiz ? 0 : m), c3 = f.c + (f.horiz ? m : 0);
            if (r3 === r2 && c3 === c2) crosses++;
          }
        }
      }
      if (!crosses) isolated.push(e2.word);
    }
    if (isolated.length) fail(o, "entries crossing nothing: " + isolated.join(", "));
    if (p.across && p.down && (p.across.length + p.down.length !== p.entries.length)) {
      warn(o, "across+down lists (" + (p.across.length + p.down.length) + ") do not add up to entries (" + p.entries.length + ")");
    }
    return o;
  }

  /* ---------------------------------------------------------------- fill-in */

  function slotsFrom(grid, size) {
    var out = [], r, c, run;
    for (r = 0; r < size; r++) {
      run = [];
      for (c = 0; c <= size; c++) {
        var on = c < size && grid[r][c];
        if (on) run.push([r, c]);
        else { if (run.length > 1) out.push({ cells: run, horiz: true }); run = []; }
      }
    }
    for (c = 0; c < size; c++) {
      run = [];
      for (r = 0; r <= size; r++) {
        var on2 = r < size && grid[r][c];
        if (on2) run.push([r, c]);
        else { if (run.length > 1) out.push({ cells: run, horiz: false }); run = []; }
      }
    }
    return out;
  }

  function checkFillIn(p) {
    var o = res();
    if (!p || !p.grid || !p.bank) { fail(o, "no grid/bank returned"); return o; }
    var size = p.size || p.grid.length;
    if (p.solution === p.grid) fail(o, "solution and puzzle grid are the same object — the answer page cannot differ from the puzzle page");
    if (!p.bank.length) fail(o, "word bank is empty");
    var slots = slotsFrom(p.grid, size);
    if (slots.length !== p.bank.length) fail(o, "grid has " + slots.length + " slots but the bank lists " + p.bank.length + " words");
    // bank must match the letters actually in the grid
    var slotWords = slots.map(function (s) {
      return s.cells.map(function (x) { return p.grid[x[0]][x[1]]; }).join("");
    }).sort();
    var bank = p.bank.slice().sort();
    if (slotWords.join("|") !== bank.join("|")) {
      fail(o, "bank does not match the grid. grid slots: " + slotWords.join(", ") + " / bank: " + bank.join(", "));
    }
    var u = countFillIn(slots, p.bank, size, 2);
    if (u.inconclusive) warn(o, "uniqueness inconclusive (search budget)");
    else if (u.count === 0) fail(o, "the bank cannot be placed in this grid at all");
    else if (u.count > 1) fail(o, "the bank can be placed " + u.count + "+ ways — the puzzle has more than one solution");
    return o;
  }

  function countFillIn(slots, bank, size, limit) {
    var order = slots.slice().sort(function (a, b) { return b.cells.length - a.cells.length; });
    var used = new Array(bank.length).fill(false);
    var board = {};
    var found = 0, nodes = 0, blown = false;
    function rec(i) {
      if (blown || found >= limit) return;
      if (++nodes > NODE_BUDGET) { blown = true; return; }
      if (i === order.length) { found++; return; }
      var slot = order[i];
      for (var w = 0; w < bank.length; w++) {
        if (used[w]) continue;
        var word = bank[w];
        if (word.length !== slot.cells.length) continue;
        var ok = true, wrote = [];
        for (var j = 0; j < slot.cells.length; j++) {
          var k = slot.cells[j][0] + "," + slot.cells[j][1];
          var have = board[k];
          if (have && have !== word[j]) { ok = false; break; }
          if (!have) { board[k] = word[j]; wrote.push(k); }
        }
        if (ok) { used[w] = true; rec(i + 1); used[w] = false; }
        for (var z = 0; z < wrote.length; z++) delete board[wrote[z]];
        if (blown || found >= limit) return;
      }
    }
    rec(0);
    return { count: found, inconclusive: blown };
  }

  /* ------------------------------------------------------------ word search */

  var DIRS8 = [[1,0],[0,1],[1,1],[1,-1],[-1,0],[0,-1],[-1,-1],[-1,1]];

  function findAll(grid, size, word) {
    var hits = [];
    for (var r = 0; r < size; r++) for (var c = 0; c < size; c++) {
      for (var d = 0; d < DIRS8.length; d++) {
        var dr = DIRS8[d][0], dc = DIRS8[d][1], ok = true;
        for (var i = 0; i < word.length; i++) {
          var rr = r + dr * i, cc = c + dc * i;
          if (rr < 0 || cc < 0 || rr >= size || cc >= size || grid[rr][cc] !== word[i]) { ok = false; break; }
        }
        if (ok) hits.push([r, c, dr, dc]);
      }
    }
    return hits;
  }

  function checkWordSearch(p, ctx) {
    var o = res();
    if (!p || !p.grid || !p.words) { fail(o, "no grid/words returned"); return o; }
    var size = p.size || p.grid.length;
    for (var r = 0; r < size; r++) {
      if (!p.grid[r] || p.grid[r].length !== size) { fail(o, "row " + r + " is not " + size + " cells"); continue; }
      for (var c = 0; c < size; c++) {
        var ch = p.grid[r][c];
        if (!ch || !/^[A-Z]$/.test(ch)) fail(o, "cell r" + r + "c" + c + " holds " + JSON.stringify(ch) + ", not a letter");
      }
    }
    if (!p.words.length) fail(o, "no words listed");
    var dups = dupIn(p.words);
    if (dups.length) fail(o, "the word list repeats: " + dups.join(", "));
    for (var i = 0; i < p.words.length; i++) {
      var w = p.words[i], hits = findAll(p.grid, size, w);
      if (!hits.length) fail(o, w + " is listed but is NOT in the grid");
      else if (hits.length > 1) warn(o, w + " can be found in " + hits.length + " places");
    }
    if (p.placements) {
      for (var j = 0; j < p.placements.length; j++) {
        var pl = p.placements[j];
        for (var k = 0; k < pl.word.length; k++) {
          var rr = pl.r + pl.dr * k, cc = pl.c + pl.dc * k;
          if (rr < 0 || cc < 0 || rr >= size || cc >= size) { fail(o, pl.word + " placement runs off the grid"); break; }
          if (p.grid[rr][cc] !== pl.word[k]) { fail(o, pl.word + " placement disagrees with the grid at r" + rr + "c" + cc); break; }
        }
      }
    }
    if (ctx && ctx.requested && p.words.length < ctx.requested) {
      warn(o, "asked for " + ctx.requested + " words, placed " + p.words.length);
    }
    return o;
  }

  /* ----------------------------------------------------------- word ladder */

  function checkWordLadder(p) {
    var o = res();
    if (!p || !p.solution) { fail(o, "no solution returned"); return o; }
    var chain = p.solution;
    if (!Array.isArray(chain) || chain.length < 3) { fail(o, "ladder is shorter than 3 rungs"); return o; }
    if (p.start && chain[0] !== p.start) fail(o, "ladder starts at " + chain[0] + " but the puzzle says " + p.start);
    if (p.end && chain[chain.length - 1] !== p.end) fail(o, "ladder ends at " + chain[chain.length - 1] + " but the puzzle says " + p.end);
    for (var i = 1; i < chain.length; i++) {
      var a = chain[i - 1], b = chain[i], diff = 0;
      if (a.length !== b.length) { fail(o, a + " \u2192 " + b + " changes length"); continue; }
      for (var j = 0; j < a.length; j++) if (a[j] !== b[j]) diff++;
      if (diff !== 1) fail(o, a + " \u2192 " + b + " changes " + diff + " letters, not 1");
    }
    if (dupIn(chain).length) fail(o, "the ladder revisits a word: " + dupIn(chain).join(", "));
    return o;
  }

  /* --------------------------------------------------- scramble / anagram */

  function sortedLetters(s) { return String(s).toUpperCase().split("").sort().join(""); }

  function checkScramble(p) {
    var o = res();
    var items = p && (p.items || p.pairs);
    if (!items || !items.length) { fail(o, "no items returned"); return o; }
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var answer = it.answer || it.word || it.a;
      var shown = it.scrambled || it.clue || it.q || it.s;
      if (!answer || !shown) { fail(o, "item " + i + " is missing its word or its scramble"); continue; }
      if (sortedLetters(answer) !== sortedLetters(shown)) fail(o, shown + " is not an anagram of " + answer);
      if (String(shown).toUpperCase() === String(answer).toUpperCase()) fail(o, answer + " is not actually scrambled");
    }
    var answers = items.map(function (it) { return it.answer || it.word || it.a; });
    if (dupIn(answers).length) warn(o, "repeated answers: " + dupIn(answers).join(", "));
    return o;
  }

  /* -------------------------------------------------------------- cryptogram */

  function checkCryptogram(p) {
    var o = res();
    if (!p || !p.plain) { fail(o, "no plaintext returned"); return o; }
    if (!p.words || !p.words.length) { fail(o, "no cipher text returned"); return o; }
    var fwd = {}, rev = {}, chars = [], i, j;
    for (i = 0; i < p.words.length; i++) {
      for (j = 0; j < p.words[i].length; j++) chars.push(p.words[i][j]);
    }
    var letters = 0;
    for (i = 0; i < chars.length; i++) {
      var y = String(chars[i].c || "").toUpperCase(), x = String(chars[i].plain || "").toUpperCase();
      if (!/^[A-Z]$/.test(x) || !/^[A-Z]$/.test(y)) continue;
      letters++;
      if (fwd[x] && fwd[x] !== y) fail(o, x + " is enciphered as both " + fwd[x] + " and " + y);
      if (rev[y] && rev[y] !== x) fail(o, y + " decodes to both " + rev[y] + " and " + x);
      fwd[x] = y; rev[y] = x;
      if (x === y) fail(o, x + " enciphers to itself");
    }
    // the cipher letters must spell the stated plaintext, in order
    var got = chars.map(function (ch) { return String(ch.plain || "").toUpperCase(); }).join("").replace(/[^A-Z]/g, "");
    var want = String(p.plain).toUpperCase().replace(/[^A-Z]/g, "");
    if (got !== want) fail(o, "cipher letters spell \u201c" + got + "\u201d but the answer is \u201c" + want + "\u201d");
    if (!letters) fail(o, "cipher contains no letters");
    if (p.hint && p.hint.letter && p.hint.cipher) {
      if (fwd[String(p.hint.letter).toUpperCase()] !== String(p.hint.cipher).toUpperCase()) {
        fail(o, "the printed hint (" + p.hint.cipher + " = " + p.hint.letter + ") contradicts the cipher");
      }
    }
    return o;
  }

  /* ------------------------------------------------------------- math drill */

  function checkMath(p) {
    var o = res();
    if (!p || !p.items || !p.items.length) { fail(o, "no items returned"); return o; }
    for (var i = 0; i < p.items.length; i++) {
      var it = p.items[i];
      var q = it.q || it.question || it.text, ans = it.a != null ? it.a : it.answer;
      if (q == null || ans == null) { fail(o, "item " + i + " is missing its question or answer"); continue; }
      var m = String(q).replace(/[=?\s]+$/, "").match(/^(-?\d+)\s*([+\-×x*÷/])\s*(-?\d+)$/);
      if (!m) { warn(o, "cannot parse \u201c" + q + "\u201d to check it"); continue; }
      var A = +m[1], op = m[2], B = +m[3], want;
      if (op === "+") want = A + B;
      else if (op === "-") want = A - B;
      else if (op === "×" || op === "x" || op === "*") want = A * B;
      else want = B ? A / B : NaN;
      if (Number(ans) !== want) fail(o, q + " is answered " + ans + ", should be " + want);
    }
    return o;
  }

  /* -------------------------------------------------------------------- maze */

  function checkMaze(p) {
    var o = res();
    if (!p || !p.cells || !p.path) { fail(o, "no cells/path returned"); return o; }
    var n = p.n || p.cells.length, path = p.path;
    if (!path.length) { fail(o, "path is empty"); return o; }
    var first = path[0], last = path[path.length - 1];
    var fr = Array.isArray(first) ? first[0] : first.r, fc = Array.isArray(first) ? first[1] : first.c;
    var lr = Array.isArray(last) ? last[0] : last.r, lc = Array.isArray(last) ? last[1] : last.c;
    if (fr !== 0 || fc !== 0) warn(o, "path starts at r" + fr + "c" + fc + ", not the top-left");
    if (lr !== n - 1 || lc !== n - 1) warn(o, "path ends at r" + lr + "c" + lc + ", not the bottom-right");
    for (var i = 1; i < path.length; i++) {
      var a = path[i - 1], b = path[i];
      var ar = Array.isArray(a) ? a[0] : a.r, ac = Array.isArray(a) ? a[1] : a.c;
      var br = Array.isArray(b) ? b[0] : b.r, bc = Array.isArray(b) ? b[1] : b.c;
      var dr = br - ar, dc = bc - ac;
      if (Math.abs(dr) + Math.abs(dc) !== 1) { fail(o, "path jumps from r" + ar + "c" + ac + " to r" + br + "c" + bc); continue; }
      var cell = p.cells[ar] && p.cells[ar][ac];
      if (!cell) { fail(o, "path visits a cell outside the maze"); continue; }
      var wall = dr === -1 ? cell.N : dr === 1 ? cell.S : dc === 1 ? cell.E : cell.W;
      if (wall) fail(o, "path walks through a wall between r" + ar + "c" + ac + " and r" + br + "c" + bc);
    }
    return o;
  }

  /* --------------------------------------------------------------- logic grid */

  function checkLogicGrid(p) {
    var o = res();
    if (!p || !p.solution) { fail(o, "no solution returned"); return o; }
    if (!p.clues || !p.clues.length) fail(o, "no clues returned");
    var sol = p.solution;
    var keys = Object.keys(sol || {});
    if (!keys.length && !Array.isArray(sol)) fail(o, "solution is empty");
    if (Array.isArray(sol)) {
      var seen = {};
      for (var i = 0; i < sol.length; i++) {
        var row = sol[i];
        for (var k in row) {
          var kk = k + "=" + row[k];
          if (seen[kk]) fail(o, "two subjects share " + kk + " — the answer key is not a one-to-one match");
          seen[kk] = 1;
        }
      }
    }
    return o;
  }

  /* ------------------------------------------------------------------ trivia */

  function checkTrivia(p) {
    var o = res();
    if (!p || !p.items || !p.items.length) { fail(o, "no items returned"); return o; }
    for (var i = 0; i < p.items.length; i++) {
      var it = p.items[i];
      if (!it.q) fail(o, "item " + i + " has no question");
      if (!it.a) fail(o, "item " + i + " has no answer");
    }
    var qs = p.items.map(function (x) { return x.q; });
    if (dupIn(qs).length) fail(o, "the same question appears twice: " + dupIn(qs).join(" / "));
    return o;
  }

  /* ------------------------------------------------------ dot-to-dot, coloring */

  function checkDotToDot(p) {
    var o = res();
    if (!p || !p.points || !p.points.length) { fail(o, "no points returned"); return o; }
    for (var i = 0; i < p.points.length; i++) {
      var pt = p.points[i];
      var x = Array.isArray(pt) ? pt[0] : pt.x, y = Array.isArray(pt) ? pt[1] : pt.y;
      if (typeof x !== "number" || typeof y !== "number" || !isFinite(x) || !isFinite(y)) fail(o, "point " + i + " is not a finite coordinate");
    }
    if (p.points.length < 5) warn(o, "only " + p.points.length + " points — thin for a dot-to-dot");
    return o;
  }

  function checkColoring(p) {
    var o = res();
    if (!p || !p.cells || !p.cells.length) { fail(o, "no cells returned"); return o; }
    return o;
  }

  function checkAnagramMatch(p) {
    var o = res();
    if (!p || !p.left || !p.right) { fail(o, "no left/right columns returned"); return o; }
    if (p.left.length !== p.right.length) fail(o, "columns are uneven: " + p.left.length + " scrambles, " + p.right.length + " words");
    var usedIdx = {};
    for (var i = 0; i < p.left.length; i++) {
      var L = p.left[i];
      if (typeof L.answerIdx !== "number" || !p.right[L.answerIdx]) { fail(o, "scramble " + L.label + " points at no word"); continue; }
      if (usedIdx[L.answerIdx]) fail(o, "two scrambles both answer to word " + (L.answerIdx + 1));
      usedIdx[L.answerIdx] = 1;
      var R = p.right[L.answerIdx];
      if (sortedLetters(L.text) !== sortedLetters(R.text)) fail(o, L.text + " is not an anagram of its answer " + R.text);
      if (String(L.text).toUpperCase() === String(R.text).toUpperCase()) fail(o, R.text + " is not actually scrambled");
      // a scramble that fits two different words has no single answer
      var alsoFits = [];
      for (var j = 0; j < p.right.length; j++) {
        if (j === L.answerIdx) continue;
        if (sortedLetters(p.right[j].text) === sortedLetters(L.text)) alsoFits.push(p.right[j].text);
      }
      if (alsoFits.length) fail(o, L.text + " matches more than one word: " + R.text + ", " + alsoFits.join(", "));
    }
    return o;
  }

  self.PZ_CHECKS = {
    sudoku: checkSudoku,
    sudokuVariant: checkSudokuVariant,
    kenken: checkKenken,
    kakuro: checkKakuro,
    nonogram: checkNonogram,
    crossword: checkCrossword,
    fillin: checkFillIn,
    wordsearch: checkWordSearch,
    wordladder: checkWordLadder,
    scramble: checkScramble,
    anagram: checkAnagramMatch,
    cryptogram: checkCryptogram,
    math: checkMath,
    maze: checkMaze,
    logicgrid: checkLogicGrid,
    trivia: checkTrivia,
    dottodot: checkDotToDot,
    coloring: checkColoring
  };
})();
