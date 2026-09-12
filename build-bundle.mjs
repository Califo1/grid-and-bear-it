#!/usr/bin/env node
// Regenerates engines.bundle.js from the three ES module sources, following
// the process documented in HANDOFF.md §2: for each module, strip `export`
// keywords, wrap the body in an IIFE, and assign globalThis.PZ_* with the
// collected export names in declaration order. LF line endings throughout
// (repo bytes are disk bytes — never convert). Deterministic: same sources
// in, same bytes out, no timestamps or machine-specific paths embedded.
//
// Usage: node build-bundle.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.dirname(fileURLToPath(import.meta.url));

const MODULES = [
  { file: "puzzle-engine.js", global: "PZ_ENGINE" },
  { file: "puzzle-engine-extra.js", global: "PZ_EXTRA" },
  { file: "kdp-guru.js", global: "PZ_GURU" },
];

function stripExports(src) {
  const names = [];
  const lines = src.split("\n");
  const out = lines.map((line) => {
    const m = line.match(/^export\s+(?:(const|function)\s+)?([A-Za-z_$][A-Za-z0-9_$]*)/);
    if (!m) return line;
    if (m[2]) names.push(m[2]);
    return line.replace(/^export\s+/, "");
  });
  return { body: out.join("\n"), names };
}

const blocks = MODULES.map(({ file, global }) => {
  const src = fs.readFileSync(path.join(REPO, file), "utf8").replace(/\n$/, "");
  const { body, names } = stripExports(src);
  return `/* ===== ${file} -> globalThis.${global} ===== */\n(function(){\n${body}\n\nglobalThis.${global} = { ${names.join(", ")} };\n})();`;
});

const out = "// Auto-generated from the ES modules. Do not edit by hand.\n\n" + blocks.join("\n\n") + "\n";
fs.writeFileSync(path.join(REPO, "engines.bundle.js"), out);
console.log("wrote engines.bundle.js,", out.length, "bytes");
for (const { file, global } of MODULES) console.log(" -", file, "->", global);
