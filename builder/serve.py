"""Minimal static server for dist/, behaving like GitHub Pages.

/dir/ serves dir/index.html, /dir redirects to /dir/, and unknown paths get 404.html.
"""

from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

from .build import DIST


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".webmanifest": "application/manifest+json"}

    def send_error(self, code, message=None, explain=None):
        # Serve the site's own 404 page instead of the default error page.
        if code == 404 and (DIST / "404.html").exists():
            body = (DIST / "404.html").read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)


def serve(port: int = 1313) -> None:
    handler = partial(Handler, directory=str(DIST))
    with ThreadingHTTPServer(("localhost", port), handler) as server:
        print(f"Serving dist/ at http://localhost:{port}/  (Ctrl+C to stop)")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
