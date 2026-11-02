// Minimal static server for dist/ (like GitHub Pages: /dir/ serves dir/index.html, 404s use 404.html).
// Usage: npm run dev  (PORT=8080 to change the port)

import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const DIST = path.resolve(import.meta.dirname, "../dist");
const PORT = Number(process.env.PORT ?? 1313);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".zip": "application/zip",
  ".webmanifest": "application/manifest+json",
};

function send(res, status, file) {
  res.writeHead(status, { "Content-Type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = path.join(DIST, urlPath);
    if (!file.startsWith(DIST)) return res.writeHead(403).end();

    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      if (!urlPath.endsWith("/")) return res.writeHead(301, { Location: urlPath + "/" }).end();
      if (fs.existsSync(path.join(file, "index.html"))) return send(res, 200, path.join(file, "index.html"));
    } else if (fs.existsSync(file)) {
      return send(res, 200, file);
    }
    send(res, 404, path.join(DIST, "404.html"));
  })
  .listen(PORT, () => console.log(`Serving dist/ at http://localhost:${PORT}/`));
