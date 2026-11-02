// Markdown to HTML: content shortcodes (alert, icon, resources, relref), heading anchors,
// build-time syntax highlighting, and link/image resolution against page bundles.

import { Marked } from "marked";
import { markedSmartypants } from "marked-smartypants";
import { createHighlighter } from "shiki";
import { findResource } from "./content.js";
import { icon } from "./icons.js";
import { t } from "../i18n.js";

// An Xcode-dark-like syntax theme for code blocks.
const xcodeDark = {
  name: "xcode-dark",
  type: "dark",
  colors: { "editor.background": "#1f1f24", "editor.foreground": "#ffffff" },
  tokenColors: [
    { scope: ["comment", "punctuation.definition.comment"], settings: { foreground: "#6c7986" } },
    { scope: ["meta.preprocessor", "keyword.other.directive", "storage.modifier.attribute"], settings: { foreground: "#fd8f3f" } },
    {
      scope: ["keyword", "storage.type", "storage.modifier", "constant.language", "variable.language", "keyword.control"],
      settings: { foreground: "#fc5fa3" },
    },
    { scope: ["keyword.operator", "punctuation"], settings: { foreground: "#ffffff" } },
    { scope: ["string", "punctuation.definition.string"], settings: { foreground: "#fc6a5d" } },
    { scope: ["meta.embedded", "source.swift.embedded"], settings: { foreground: "#ffffff" } },
    { scope: ["constant.numeric", "constant.character"], settings: { foreground: "#d0bf69" } },
    { scope: ["support.type", "support.class"], settings: { foreground: "#d0a8ff" } },
    { scope: ["entity.name.type", "entity.name.class", "entity.other.inherited-class"], settings: { foreground: "#5dd8ff" } },
    { scope: ["support.function", "support.variable", "meta.function-call"], settings: { foreground: "#a167e6" } },
    { scope: ["entity.name.function"], settings: { foreground: "#41a1c0" } },
  ],
};

const highlighter = await createHighlighter({ themes: [xcodeDark], langs: ["swift"] });

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// Goldmark's default ("github") heading IDs.
function headingId(text, used) {
  const base = text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
  let id = base;
  for (let n = 1; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

const isRemote = (href) => /^(https?:)?\/\//.test(href);
const isRelative = (href) => href && !isRemote(href) && !/^(\/|#|mailto:|tel:)/.test(href);

// Replaces shortcodes with placeholder tokens rendered after Markdown, so their HTML is not re-parsed.
function extractShortcodes(source, page, ctx) {
  const blocks = [];
  const token = (html, block) => {
    blocks.push(html);
    const id = `@@SC${blocks.length - 1}@@`;
    return block ? `\n\n${id}\n\n` : id;
  };

  let out = source.replace(/\{\{<\s*alert\s*(?:"([^"]+)")?\s*>\}\}([\s\S]*?)\{\{<\s*\/\s*alert\s*>\}\}/g, (_, name, inner) => {
    const body = ctx.renderInline(inner.trim());
    return token(
      `<div class="alert"><span class="alert-icon">${icon(name ?? "triangle-exclamation")}</span><span>${body}</span></div>`,
      true
    );
  });

  out = out.replace(/\{\{<\s*icon\s+"([^"]+)"\s*>\}\}/g, (_, name) => token(icon(name), false));

  out = out.replace(/\{\{%\s*resources\s+([^%]*?)\/?%\}\}/g, (_, args) => {
    const pattern = new RegExp(args.match(/pattern="([^"]*)"/)?.[1] ?? "");
    const files = page.resources
      .filter((r) => pattern.test(r.name))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((r) => `<li><a href="${r.url}" download>${escapeHtml(r.name)}</a></li>`)
      .join("");
    return token(
      `<div class="attachments"><div class="attachments-label">${t(page.lang, "attachments")}</div><ul>${files}</ul></div>`,
      true
    );
  });

  out = out.replace(/\{\{<\s*relref\s+"([^"]+)"\s*>\}\}/g, (_, ref) => ctx.resolvePage(ref) ?? ref);

  return { source: out, blocks };
}

/**
 * Renders a page's Markdown body.
 * @param {object} page   page object from content.js
 * @param {(ref: string) => string | undefined} resolvePage  maps a content reference to a URL in the page's language
 * @returns {{ html: string, toc: Array<{ level: number, id: string, text: string }> }}
 */
export function renderMarkdown(page, resolvePage) {
  const usedIds = new Set();
  const toc = [];
  const showAnchors = page.params.showHeadingAnchors ?? true;

  const marked = new Marked({ gfm: true });
  marked.use(markedSmartypants());
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const inner = this.parser.parseInline(tokens);
        const id = headingId(stripTags(inner), usedIds);
        if (depth >= 2 && depth <= 4) toc.push({ level: depth, id, text: stripTags(inner) });
        const anchor = showAnchors
          ? ` <a class="heading-anchor" href="#${id}" aria-label="${t(page.lang, "anchor")}">#</a>`
          : "";
        return `<h${depth} id="${id}">${inner}${anchor}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const language = highlighter.getLoadedLanguages().includes(lang) ? lang : "text";
        const html = highlighter.codeToHtml(text, { lang: language, theme: "xcode-dark" });
        return `<div class="highlight">${html}</div>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        let target = href;
        if (isRelative(href)) {
          const [ref, fragment] = href.split("#");
          target = (findResource(page, ref)?.url ?? resolvePage(ref) ?? ref) + (fragment ? `#${fragment}` : "");
        }
        const attrs = isRemote(href) ? ` target="_blank" rel="noreferrer"` : "";
        return `<a href="${escapeHtml(target)}"${title ? ` title="${escapeHtml(title)}"` : ""}${attrs}>${text}</a>`;
      },
      image({ href, title, text }) {
        const src = isRelative(href) ? (findResource(page, href)?.url ?? href) : href;
        const img = `<img src="${escapeHtml(src)}" alt="${escapeHtml(text)}" loading="lazy" decoding="async">`;
        return title ? `<figure>${img}<figcaption>${escapeHtml(title)}</figcaption></figure>` : img;
      },
    },
  });

  const ctx = {
    resolvePage,
    renderInline: (md) => {
      const html = marked.parse(md).trim();
      // A result that's just one paragraph is unwrapped, so inline shortcode bodies stay inline.
      const single = html.match(/^<p>([\s\S]*)<\/p>$/);
      return single && !single[1].includes("<p>") ? single[1] : html;
    },
  };

  const { source, blocks } = extractShortcodes(page.body, page, ctx);
  let html = marked.parse(source);
  html = html.replace(/<p>@@SC(\d+)@@<\/p>/g, (_, i) => blocks[i]).replace(/@@SC(\d+)@@/g, (_, i) => blocks[i]);
  return { html, toc };
}

export { escapeHtml, stripTags };
