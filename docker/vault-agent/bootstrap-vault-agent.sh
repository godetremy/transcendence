#!/bin/sh
set -eu

mkdir -p /vault/agent/token /vault/agent/rendered

attempt=0
until vault status -address="${VAULT_ADDR}" >/dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ "${attempt}" -ge 60 ]; then
    echo "Vault did not become ready in time" >&2
    exit 1
  fi
  echo "Waiting for Vault..."
  sleep 2
done

export VAULT_TOKEN="${VAULT_DEV_ROOT_TOKEN_ID}"

vault policy write -address="${VAULT_ADDR}" app-read - <<'EOF'
path "secret/data/app" {
  capabilities = ["read"]
}
EOF

APP_TOKEN="$(vault token create -address="${VAULT_ADDR}" -policy=app-read -ttl=24h -field=token)"

if [ -z "${APP_TOKEN}" ]; then
  echo "Failed to create app token" >&2
  exit 1
fi

printf '%s' "${APP_TOKEN}" > /vault/agent/token/root.token
vault kv put -address="${VAULT_ADDR}" secret/app \
  app_secret="${VAULT_APP_SECRET}" \
  grafana_admin_password="${GRAFANA_ADMIN_PASSWORD}" \
  elastic_password="${ELASTIC_PASSWORD}" \
  elasticsearch_password="${ELASTICSEARCH_PASSWORD}" \
  kibana_encryption_key="${KIBANA_ENCRYPTION_KEY}" \
  >/dev/null
unset VAULT_TOKEN

exec vault agent -config=/etc/vault/agent.hcl
