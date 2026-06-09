#!/bin/bash
set -euo pipefail

source /scripts/wait-utils.sh

CERT_DIR="/usr/share/kibana/config/certs"

wait_for_file "${CERT_DIR}/kibana.crt" 120
wait_for_file "${CERT_DIR}/kibana.key" 120
wait_for_file "${CERT_DIR}/ca.crt" 120

echo "Kibana certificates found."
