// RSS feeds, sitemaps, robots.txt and the search index.

import { site, languages } from "../site.js";
import { escapeHtml, stripTags } from "./markdown.js";

const abs = (url) => site.baseURL + url;

// RFC 822 date that keeps the front matter's offset, e.g. "Tue, 08 Oct 2024 08:00:00 +0200".
function rfc822(iso) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [, y, m, d, time = "00:00:00", offset = "Z"] = iso.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}:\d{2}:\d{2})(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})?/);
  const weekday = days[new Date(Date.UTC(+y, m - 1, +d)).getUTCDay()];
  const tz = offset === "Z" ? "+0000" : offset.replace(":", "");
  return `${weekday}, ${d} ${months[m - 1]} ${y} ${time} ${tz}`;
}

export function rss({ title, url, items }) {
  const language = languages.en;
  const channelTitle = title ? `${title} on ${language.title}` : language.title;
  const entries = items
    .filter((p) => p.date)
    .map(
      (p) => `<item>
  <title>${escapeHtml(p.title)}</title>
  <link>${abs(p.url)}</link>
  <pubDate>${rfc822(p.date)}</pubDate>
  <guid>${abs(p.url)}</guid>
  <description>${escapeHtml(stripTags(p.summary ?? ""))}</description>
</item>`
    )
    .join("\n");
  const latest = items.find((p) => p.date)?.date;
  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeHtml(channelTitle)}</title>
<link>${abs(url)}</link>
<description>Recent content ${title ? `in ${escapeHtml(title)} ` : ""}on ${escapeHtml(language.title)}</description>
<language>en</language>
<copyright>${escapeHtml(language.copyright)}</copyright>
${latest ? `<lastBuildDate>${rfc822(latest)}</lastBuildDate>` : ""}
<atom:link href="${abs(url)}index.xml" rel="self" type="application/rss+xml"/>
${entries}
</channel>
</rss>
`;
}

// One unified sitemap: the English site plus the handful of Spanish-only pages that have no
// English translation to redirect to (see build.js). Pages that redirect are deliberately excluded.
export function sitemap(entries) {
  const urls = entries.map((e) => `<url><loc>${abs(e.url)}</loc>${e.date ? `<lastmod>${e.date}</lastmod>` : ""}</url>`).join("\n");
  return `<?xml version="1.0" encoding="utf-8" standalone="yes"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export function robots() {
  return `User-agent: *\nSitemap: ${abs("/sitemap.xml")}\n`;
}

export function searchIndex(pages) {
  return JSON.stringify(
    pages.map((p) => ({
      title: p.title,
      section: p.sectionTitle,
      summary: stripTags(p.summary ?? ""),
      content: p.plainText,
      permalink: p.params.externalUrl ?? p.url,
      date: p.date,
    }))
  );
}
