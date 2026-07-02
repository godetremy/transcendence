#!/usr/bin/env bash
source "./docker/scripts/helper.sh"

generate_app_certificate() {
	local env_path="$1"
	local environment_path="$2"
	local environment_label="$3"

	if ! command -v "$MKCERT" >/dev/null 2>&1; then
		print_error_and_exit "cannot found executable $MKCERT. Install it before with brew or apt."
	fi

	if [ ! -f "$env_path" ]; then
		print_error_and_exit "$environment_label environnement not found. You must initialize them before."
	fi

	source "$env_path"

	local cert_path="$environment_path/$DOCKER_CERTIFICATES_PATH"
	local domains=(
		"$NEXT_PUBLIC_BASE_URL"
		"grafana.$NEXT_PUBLIC_BASE_URL"
		"kibana.$NEXT_PUBLIC_BASE_URL"
		"prometheus.$NEXT_PUBLIC_BASE_URL"
	)

	export TRUST_STORES=system,nss
	mkdir -p "$cert_path"
	mkcert -install
	mkcert -cert-file "$cert_path/certificate.pem" -key-file "$cert_path/certificate.key.pem" "${domains[@]}"
	print_done "Generated $environment_label app certificate"

	local host_line="127.0.0.1 ${domains[*]}"
	if ! grep -Fq "$host_line" '/etc/hosts'; then
		echo "$host_line" | sudo tee -a /etc/hosts
		print_done "$environment_label hosts updated."
	else
		print_done "$environment_label hosts already updated."
	fi
}

generate_elasticsearch_certificates() {
	local ca_dir="$ELASTICSEARCH_CERTS_PATH/ca"

	if [ -f "$ca_dir/ca.crt" ]; then
		print_warning 'Elasticsearch certificates already present, skipping.'
		return 0
	fi

	mkdir -p "$ca_dir"

	openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out "$ca_dir/ca.key"
	openssl req -x509 -new -nodes -key "$ca_dir/ca.key" -sha256 -days 3650 \
		-subj '/CN=trans-ca' -out "$ca_dir/ca.crt"

	_generate_es_server_cert elasticsearch 'DNS:elasticsearch,DNS:localhost,IP:127.0.0.1'

	find "$ELASTICSEARCH_CERTS_PATH" -type d -exec chmod 755 {} \;
	find "$ELASTICSEARCH_CERTS_PATH" -type f -exec chmod 644 {} \;

	print_done "Generated Elasticsearch/Kibana certificates in $ELASTICSEARCH_CERTS_PATH"
}

_generate_es_server_cert() {
	local name="$1" san="$2" dir="$ELASTICSEARCH_CERTS_PATH/$1"
	mkdir -p "$dir"
	openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:2048 -out "$dir/$name.key"
	openssl req -new -key "$dir/$name.key" -subj "/CN=$name" -out "$dir/$name.csr"
	openssl x509 -req -in "$dir/$name.csr" -CA "$ELASTICSEARCH_CERTS_PATH/ca/ca.crt" \
		-CAkey "$ELASTICSEARCH_CERTS_PATH/ca/ca.key" -CAcreateserial -days 3650 -sha256 \
		-extfile <(printf 'subjectAltName=%s' "$san") -out "$dir/$name.crt"
	rm -f "$dir/$name.csr"
}

generate_app_certificate "$DEVELOPMENT_ENV" "$DEVELOPMENT_PATH" 'development'
generate_app_certificate "$STAGING_ENV" "$STAGING_PATH" 'staging'
generate_app_certificate "$PRODUCTION_ENV" "$PRODUCTION_PATH" 'production'
generate_elasticsearch_certificates
