#!/usr/bin/env python3
"""
Simple HTTP server with proper MIME types for ES6 modules.
Usage: python server.py [port]
"""
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        '': 'application/octet-stream',
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',  # Correct MIME type for JavaScript modules
        '.mjs': 'application/javascript',
        '.json': 'application/json',
        '.xml': 'application/xml',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.ico': 'image/x-icon',
        '.wasm': 'application/wasm',
    }

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"✓ Server running at http://localhost:{PORT}/")
    print(f"✓ Serving files from: {httpd.server_address}")
    print("✓ Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
        sys.exit(0)
