# /// script
# requires-python = ">=3.8"
# dependencies = []
# ///

import http.server
import ssl
import socket

# Run with: uv run server.py
# Serves the website over HTTPS
# For mobile testing: use ngrok separately or access via local network

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

server_address = ('', 8443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# Path to your certificate and key files
cert_file = './cert.pem'
key_file = './key.pem'

# Create SSL context (modern approach, ssl.wrap_socket is deprecated)
context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
context.load_cert_chain(cert_file, key_file)
httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

local_ip = get_local_ip()

print("Local: https://localhost:8443")
print(f"WiFi:  https://{local_ip}:8443")
print()

httpd.serve_forever()

