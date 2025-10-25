#!/usr/bin/env python3
"""
Simple HTTP server with proper MIME types for ES6 modules.
Usage: python server.py [port]
"""
import http.server
import socketserver
import sys
import os
from pathlib import Path

# Load environment variables from .env file
def load_env():
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()

load_env()

# Determine port with Cloud Run compatibility:
# 1) PORT environment variable (Cloud Run)
# 2) Command-line argument
# 3) Default 8000
PORT = int(os.environ.get('PORT', sys.argv[1] if len(sys.argv) > 1 else 8000))
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY', '')

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
    
    def do_GET(self):
        # Inject API key into index.html
        if self.path == '/' or self.path == '/index.html':
            try:
                with open('index.html', 'rb') as f:
                    content = f.read().decode('utf-8')
                    # Replace placeholder with actual API key
                    content = content.replace(
                        'window.__GEMINI_API_KEY || localStorage.getItem("GEMINI_API_KEY") || ""',
                        f'"{GEMINI_API_KEY}"'
                    )
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.send_header('Content-Length', len(content.encode('utf-8')))
                    self.end_headers()
                    self.wfile.write(content.encode('utf-8'))
                return
            except Exception as e:
                print(f"Error serving index.html: {e}")
        
        # Default behavior for other files
        super().do_GET()

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"✓ Server running at http://localhost:{PORT}/")
    print(f"✓ Serving files from: {httpd.server_address}")
    print("✓ Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
        sys.exit(0)
