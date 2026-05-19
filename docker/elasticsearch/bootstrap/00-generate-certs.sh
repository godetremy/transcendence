#!/bin/bash
set -eu

CERTS_DIR="/usr/share/elasticsearch/config/certs"
CA_FILE="${CERTS_DIR}/elastic-stack-ca.p12"
CERT_FILE="${CERTS_DIR}/elastic-certificates.p12"
CERT_PASSWORD="${ELASTIC_CERT_PASSWORD}"

mkdir -p "${CERTS_DIR}"

if [ -f "${CERT_FILE}" ]; then
	echo "Certificates already exist in ${CERTS_DIR}, skipping generation."
	exit 0
fi

elasticsearch-certutil ca --silent --out "${CA_FILE}" --pass "${CERT_PASSWORD}"

elasticsearch-certutil cert \
	--silent \
	--ca "${CA_FILE}" \
	--ca-pass "${CERT_PASSWORD}" \
	--out "${CERT_FILE}" \
	--pass "${CERT_PASSWORD}" \
	--name "elastic" \
	--dns "elastic,elasticsearch,localhost" \
	--ip "127.0.0.1"

chown 1000:0 "${CA_FILE}" "${CERT_FILE}"
chmod 640 "${CA_FILE}" "${CERT_FILE}"
