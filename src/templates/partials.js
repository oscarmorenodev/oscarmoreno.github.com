// Header, footer and other pieces shared by the page templates.

import { site, languages } from "../site.js";
import { t, formatDate } from "../i18n.js";
import { icon } from "../lib/icons.js";
import { escapeHtml } from "../lib/markdown.js";

export function authorLinks() {
  return `<div class="author-links">${site.author.links
    .map(
      (l) =>
        `<a href="${l.url}" target="_blank" aria-label="${l.label}" rel="me noopener noreferrer">${icon(l.icon)}</a>`
    )
    .join("")}</div>`;
}

// The nav chrome is always English: it's the one site menu, even on the handful of pages whose
// own content is in Spanish (see build.js for which pages those are and why).
const NAV_LANG = "en";

export function header() {
  const language = languages[NAV_LANG];
  const items = language.menu
    .map((m) => `<li><a href="${m.url}" title="${escapeHtml(m.name)}"><span>${escapeHtml(m.name)}</span></a></li>`)
    .join("");
  return `<header class="site-header">
  <nav>
    <a class="site-title" rel="me" href="${language.prefix}/">${escapeHtml(language.title)}</a>
    <button type="button" class="menu-button" aria-label="${t(NAV_LANG, "menu")}" aria-expanded="false" aria-controls="main-menu">${icon("bars")}</button>
    <ul id="main-menu" class="main-menu">
      <li class="menu-close"><button type="button" aria-label="${t(NAV_LANG, "searchClose")}">${icon("xmark")}</button></li>
      ${items}
      <li><button type="button" class="search-button" title="${t(NAV_LANG, "searchOpen")}" aria-label="${t(NAV_LANG, "searchOpen")}">${icon("search")}</button></li>
    </ul>
  </nav>
</header>`;
}

export function footer() {
  const language = languages[NAV_LANG];
  return `<footer class="site-footer">
  <p class="copyright">${escapeHtml(language.copyright)}</p>
  <button type="button" class="appearance-switcher" aria-label="appearance switcher">
    <span class="when-light" title="${t(NAV_LANG, "darkAppearance")}">${icon("moon")}</span>
    <span class="when-dark" title="${t(NAV_LANG, "lightAppearance")}">${icon("sun")}</span>
  </button>
</footer>
<div id="cookie-notice" hidden>
  <span>${t(NAV_LANG, "cookieText")}</span>
  <a href="${language.privacyPage}">${t(NAV_LANG, "cookieMore")}</a>
  <button type="button" id="cookie-notice-deny">${t(NAV_LANG, "cookieDeny")}</button>
  <button type="button" id="cookie-notice-accept">${t(NAV_LANG, "cookieApprove")}</button>
</div>
<div id="search-wrapper" hidden data-index="/index.json">
  <div id="search-modal" role="dialog" aria-modal="true">
    <header>
      <form role="search">
        ${icon("search")}
        <input type="search" id="search-query" placeholder="${t(NAV_LANG, "searchPlaceholder")}" aria-label="${t(NAV_LANG, "searchPlaceholder")}" autocomplete="off">
      </form>
      <button type="button" id="close-search-button" title="${t(NAV_LANG, "searchClose")}">${icon("xmark")}</button>
    </header>
    <ul id="search-results" data-empty="${t(NAV_LANG, "noResults")}"></ul>
  </div>
</div>`;
}

export function articleMeta(page) {
  if (!page.date || page.params.showDate === false) return "";
  return `<div class="article-meta"><time datetime="${page.date}">${formatDate(page.date, page.lang)}</time></div>`;
}

export function toc(lang, entries) {
  if (!entries.length) return "";
  const min = Math.min(...entries.map((e) => e.level));
  const items = entries
    .map((e) => `<li class="toc-l${e.level - min}"><a href="#${e.id}">${escapeHtml(e.text)}</a></li>`)
    .join("");
  return `<aside class="toc">
  <details open>
    <summary>${t(lang, "tableOfContents")}</summary>
    <nav id="TableOfContents"><ul>${items}</ul></nav>
  </details>
</aside>`;
}

export function authorBox(lang) {
  return `<div class="author-box">
  <img src="${site.author.image}" alt="${site.author.name}" width="96" height="104" loading="lazy" decoding="async">
  <div>
    <div class="author-label">${t(lang, "author")}</div>
    <div class="author-name">${site.author.name}</div>
    <div class="author-bio">${escapeHtml(t(lang, "bio"))}</div>
    ${authorLinks()}
  </div>
</div>`;
}

export function articlePagination(page, siblings) {
  const i = siblings.indexOf(page);
  // Siblings are sorted newest first: older article on the left, newer on the right.
  const older = siblings[i + 1];
  const newer = siblings[i - 1];
  if (i === -1 || (!older && !newer)) return "";
  const link = (p, cls, title) => (p ? `<a class="${cls}" href="${p.url}"><span class="title">${title}</span>${articleMeta(p)}</a>` : "<span></span>");
  return `<nav class="article-pagination">${link(older, "prev", `← ${escapeHtml(older?.title ?? "")}`)}${link(
    newer,
    "next",
    `${escapeHtml(newer?.title ?? "")} →`
  )}</nav>`;
}

export function listPagination(lang, current, total, urlFor) {
  if (total <= 1) return "";
  const links = [];
  if (current > 1) links.push(`<a href="${urlFor(current - 1)}" aria-label="${t(lang, "prevPage")}">←</a>`);
  for (let n = 1; n <= total; n++) {
    links.push(n === current ? `<span aria-current="page">${n}</span>` : `<a href="${urlFor(n)}">${n}</a>`);
  }
  if (current < total) links.push(`<a href="${urlFor(current + 1)}" aria-label="${t(lang, "nextPage")}">→</a>`);
  return `<nav class="pagination">${links.join("")}</nav>`;
}
