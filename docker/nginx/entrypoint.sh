#!/bin/sh
set -eu

# Run base image entrypoint to initialize ModSecurity CRS
/docker-entrypoint.sh nginx -version >/dev/null 2>&1 || true

# Apply custom ModSecurity configs
cp /opt/custom/modsecurity.conf /etc/nginx/modsecurity.d/modsecurity-override.conf
cp /opt/custom/modsecurity-exclusions.conf /etc/nginx/modsecurity.d/modsecurity-exclusions.conf
cp /opt/custom/crs-setup.conf /etc/modsecurity.d/owasp-crs/crs-setup.conf

# Ensure custom exclusions are actually loaded by ModSecurity
if ! grep -q "modsecurity-exclusions.conf" /etc/nginx/modsecurity.d/setup.conf 2>/dev/null; then
    echo "Include /etc/nginx/modsecurity.d/modsecurity-exclusions.conf" >> /etc/nginx/modsecurity.d/setup.conf
fi

# Generate self-signed certificates for production if SSL is enabled
if [ "${NGINX_SSL:-0}" = "1" ]; then
	if [ ! -f /etc/nginx/certs/nginx.crt ] || [ ! -f /etc/nginx/certs/nginx.key ]; then
		mkdir -p /etc/nginx/certs
		openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
			-subj "/CN=localhost" \
			-keyout /etc/nginx/certs/nginx.key \
			-out /etc/nginx/certs/nginx.crt
		chmod 600 /etc/nginx/certs/nginx.key
		chmod 644 /etc/nginx/certs/nginx.crt
	fi
	export NGINX_PORT="443 ssl"
	export NGINX_SSL_CERT="ssl_certificate /etc/nginx/certs/nginx.crt;"
	export NGINX_SSL_KEY="ssl_certificate_key /etc/nginx/certs/nginx.key;"
	export NGINX_SSL_REDIRECT="server { listen 80; return 301 https://\$host\$request_uri; }"
else
	export NGINX_PORT="8080"
	export NGINX_SSL_CERT=""
	export NGINX_SSL_KEY=""
	export NGINX_SSL_REDIRECT=""
fi

# Substitute environment variables into nginx config template
envsubst '$NGINX_PORT $NGINX_SSL_CERT $NGINX_SSL_KEY $NGINX_SSL_REDIRECT' \
	< /opt/custom/nginx.conf.template > /etc/nginx/nginx.conf

exec nginx -g "daemon off;"
