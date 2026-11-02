// The HTML document shell: <head> with SEO tags, header, main content and footer.

import { site, languages } from "../site.js";
import { t } from "../i18n.js";
import { escapeHtml } from "../lib/markdown.js";
import { header, footer } from "./partials.js";

const abs = (url) => (/^https?:/.test(url) ? url : site.baseURL + url);

/**
 * @param {object} o
 * @param {string} o.lang           the page's own content language (drives <html lang> and og:locale
 *                                  only — the nav, site title and feed link are always English; see
 *                                  src/templates/partials.js)
 * @param {object} [o.page]         page object, for article metadata
 * @param {string} o.url            this document's path
 * @param {string} [o.title]        page title (omitted on the home page)
 * @param {string} [o.description]
 * @param {string} [o.image]        OpenGraph image path
 * @param {string} o.content        the <main> HTML
 * @param {object} o.assets         { css, js, appearance } fingerprinted URLs and inline appearance script
 */
export function layout({ lang, page, url, title, description, image, content, assets, jsonLd = [] }) {
  const language = languages.en;
  const fullTitle = title ? `${title} · ${language.title}` : language.title;
  const desc = description || language.description;
  const isArticle = page?.kind === "page" && page.date;

  const og = [
    ["og:url", abs(url)],
    ["og:site_name", language.title],
    ["og:title", title || language.title],
    ["og:description", desc],
    ["og:locale", lang],
    ["og:type", isArticle ? "article" : "website"],
    ...(isArticle
      ? [
          ["article:section", page.section],
          ["article:published_time", page.date],
        ]
      : []),
    ...(image ? [["og:image", abs(image)]] : []),
  ]
    .map(([p, c]) => `<meta property="${p}" content="${escapeHtml(c)}">`)
    .join("\n  ");

  const twitter = [
    ["twitter:card", image ? "summary_large_image" : "summary"],
    ...(image ? [["twitter:image", abs(image)]] : []),
    ["twitter:title", title || language.title],
    ["twitter:description", desc],
  ]
    .map(([n, c]) => `<meta name="${n}" content="${escapeHtml(c)}">`)
    .join("\n  ");

  const ld = jsonLd
    .map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`)
    .join("\n  ");

  return `<!doctype html>
<html lang="${lang}" data-default-appearance="${site.defaultAppearance}" data-auto-appearance="${site.autoSwitchAppearance}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ffffff">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  <meta name="author" content="${site.author.name}">
  <link rel="canonical" href="${abs(url)}">
  <script>${assets.appearance}</script>
  <link rel="stylesheet" href="${assets.css}">
  <script defer src="${assets.js}" data-copy="${t("en", "copy")}" data-copied="${t("en", "copied")}" data-ga="${site.googleAnalytics}" id="site-script"></script>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" href="/index.xml" title="${escapeHtml(language.title)}">
  ${og}
  ${twitter}
  ${ld}
  ${site.author.links.map((l) => `<link href="${l.url}" rel="me">`).join("\n  ")}
</head>
<body>
  <a id="the-top" class="skip-link" href="#main-content">${t("en", "skipToMain")}</a>
  ${header()}
  <main id="main-content">
${content}
  </main>
  <a id="to-top" href="#the-top" aria-label="${t("en", "scrollToTop")}" title="${t("en", "scrollToTop")}" hidden>↑</a>
  ${footer()}
</body>
</html>
`;
}

export function redirectPage(target) {
  const url = abs(target);
  return `<!doctype html>
<html lang="en">
<head>
  <title>${url}</title>
  <link rel="canonical" href="${url}">
  <meta name="robots" content="noindex">
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=${url}">
</head>
</html>
`;
}

export { abs };
