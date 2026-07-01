import http.server
import socketserver
import os

PORT = 3000

class CustomRewriteHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Extract path without query parameters
        path_parts = self.path.split('?')
        path_only = path_parts[0]
        query_params = '?' + path_parts[1] if len(path_parts) > 1 else ''

        # Map clean URLs to their physical HTML files (matching serve.json)
        rewrites = {
            "/": "/index.html",
            "/room-details": "/room-details.html",
            "/package-details": "/package-details.html",
            "/event-details": "/event-details.html",
            "/checkout": "/checkout.html",
            "/payment": "/payment.html",
            "/confirmation": "/confirmation.html",
            "/menu": "/menu.html",
            "/search-results": "/search-results.html"
        }

        # Apply rewrite if matched
        if path_only in rewrites:
            self.path = rewrites[path_only] + query_params

        return super().do_GET()

# Prevent "Address already in use" errors on restarts
socketserver.ThreadingTCPServer.allow_reuse_address = True

with socketserver.ThreadingTCPServer(("", PORT), CustomRewriteHandler) as httpd:
    print(f"Serving Flex-Stays HMS on port {PORT} with serve.json rewrites...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
