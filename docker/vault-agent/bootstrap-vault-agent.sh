#!/bin/sh
set -eu

umask 077

: "${VAULT_ADDR:?VAULT_ADDR is required}"
: "${VAULT_DEV_ROOT_TOKEN_ID:?VAULT_DEV_ROOT_TOKEN_ID is required}"

mkdir -p /vault/agent/token /vault/agent/rendered

wait_for_vault() {
	tries=0
	while ! vault status -address="${VAULT_ADDR}" >/dev/null 2>&1; do
		tries=$((tries + 1))
		if [ "${tries}" -ge 30 ]; then
			echo "ERROR: Vault is not reachable at ${VAULT_ADDR}" >&2
			exit 1
		fi
		sleep 2
	done
}

echo "Initializing Vault Agent..."

export VAULT_TOKEN="${VAULT_DEV_ROOT_TOKEN_ID}"

wait_for_vault

echo "Creating app-read policy..."
vault policy write -address="${VAULT_ADDR}" app-read - <<'EOF'
path "secret/data/app" {
  capabilities = ["read"]
}
EOF

echo "Creating app token..."
APP_TOKEN="$(vault token create \
	-address="${VAULT_ADDR}" \
	-policy=app-read \
	-ttl=24h \
	-renewable=true \
	-orphan \
	-field=token)"

if [ -z "${APP_TOKEN}" ]; then
	echo "ERROR: Failed to create app token" >&2
	exit 1
fi

printf '%s' "${APP_TOKEN}" > /vault/agent/token/app.token
chmod 0400 /vault/agent/token/app.token
echo "App token created successfully"

echo "Storing secrets in Vault..."
vault kv put -address="${VAULT_ADDR}" secret/app \
	app_secret="${VAULT_APP_SECRET}" \
	elastic_password="${ELASTIC_PASSWORD}" \
	kibana_encryption_key="${KIBANA_ENCRYPTION_KEY}" \
	>/dev/null

echo "Secrets stored successfully"
unset VAULT_TOKEN

echo "Starting Vault Agent..."
exec vault agent -config=/etc/vault/agent.hcl
