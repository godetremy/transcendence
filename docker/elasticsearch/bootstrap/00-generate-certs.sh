#!/bin/bash
set -eu

CERTS_DIR="/usr/share/elasticsearch/config/certs"
CA_KEY="${CERTS_DIR}/ca.key"
CA_CRT="${CERTS_DIR}/ca.crt"
CA_P12="${CERTS_DIR}/elastic-stack-ca.p12"
CERT_PASSWORD="${ELASTIC_CERT_PASSWORD}"

mkdir -p "${CERTS_DIR}"

if [ -f "${CA_CRT}" ] && [ -f "${CERTS_DIR}/elasticsearch.crt" ]; then
	echo "Certificates already exist in ${CERTS_DIR}, skipping generation."
	exit 0
fi

echo "Generating CA..."
if [ ! -f "${CA_P12}" ]; then
	elasticsearch-certutil ca --silent --out "${CA_P12}" --pass "${CERT_PASSWORD}"
fi

openssl pkcs12 -in "${CA_P12}" -out "${CA_CRT}" -nokeys -passin pass:"${CERT_PASSWORD}"
openssl pkcs12 -in "${CA_P12}" -out "${CA_KEY}" -nodes -nocerts -passin pass:"${CERT_PASSWORD}"

gen_service_cert() {
	local name=$1
	shift
	local key="${CERTS_DIR}/${name}.key"
	local crt="${CERTS_DIR}/${name}.crt"
	local csr="${CERTS_DIR}/${name}.csr"
	local cnf="/tmp/${name}-openssl.cnf"

	echo "Generating certificate for ${name}..."

	# Build OpenSSL config file with proper SAN entries
	cat > "${cnf}" <<EOF
[req]
distinguished_name = req_distinguished_name
req_extensions = v3_req
prompt = no

[req_distinguished_name]
CN = ${name}
O = Transcendence
C = FR

[v3_req]
subjectAltName = @alt_names

[alt_names]
EOF

	local dns_idx=1
	local ip_idx=1
	for entry in "$@"; do
		case "$entry" in
			DNS:*)
				echo "DNS.${dns_idx} = ${entry#DNS:}" >> "${cnf}"
				dns_idx=$((dns_idx + 1))
				;;
			IP:*)
				echo "IP.${ip_idx} = ${entry#IP:}" >> "${cnf}"
				ip_idx=$((ip_idx + 1))
				;;
		esac
	done

	# Generate key in traditional RSA format, then convert to PKCS#8 for Java clients
	openssl genrsa -out "${key}.rsa" 4096
	openssl pkcs8 -topk8 -nocrypt -in "${key}.rsa" -out "${key}"
	rm -f "${key}.rsa"

	openssl req -new -key "${key}" -out "${csr}" -config "${cnf}"
	openssl x509 -req -in "${csr}" -CA "${CA_CRT}" -CAkey "${CA_KEY}" \
		-CAcreateserial -out "${crt}" -days 3650 -sha256 \
		-extensions v3_req -extfile "${cnf}"

	rm -f "${csr}" "${cnf}"
	chmod 640 "${key}"
	chmod 644 "${crt}"
}

# Generate per-service certificates
gen_service_cert "elasticsearch" "DNS:elasticsearch" "DNS:localhost" "IP:127.0.0.1"
gen_service_cert "kibana" "DNS:kibana" "DNS:localhost" "IP:127.0.0.1"
gen_service_cert "logstash" "DNS:logstash" "DNS:localhost" "IP:127.0.0.1"
gen_service_cert "filebeat" "DNS:filebeat" "DNS:localhost" "IP:127.0.0.1"

# Backward-compatible PKCS#12 keystore for ES itself
openssl pkcs12 -export \
	-in "${CERTS_DIR}/elasticsearch.crt" -inkey "${CERTS_DIR}/elasticsearch.key" \
	-certfile "${CA_CRT}" -out "${CERTS_DIR}/elastic-certificates.p12" \
	-passout pass:"${CERT_PASSWORD}" -name "elastic"

# Elasticsearch official image runs as UID 1000 (user elasticsearch).
# GID 0 (root) is used so the container runtime can still read certs
# when securityContext or user directives vary between environments.
chown -R 1000:0 "${CERTS_DIR}"

echo "Certificate generation complete."
