// Inline SVG icons from assets/icons.

import fs from "node:fs";
import path from "node:path";

const ICONS_DIR = path.resolve(import.meta.dirname, "../../assets/icons");
const cache = new Map();

export function icon(name) {
  if (!cache.has(name)) {
    const file = path.join(ICONS_DIR, `${name}.svg`);
    if (!fs.existsSync(file)) throw new Error(`Unknown icon: ${name}`);
    cache.set(name, fs.readFileSync(file, "utf8").trim());
  }
  return `<span class="icon">${cache.get(name)}</span>`;
}
