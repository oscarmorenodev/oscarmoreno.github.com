// Page templates: home (profile), section list, single article and 404.

import { site, languages } from "../site.js";
import { t } from "../i18n.js";
import { escapeHtml } from "../lib/markdown.js";
import { featureImage } from "../lib/content.js";
import { articleMeta, articlePagination, authorBox, authorLinks, listPagination, toc } from "./partials.js";

export function homeContent() {
  return `<article class="profile">
  <img class="avatar" src="${site.author.image}" alt="${site.author.name}" width="144" height="156" decoding="async">
  <h1>${site.author.name}</h1>
  <h2>${escapeHtml(languages.en.headline)}</h2>
  ${authorLinks()}
</article>`;
}

function articleCard(page) {
  const image = featureImage(page);
  const external = page.params.externalUrl;
  const href = external ?? page.url;
  const thumb = image
    ? `<a class="card-thumb" href="${href}" aria-label="${escapeHtml(page.title)}"><img src="${image.url}" alt="" width="160" height="160" loading="lazy" decoding="async"></a>`
    : "";
  const title = external
    ? `<a href="${external}" target="_blank" rel="external">${escapeHtml(page.title)}</a><span class="external" title="${t(
        page.lang,
        "externalLink"
      )}">↗</span>`
    : `<a href="${page.url}">${escapeHtml(page.title)}</a>`;
  const summary = page.summary ? `<div class="card-summary">${page.summary}</div>` : "";
  return `<article class="card">${thumb}<div><h3>${title}</h3>${articleMeta(page)}${summary}</div></article>`;
}

export function listContent(section, pageItems, pageNumber, totalPages, bodyHtml) {
  const groups = [];
  for (const item of pageItems) {
    const year = item.date?.slice(0, 4) ?? "";
    if (groups.at(-1)?.year !== year) groups.push({ year, items: [] });
    groups.at(-1).items.push(item);
  }
  const list = groups.length
    ? groups
        .map((g) => `<h2 class="year">${g.year}</h2><hr class="year-rule">\n${g.items.map(articleCard).join("\n")}`)
        .join("\n")
    : `<p class="empty">${t(section.lang, "noArticles")}</p>`;
  const urlFor = (n) => (n === 1 ? section.url : `${section.url}page/${n}/`);
  return `<header><h1>${escapeHtml(section.title)}</h1></header>
${bodyHtml ? `<section class="prose section-intro">${bodyHtml}</section>` : ""}
<section class="article-list">
${list}
</section>
${listPagination(section.lang, pageNumber, totalPages, urlFor)}`;
}

export function singleContent(page, rendered, siblings) {
  const image = featureImage(page);
  const showToc = (page.params.showTableOfContents ?? true) && rendered.toc.length > 0;
  const showAuthor = page.params.showAuthor ?? true;
  const showPagination = page.params.showPagination ?? true;
  return `<article>
  <header class="article-header">
    <h1>${escapeHtml(page.title)}</h1>
    ${articleMeta(page)}
    ${image ? `<img class="feature" src="${image.url}" alt="${escapeHtml(page.params.featureAlt ?? "")}" decoding="async">` : ""}
  </header>
  <section class="article-body${showToc ? " has-toc" : ""}">
    ${showToc ? toc(page.lang, rendered.toc) : ""}
    <div class="prose">
${rendered.html}
    </div>
  </section>
  <footer class="article-footer">
    ${showAuthor ? authorBox(page.lang) : ""}
    ${showPagination ? articlePagination(page, siblings) : ""}
  </footer>
</article>`;
}

export function notFoundContent(lang) {
  return `<h1 class="error-title">${t(lang, "notFoundTitle")}</h1>
<p class="error-code">${t(lang, "notFoundError")}</p>
<div class="prose"><p>${t(lang, "notFoundDescription")}</p></div>`;
}
