// Verifies dist/: every page live on gh-pages still exists, and every internal link resolves.
// Usage: npm run build && npm run check

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DIST = path.resolve(import.meta.dirname, "../dist");
const SITE = "https://oscarmoreno.com";
// Live URLs dropped on purpose, now that the site is English-only in its navigation (see build.js):
// empty tag/category listings, and the Spanish-specific infrastructure (its own 404/sitemap/search
// index/feeds) that no longer exists now that translated Spanish pages redirect to English and the
// rest is folded into the single English-shell sitemap and search index.
const DROPPED = /^(es\/)?(tags|categories)\/|^es\/(404\.html|index\.(xml|json)|sitemap\.xml|(blog|apps|podcast)\/index\.xml)$|^en\/sitemap\.xml$/;

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`✗ ${msg}`);
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : [full];
  });
}

function resolves(urlPath) {
  const clean = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  const file = path.join(DIST, clean);
  if (clean.endsWith("/")) return fs.existsSync(path.join(file, "index.html"));
  return fs.existsSync(file) || fs.existsSync(path.join(file, "index.html"));
}

// 1. Live pages.
let live = [];
try {
  live = execFileSync("git", ["ls-tree", "-r", "--name-only", "origin/gh-pages"], { encoding: "utf8" })
    .split("\n")
    .filter((f) => f.endsWith(".html") || f.endsWith(".xml") || f.endsWith(".json"))
    .filter((f) => !DROPPED.test(f));
} catch {
  console.warn("! origin/gh-pages not available, skipping the live URL comparison");
}
for (const f of live) {
  if (!fs.existsSync(path.join(DIST, f))) fail(`missing live URL: /${f}`);
}

// 2. Internal links and assets.
const files = walk(DIST).filter((f) => f.endsWith(".html"));
for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const page = "/" + path.relative(DIST, file).replace(/index\.html$/, "");
  if (/example\.org|localhost:1313/.test(html)) fail(`${page}: references example.org or localhost`);
  for (const [, url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    let target = url.replace(/&amp;/g, "&");
    if (target.startsWith(SITE)) target = target.slice(SITE.length) || "/";
    if (/^([a-z]+:|\/\/|#)/i.test(target)) continue;
    const absolute = target.startsWith("/") ? target : new URL(target, `http://x${page}`).pathname;
    if (!resolves(absolute)) fail(`${page}: broken link ${url}`);
  }
}

console.log(`Checked ${live.length} live URLs and ${files.length} HTML files: ${failures ? `${failures} problem(s)` : "all good"}`);
process.exit(failures ? 1 : 0);
