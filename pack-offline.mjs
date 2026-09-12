#!/usr/bin/env node
// Packs the app into two plain, self-contained HTML files: the offline
// desktop app ("Grid and Bear It Studio (offline app).html") and the GitHub
// Pages copy (docs/index.html). Both are byte-identical — same app, two
// hosting locations.
//
// Studio decision SC20: the previous packer wrote a UUID-keyed, gzip+base64
// resource manifest (<script type="__bundler/manifest">) plus a runtime
// unpacker that decompressed it on load. That tool no longer exists in this
// repo (GBI S33) and this packer does not attempt to reproduce or repair its
// format. Instead every external resource is inlined plainly:
//   - support.js and engines.bundle.js: their literal source text in a
//     <script> tag (no src attribute).
//   - React and ReactDOM (UMD, production, pinned to the versions
//     support.js's own loadReactUmd() expects): literal source text in a
//     <script> tag, placed before support.js's, so support.js finds
//     window.React / window.ReactDOM already defined and skips its own
//     network fetch entirely.
//   - The app's Google Fonts (Bodoni Moda, Archivo, Baloo 2, Nunito, Bree
//     Serif, IBM Plex Mono): a plain @font-face CSS block per family/weight,
//     restricted to the Latin subset (this app is English-only UI), each
//     with an ordinary `data:font/woff2;base64,...` src. No manifest, no
//     compression, no UUIDs.
// There is no runtime unpacking step: the output is a complete document the
// instant it's parsed — no loading spinner, no thumbnail swap.
//
// Network is used only to populate ./vendor the first time (or after it's
// deleted): React, ReactDOM, and the seven Latin-subset woff2 files the
// app's own <link> tag requests. Once ./vendor exists, packing reads only
// local files and is fully offline and deterministic — same tree in, same
// bytes out, every time. No timestamps or machine paths are embedded.
//
// Usage: node pack-offline.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.dirname(fileURLToPath(import.meta.url));
const VENDOR = path.join(REPO, "vendor");
const SOURCE_DC = path.join(REPO, "Grid & Bear It Studio.dc.html");
const OUT_OFFLINE = path.join(REPO, "Grid and Bear It Studio (offline app).html");
const OUT_DOCS = path.join(REPO, "docs", "index.html");

// Same versions support.js's own loadReactUmd() (src/cdn.ts) pins.
const REACT_URL = "https://unpkg.com/react@18.3.1/umd/react.production.min.js";
const REACT_DOM_URL = "https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js";
const FETCH_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

async function fetchText(url, headers) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  return res.text();
}

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch ${url} -> HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// Extracts each @font-face block's fields without assuming field order,
// so re-assembly is exact aside from the swapped src url.
function parseFontFaceBlocks(css) {
  const blocks = [];
  const re = /@font-face\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const body = m[1];
    const field = (name) => {
      const fm = body.match(new RegExp(name + ":\\s*([^;]+);"));
      return fm ? fm[1].trim() : null;
    };
    const srcMatch = body.match(/src:\s*url\(([^)]+)\)\s*format\('([^']+)'\)/);
    blocks.push({
      family: field("font-family"),
      style: field("font-style"),
      weight: field("font-weight"),
      stretch: field("font-stretch"),
      display: field("font-display"),
      unicodeRange: field("unicode-range"),
      srcUrl: srcMatch ? srcMatch[1] : null,
      srcFormat: srcMatch ? srcMatch[2] : null,
    });
  }
  return blocks;
}

async function buildFontsCss(googleFontsHref) {
  const css = await fetchText(googleFontsHref, { "User-Agent": FETCH_UA });
  const blocks = parseFontFaceBlocks(css).filter(
    (b) => b.unicodeRange && b.unicodeRange.startsWith("U+0000-00FF")
  );
  if (!blocks.length) throw new Error("no Latin-subset @font-face blocks found in Google Fonts response");
  const woff2Cache = new Map();
  const out = [];
  for (const b of blocks) {
    if (!woff2Cache.has(b.srcUrl)) {
      const bytes = await fetchBuffer(b.srcUrl);
      woff2Cache.set(b.srcUrl, bytes.toString("base64"));
    }
    const dataUri = `data:font/${b.srcFormat === "woff2" ? "woff2" : "woff"};base64,${woff2Cache.get(b.srcUrl)}`;
    out.push(
      `@font-face {\n` +
        `  font-family: ${b.family};\n` +
        `  font-style: ${b.style};\n` +
        `  font-weight: ${b.weight};\n` +
        (b.stretch ? `  font-stretch: ${b.stretch};\n` : "") +
        `  font-display: ${b.display};\n` +
        `  src: url(${dataUri}) format('${b.srcFormat}');\n` +
        `  unicode-range: ${b.unicodeRange};\n` +
        `}`
    );
  }
  return out.join("\n");
}

