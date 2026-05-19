#!/bin/bash
set -euo pipefail

CERT_DIR="/usr/share/kibana/config/certs"

if [ ! -f "$CERT_DIR/kibana.crt" ] || [ ! -f "$CERT_DIR/kibana.key" ]; then
    echo "Generating Kibana certificates..."
    openssl req -x509 -nodes -days 3650 -newkey rsa:4096 \
      -subj "/C=US/ST=State/L=City/O=Organization/OU=IT/CN=kibana.local" \
      -addext "subjectAltName=DNS:kibana.local,DNS:localhost,IP:127.0.0.1" \
      -keyout "$CERT_DIR/kibana.key" \
      -out "$CERT_DIR/kibana.crt"
    chmod 644 "$CERT_DIR/kibana.key" "$CERT_DIR/kibana.crt"
else
    echo "Certificates already exist, skipping generation."
fi

# Start Kibana
exec /usr/local/bin/kibana-docker
