#!/usr/bin/env bash
source "./docker/scripts/helper.sh"

if ! command -v "$MKCERT" >/dev/null 2>&1; then
    print_error_and_exit "cannot found executable $MKCERT. Install it before with brew or apt."
fi

if [ ! -f "$DEVELOPMENT_ENV" ]; then
    print_error_and_exit 'environnement not found. You must initialize them before.'
fi

source "$DEVELOPMENT_ENV"

CERTIFICATE_PATH="$DEVELOPMENT_PATH/$DOCKER_CERTIFICATES_PATH"
CERT_FILE_CERTIFICATE_PATH="$CERTIFICATE_PATH/certificate.pem"
KEY_FILE_CERTIFICATE_PATH="$CERTIFICATE_PATH/certificate.key.pem"

export TRUST_STORES=system,nss
mkdir -p "$CERTIFICATE_PATH"
mkcert -install
mkcert -cert-file "$CERT_FILE_CERTIFICATE_PATH" -key-file "$KEY_FILE_CERTIFICATE_PATH" "$NEXT_PUBLIC_BASE_URL"

print_done "Generated certificate"

HOST_LINE="127.0.0.1 $NEXT_PUBLIC_BASE_URL"

if ! grep -q "$HOST_LINE" "/etc/hosts"; then
	echo "$HOST_LINE" | sudo tee -a /etc/hosts;
	print_done "Host updated."
else
	print_done "Host already updated."
fi