// Loads content/<lang>/ into page objects: single Markdown files and page bundles (a directory
// with its own index.md plus images/attachments) each become one page with a derived URL.

import fs from "node:fs";
import path from "node:path";
import { parse as parseToml } from "smol-toml";

// Which content/<lang> directories to read and the URL prefix each gets. This is independent of
// site.js's `languages` (the site's navigation, which is English-only) — Spanish content still
// lives under content/es and keeps its /es/ URLs; see build.js for what happens to those URLs.
const CONTENT_LANGS = { en: { prefix: "" }, es: { prefix: "/es" } };

const FRONT_MATTER = /^\+\+\+\r?\n([\s\S]*?)\r?\n\+\+\+\r?\n?/;

function readPage(file) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(FRONT_MATTER);
  if (!match) return { params: {}, body: raw };
  return { params: parseToml(match[1]), body: raw.slice(match[0].length) };
}

// A section without its own _index.md is titled after its folder name, pluralized:
// "apps" -> "Apps", "legal" -> "Legals".
function sectionTitle(name) {
  const title = name.charAt(0).toUpperCase() + name.slice(1);
  return title.endsWith("s") ? title : `${title}s`;
}

function isoDate(value) {
  if (!value) return null;
  // smol-toml keeps the original offset in toISOString(), so the calendar day matches what the author wrote.
  return value.toISOString();
}

function makePage({ lang, section, slug, kind, file, bundleDir, contentDir }) {
  const { params, body } = file ? readPage(file) : { params: {}, body: "" };
  const prefix = CONTENT_LANGS[lang].prefix;
  const parts = [section, slug].filter(Boolean).map((p) => p.toLowerCase());
  const url = `${prefix}/${parts.length ? parts.join("/") + "/" : ""}`;
  const resources = bundleDir
    ? fs
        .readdirSync(bundleDir)
        .filter((name) => !name.endsWith(".md") && !name.startsWith("."))
        .map((name) => ({ name, src: path.join(bundleDir, name), url: url + name }))
    : [];
  const date = isoDate(params.date);
  return {
    lang,
    kind,
    section,
    slug: slug ? slug.toLowerCase() : "",
    file,
    contentPath: file ? path.relative(contentDir, file) : null,
    url,
    title: params.title ?? (kind === "section" ? sectionTitle(section) : ""),
    date,
    params,
    body,
    resources,
    translations: [],
    children: [],
  };
}

function loadLanguage(lang, root) {
  const contentDir = path.join(root, "content", lang);
  const pages = [];
  const sections = new Map();

  for (const entry of fs.readdirSync(contentDir, { withFileTypes: true })) {
    const full = path.join(contentDir, entry.name);
    if (entry.isFile() && entry.name.endsWith(".md")) {
      if (entry.name === "_index.md") continue;
      pages.push(makePage({ lang, section: "", slug: entry.name.replace(/\.md$/, ""), kind: "page", file: full, contentDir }));
      continue;
    }
    if (!entry.isDirectory()) continue;

    const section = entry.name;
    const indexFile = path.join(full, "_index.md");
    const file = fs.existsSync(indexFile) ? indexFile : null;
    const sectionPage = makePage({ lang, section, slug: "", kind: "section", file, contentDir });
    sections.set(section, sectionPage);

    for (const child of fs.readdirSync(full, { withFileTypes: true })) {
      const childPath = path.join(full, child.name);
      if (child.isFile() && child.name.endsWith(".md") && child.name !== "_index.md") {
        pages.push(makePage({ lang, section, slug: child.name.replace(/\.md$/, ""), kind: "page", file: childPath, contentDir }));
      } else if (child.isDirectory() && fs.existsSync(path.join(childPath, "index.md"))) {
        pages.push(
          makePage({ lang, section, slug: child.name, kind: "page", file: path.join(childPath, "index.md"), bundleDir: childPath, contentDir })
        );
      }
    }
  }

  const published = pages.filter((p) => !p.params.draft);
  for (const page of published) {
    if (page.section) sections.get(page.section).children.push(page);
  }
  for (const section of sections.values()) {
    section.children.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  }
  return { pages: published, sections: [...sections.values()] };
}

// Pairs pages across languages by translationKey (or by identical content path), and lets a
// bundle without its own images or attachments use the files of its translation.
function linkTranslations(all) {
  const groups = new Map();
  for (const page of all) {
    const key = page.params.translationKey ?? `${page.kind}:${page.section}/${page.slug}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(page);
  }
  for (const group of groups.values()) {
    for (const page of group) {
      page.translations = group.filter((p) => p !== page);
      for (const other of page.translations) {
        for (const res of other.resources) {
          if (!page.resources.some((r) => r.name.toLowerCase() === res.name.toLowerCase())) {
            page.resources.push({ ...res, inherited: true });
          }
        }
      }
    }
  }
}

export function loadContent(root) {
  const site = {};
  for (const lang of Object.keys(CONTENT_LANGS)) {
    site[lang] = loadLanguage(lang, root);
  }
  linkTranslations(Object.values(site).flatMap((s) => [...s.pages, ...s.sections]));
  return site;
}

export { CONTENT_LANGS };

export function findResource(page, name) {
  const wanted = decodeURIComponent(name).toLowerCase();
  return page.resources.find((r) => r.name.toLowerCase() === wanted);
}

export function featureImage(page) {
  const images = page.resources.filter((r) => /\.(png|jpe?g|webp|gif|svg)$/i.test(r.name));
  return images.find((r) => /feature/i.test(r.name)) ?? images.find((r) => /thumb/i.test(r.name)) ?? null;
}