async function ensureVendor(googleFontsHref) {
  fs.mkdirSync(VENDOR, { recursive: true });
  const reactPath = path.join(VENDOR, "react.production.min.js");
  const reactDomPath = path.join(VENDOR, "react-dom.production.min.js");
  const fontsPath = path.join(VENDOR, "fonts.inline.css");
  if (!fs.existsSync(reactPath)) fs.writeFileSync(reactPath, await fetchText(REACT_URL));
  if (!fs.existsSync(reactDomPath)) fs.writeFileSync(reactDomPath, await fetchText(REACT_DOM_URL));
  if (!fs.existsSync(fontsPath)) fs.writeFileSync(fontsPath, await buildFontsCss(googleFontsHref));
  return {
    react: fs.readFileSync(reactPath, "utf8"),
    reactDom: fs.readFileSync(reactDomPath, "utf8"),
    fontsCss: fs.readFileSync(fontsPath, "utf8"),
  };
}

// Replaces `find` with `replace` in `src`, requiring exactly one match —
// fails loudly instead of silently doing nothing if the source shape drifts.
// Uses a function replacer so `$&`, `$1`, etc. inside `replace` (inevitable
// once it's a few hundred KB of arbitrary third-party JS) are inserted
// literally instead of being interpreted as String.replace's special
// substitution patterns.
function replaceOnce(src, find, replace, label) {
  const count = src.split(find).length - 1;
  if (count !== 1) throw new Error(`expected exactly one "${label}" in source, found ${count}`);
  return src.replace(find, () => replace);
}

async function main() {
  const dc = fs.readFileSync(SOURCE_DC, "utf8");
  const supportJs = fs.readFileSync(path.join(REPO, "support.js"), "utf8");
  const engineBundle = fs.readFileSync(path.join(REPO, "engines.bundle.js"), "utf8");

  const fontLinkMatch = dc.match(/<link href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)" rel="stylesheet" \/>/);
  if (!fontLinkMatch) throw new Error("could not find the Google Fonts <link> in the DC source");
  const googleFontsHref = fontLinkMatch[0].match(/href="([^"]+)"/)[1].replace(/&amp;/g, "&");

  const vendor = await ensureVendor(googleFontsHref);

  let out = dc;
  // Both of these lines live inside <helmet>, whose compiler (support.js's
  // compile()) rewrites camelCase identifiers into its own `sc-camel-x-y`
  // encoding as part of round-tripping JSX-style attribute names through raw
  // HTML text — safe for markup, but it corrupts real code (e.g. a variable
  // named `rE` becomes `sc-camel-r-e`) if applied to a <script>'s text
  // content. <helmet> only ever held a `src=` reference before (a plain
  // URL, no identifiers to mangle), so inline JS/CSS payloads must live
  // outside it, in the real document <head>, alongside support.js itself.
  out = replaceOnce(
    out,
    '<link rel="preconnect" href="https://fonts.googleapis.com" />\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />\n' + fontLinkMatch[0] + "\n",
    "",
    "Google Fonts <link> block (removed from <helmet>)"
  );
  out = replaceOnce(
    out,
    '<script src="engines.bundle.js"></script>\n',
    "",
    "engines.bundle.js <script src> (removed from <helmet>)"
  );
  out = replaceOnce(
    out,
    '<script src="./support.js"></script>',
    // window.__resources signals to support.js that this is a packed build:
    // without it, boot() re-fetches location.href on load to re-derive the
    // <x-dc> template from "live" source text (support.js:158) — meaningless
    // here since the template is already inline, and actively wrong when
    // served from a file:// URL or once the file has moved. This is the same
    // flag the old manifest-based packer set (populated with CDN blob URLs);
    // this packer doesn't need any entries in it, just its presence.
    `<title>Grid &amp; Bear It Studio</title>\n` +
      `<style>\n${vendor.fontsCss}\n</style>\n` +
      `<script>\n${engineBundle}\n</script>\n` +
      `<script>window.__resources = {};</script>\n` +
      `<script>\n${vendor.react}\n</script>\n` +
      `<script>\n${vendor.reactDom}\n</script>\n` +
      `<script>\n${supportJs}\n</script>`,
    "support.js <script src>"
  );

  // LF only — repo bytes are disk bytes.
  out = out.replace(/\r\n/g, "\n");

  fs.mkdirSync(path.dirname(OUT_DOCS), { recursive: true });
  fs.writeFileSync(OUT_OFFLINE, out);
  fs.writeFileSync(OUT_DOCS, out);
  console.log("wrote", OUT_OFFLINE, `(${out.length} chars)`);
  console.log("wrote", OUT_DOCS, `(${out.length} chars)`);
}

main().catch((err) => {
  console.error("pack-offline failed:", err.message || err);
  process.exit(1);
});
