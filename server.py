import http.server
import ssl
import os

# python server.py
# Change to the directory containing your index.html file
# os.chdir('./public')

server_address = ('', 443)
httpd = http.server.HTTPServer(server_address, http.server.SimpleHTTPRequestHandler)

# Path to your certificate and key files
cert_file = './cert.pem'
key_file = './key.pem'

# Wrap the server's socket with SSL
httpd.socket = ssl.wrap_socket(httpd.socket, keyfile=key_file, certfile=cert_file, server_side=True)

print("Serving on https://localhost")
httpd.serve_forever()

