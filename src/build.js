// Builds the static site into dist/: node src/build.js
//
// The site itself is English-only (nav, home, sections, feeds). Spanish content under content/es
// is still loaded: a Spanish page/section that has an English translation becomes a redirect to it
// (so old /es/... links and search-engine entries land on the English version instead of a dead
// end); Spanish content with no English counterpart — the podcast, one untranslated post — is still
// rendered for real, using the same English nav, and is included in the sitemap and search index so
// it stays reachable and discoverable even though nothing links to it from the menu.

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { marked } from "marked";
import { site, languages, defaultLanguage } from "./site.js";
import { loadContent, CONTENT_LANGS } from "./lib/content.js";
import { renderMarkdown, stripTags } from "./lib/markdown.js";
import { rss, sitemap, robots, searchIndex } from "./lib/feeds.js";
import { layout, redirectPage } from "./templates/base.js";
import { homeContent, listContent, singleContent, notFoundContent } from "./templates/pages.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const written = new Set();

function write(urlPath, contents) {
  const file = path.join(DIST, urlPath.endsWith("/") ? `${urlPath}index.html` : urlPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, contents);
  written.add(urlPath);
}

function copy(src, urlPath) {
  const dest = path.join(DIST, urlPath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

// Writes an asset under a content-hashed name so browsers can cache it forever.
function fingerprint(dir, name, ext, contents) {
  const hash = crypto.createHash("sha256").update(contents).digest("hex").slice(0, 10);
  const urlPath = `/${dir}/${name}.${hash}.${ext}`;
  write(urlPath, contents);
  return urlPath;
}

function buildAssets() {
  const read = (p) => fs.readFileSync(path.join(ROOT, "assets", p), "utf8");
  const js = ["menu.js", "search.js", "code-copy.js", "consent.js"].map((f) => read(`js/${f}`)).join("\n");
  return {
    css: fingerprint("css", "main", "css", read("css/main.css")),
    js: fingerprint("js", "main", "js", js),
    appearance: read("js/appearance.js").trim(),
  };
}

// Maps a content reference ("contact.md", "../cadenas-swift", "../swift-enums/") to a page URL,
// scoped to pages in the same language as `from` (never crosses into a redirect/orphan decision).
function pageResolver(pages, from) {
  return (ref) => {
    const slug = path.basename(ref.replace(/\/$/, "")).replace(/\.md$/, "").toLowerCase();
    if (!slug || slug === "." || slug === "..") return undefined;
    const matches = pages.filter((p) => p.lang === from.lang && p.slug === slug);
    return (matches.find((p) => p.section === from.section) ?? matches[0])?.url;
  };
}

function hasEnglish(page) {
  return page.lang !== "en" && page.translations.some((p) => p.lang === "en");
}

// Where a page's content ultimately lives: itself if it's English or has no English translation,
// or its English translation's URL otherwise. Used for front-matter aliases, so an old link to a
// translated Spanish page redirects straight to English instead of bouncing through two redirects.
function finalUrl(page) {
  return hasEnglish(page) ? page.translations.find((p) => p.lang === "en").url : page.url;
}

function aliasesOf(page) {
  const prefix = CONTENT_LANGS[page.lang].prefix;
  return [page.params.aliases, page.params.alias]
    .flat()
    .filter(Boolean)
    .map((a) => [`${prefix}/${a.replace(/^\/|\/$/g, "")}/`, finalUrl(page)]);
}

function renderPage(page, allPages, sectionsByName) {
  page.summary = page.params.summary ? marked.parseInline(page.params.summary) : "";
  page.rendered = renderMarkdown(page, pageResolver(allPages, page));
  const withoutAnchors = page.rendered.html.replace(/<a class="heading-anchor"[^>]*>#<\/a>/g, "");
  page.plainText = stripTags(withoutAnchors).replace(/\s+/g, " ").trim();
  page.sectionTitle = page.section ? sectionsByName.get(page.section).title : "";
}

function paginate(section) {
  return Math.max(1, Math.ceil(section.children.length / site.pageSize));
}

function buildEnglishSite({ pages, sections }, assets) {
  const allPages = [...pages, ...sections];
  const sectionsByName = new Map(sections.map((s) => [s.section, s]));
  for (const page of allPages) renderPage(page, allPages, sectionsByName);

  const sitemapEntries = [];
  const dated = pages.filter((p) => p.date).sort((a, b) => b.date.localeCompare(a.date));

  write(
    "/",
    layout({
      lang: "en",
      url: "/",
      content: homeContent(),
      assets,
      jsonLd: [{ "@context": "https://schema.org", "@type": "WebSite", name: languages.en.title, url: site.baseURL + "/", inLanguage: "en", description: languages.en.description }],
    })
  );
  sitemapEntries.push({ url: "/", date: dated[0]?.date });

  for (const section of sections) {
    const total = paginate(section);
    for (let n = 1; n <= total; n++) {
      const url = n === 1 ? section.url : `${section.url}page/${n}/`;
      const items = section.children.slice((n - 1) * site.pageSize, n * site.pageSize);
      write(
        url,
        layout({
          lang: "en",
          page: section,
          url,
          title: section.title,
          description: stripTags(section.summary) || undefined,
          content: listContent(section, items, n, total, n === 1 ? section.rendered.html.trim() : ""),
          assets,
        })
      );
    }
    write(`${section.url}page/1/`, redirectPage(section.url));
    sitemapEntries.push({ url: section.url, date: section.children[0]?.date });
    write(`${section.url}index.xml`, rss({ title: section.title, url: section.url, items: section.children }));
  }

  for (const page of pages) {
    const siblings = page.section ? sectionsByName.get(page.section).children : [];
    const image = page.resources.find((r) => /feature/i.test(r.name) && /\.(png|jpe?g|webp|gif)$/i.test(r.name));
    write(
      page.url,
      layout({
        lang: "en",
        page,
        url: page.url,
        title: page.title,
        description: page.params.description ?? stripTags(page.summary),
        image: image?.url,
        content: singleContent(page, page.rendered, siblings),
        assets,
        jsonLd: page.date
          ? [
              {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: page.title,
                description: page.params.description ?? stripTags(page.summary),
                inLanguage: "en",
                url: site.baseURL + page.url,
                author: { "@type": "Person", name: site.author.name },
                datePublished: page.date,
                ...(image ? { image: site.baseURL + image.url } : {}),
              },
            ]
          : [],
      })
    );
    for (const res of page.resources) {
      if (!res.inherited) copy(res.src, res.url);
    }
    sitemapEntries.push({ url: page.url, date: page.date ?? undefined });
  }

  write("/404.html", layout({ lang: "en", url: "/404.html", title: "404", content: notFoundContent("en"), assets }));
  write("/index.xml", rss({ url: "/", items: dated }));

  return { pages, sitemapEntries };
}

// Handles everything under content/es: redirects translated content to its English page, and
// fully renders (under the same English nav) whatever has no English counterpart.
function buildSpanishExtras({ pages, sections }, assets) {
  const allPages = [...pages, ...sections];
  const sectionsByName = new Map(sections.map((s) => [s.section, s]));
  for (const page of allPages) {
    if (!hasEnglish(page)) renderPage(page, allPages, sectionsByName);
  }

  // Bundle files (images, zips) are copied regardless of whether the page itself redirects: an
  // English page may reach into this exact bundle for an inherited image or attachment.
  for (const page of pages) {
    for (const res of page.resources) {
      if (!res.inherited) copy(res.src, res.url);
    }
  }

  const sitemapEntries = [];
  const orphanPages = [];

  for (const section of sections) {
    const total = paginate(section);
    if (hasEnglish(section)) {
      const target = finalUrl(section);
      write(section.url, redirectPage(target));
      for (let n = 1; n <= total; n++) {
        write(`${section.url}page/${n}/`, redirectPage(target));
      }
      continue;
    }
    for (let n = 1; n <= total; n++) {
      const url = n === 1 ? section.url : `${section.url}page/${n}/`;
      const items = section.children.slice((n - 1) * site.pageSize, n * site.pageSize);
      write(
        url,
        layout({
          lang: section.lang,
          page: section,
          url,
          title: section.title,
          description: stripTags(section.summary) || undefined,
          content: listContent(section, items, n, total, n === 1 ? section.rendered.html.trim() : ""),
          assets,
        })
      );
    }
    write(`${section.url}page/1/`, redirectPage(section.url));
    sitemapEntries.push({ url: section.url, date: section.children[0]?.date });
  }

  for (const page of pages) {
    if (hasEnglish(page)) {
      write(page.url, redirectPage(finalUrl(page)));
      continue;
    }
    const siblings = page.section ? sectionsByName.get(page.section).children : [];
    const image = page.resources.find((r) => /feature/i.test(r.name) && /\.(png|jpe?g|webp|gif)$/i.test(r.name));
    write(
      page.url,
      layout({
        lang: page.lang,
        page,
        url: page.url,
        title: page.title,
        description: page.params.description ?? stripTags(page.summary),
        image: image?.url,
        content: singleContent(page, page.rendered, siblings),
        assets,
        jsonLd: page.date
          ? [
              {
                "@context": "https://schema.org",
                "@type": "Article",
                headline: page.title,
                description: page.params.description ?? stripTags(page.summary),
                inLanguage: page.lang,
                url: site.baseURL + page.url,
                author: { "@type": "Person", name: site.author.name },
                datePublished: page.date,
                ...(image ? { image: site.baseURL + image.url } : {}),
              },
            ]
          : [],
      })
    );
    sitemapEntries.push({ url: page.url, date: page.date ?? undefined });
    orphanPages.push(page);
  }

  return { pages, orphanPages, sitemapEntries };
}

function main() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.cpSync(path.join(ROOT, "static"), DIST, { recursive: true });
  copy(path.join(ROOT, "assets/img/memoji-2-no-bg.png"), "/img/memoji-2-no-bg.png");

  const assets = buildAssets();
  const content = loadContent(ROOT);
  const en = buildEnglishSite(content.en, assets);
  const es = buildSpanishExtras(content.es, assets);

  // Redirects: every page's own front-matter aliases, resolved to its final (English, if
  // translated) URL, plus /en/ for the default language. Never overwrite a real page.
  const redirects = [
    [`/${defaultLanguage}/`, "/"],
    ["/es/", "/"],
    ...[...en.pages, ...es.pages].flatMap((p) => aliasesOf(p)),
  ];
  for (const [from, to] of redirects) {
    if (!written.has(from)) write(from, redirectPage(to));
  }

  write("/sitemap.xml", sitemap([...en.sitemapEntries, ...es.sitemapEntries]));
  write("/robots.txt", robots());
  write("/index.json", searchIndex([...en.pages, ...es.orphanPages]));
  write(
    "/site.webmanifest",
    JSON.stringify(
      {
        name: languages.en.title,
        short_name: site.author.name,
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
      },
      null,
      2
    )
  );
  fs.writeFileSync(path.join(DIST, ".nojekyll"), "");

  const htmlCount = [...written].filter((u) => u.endsWith("/") || u.endsWith(".html")).length;
  console.log(`Built ${htmlCount} HTML pages into dist/`);
}

main();
