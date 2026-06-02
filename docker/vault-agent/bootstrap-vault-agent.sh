#!/bin/bash
set -euo pipefail

# shellcheck source=/opt/wait-utils.sh
source /opt/wait-utils.sh

umask 077

: "${VAULT_ADDR:?VAULT_ADDR is required}"

mkdir -p /vault/agent/token /vault/agent/rendered

UNSEAL_KEY_FILE="/vault/agent/token/unseal.key"
ROOT_TOKEN_FILE="/vault/agent/token/root.token"

wait_for_vault() {
	wait_for_tcp vault 8200 60
}

echo "Initializing Vault Agent..."

wait_for_vault

# Determine Vault status
init_status=$(vault status -address="${VAULT_ADDR}" -format=json 2>/dev/null | tr ',' '\n' | grep '"initialized"' | cut -d':' -f2 | tr -d ' \n' || true)

if [ "${init_status}" = "false" ]; then
	echo "Vault is not initialized. Initializing now..."
	init_output=$(vault operator init -address="${VAULT_ADDR}" -key-shares=1 -key-threshold=1 -format=json)

	root_token=$(printf '%s' "${init_output}" | tr -d '\n ' | grep -o '"root_token":"[^"]*"' | cut -d'"' -f4)
	unseal_key=$(printf '%s' "${init_output}" | tr -d '\n ' | grep -o '"unseal_keys_hex":\["[^"]*"\]' | head -1 | cut -d'"' -f4)

	if [ -z "${root_token}" ] || [ -z "${unseal_key}" ]; then
		echo "ERROR: Failed to parse init output" >&2
		exit 1
	fi

	printf '%s' "${unseal_key}" > "${UNSEAL_KEY_FILE}"
	chmod 0400 "${UNSEAL_KEY_FILE}"
	printf '%s' "${root_token}" > "${ROOT_TOKEN_FILE}"
	chmod 0400 "${ROOT_TOKEN_FILE}"

	echo "Unsealing Vault..."
	vault operator unseal -address="${VAULT_ADDR}" "${unseal_key}"
	echo "Vault initialized and unsealed."
elif [ "${init_status}" = "true" ]; then
	sealed_status=$(vault status -address="${VAULT_ADDR}" -format=json 2>/dev/null | tr ',' '\n' | grep '"sealed"' | cut -d':' -f2 | tr -d ' \n' || true)
	if [ "${sealed_status}" = "true" ]; then
		if [ -f "${UNSEAL_KEY_FILE}" ]; then
			unseal_key=$(cat "${UNSEAL_KEY_FILE}")
			echo "Unsealing Vault with stored key..."
			vault operator unseal -address="${VAULT_ADDR}" "${unseal_key}"
			echo "Vault unsealed."
		else
			echo "ERROR: Vault is sealed and no unseal key is available." >&2
			exit 1
		fi
	fi
	if [ -f "${ROOT_TOKEN_FILE}" ]; then
		root_token=$(cat "${ROOT_TOKEN_FILE}")
	else
		root_token="${VAULT_DEV_ROOT_TOKEN_ID:-}"
	fi
	if [ -z "${root_token}" ]; then
		echo "ERROR: Vault is initialized but no root token is available." >&2
		exit 1
	fi
else
	echo "ERROR: Could not determine Vault initialization status." >&2
	exit 1
fi

export VAULT_TOKEN="${root_token}"

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

echo "Enabling KV secrets engine..."
vault secrets enable -address="${VAULT_ADDR}" -path=secret kv-v2 >/dev/null 2>&1 || true

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
