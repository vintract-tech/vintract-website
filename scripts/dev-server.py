"""Local preview server for site/ with caching disabled.

python -m http.server sends no Cache-Control, so Chrome heuristically
caches HTML/JS and edits appear to "not work" until a hard refresh.
This server forces no-store on every response, so a plain refresh
always shows the working copy exactly as it is on disk.

Run: python scripts/dev-server.py  (serves http://localhost:5500)
"""
import http.server
import os

PORT = 5500
SITE = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "site")


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SITE, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    with http.server.ThreadingHTTPServer(("", PORT), NoCacheHandler) as httpd:
        print(f"serving {SITE} at http://localhost:{PORT} (no-store)")
        httpd.serve_forever()
