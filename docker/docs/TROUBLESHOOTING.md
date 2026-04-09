# Troubleshooting

## Compose fails with missing variables

Symptom:

- `docker compose --env-file .env.local config` reports undefined variables.

Fix:

1. Copy from `.env.example` again.
2. Ensure all required keys exist in `.env.local`.
3. Re-run `docker compose --env-file .env.local config`.

## Kibana fails to start with token error

Symptom:

- Kibana logs show `Failed to create Kibana service token`.

Fix:

1. Verify Elasticsearch is healthy first.
2. Confirm `ELASTIC_PASSWORD` is correct.
3. Check Kibana bootstrap script logs.

## Vault Agent loops waiting for Vault

Symptom:

- `vault-agent` repeatedly logs `Waiting for Vault...`.

Fix:

1. Confirm `vault` container is healthy.
2. Validate `VAULT_ADDR` and `VAULT_DEV_ROOT_TOKEN_ID`.
3. Ensure Vault is reachable on `http://vault:8200` from container network.

## Elasticsearch memory pressure

Symptom:

- Elasticsearch restarts or slow responses under load.

Fix:

1. Increase `ES_JAVA_OPTS` in `.env.local` (for example to `-Xms768m -Xmx768m`).
2. Raise Elasticsearch `mem_limit` in compose.
3. Reduce ingest rate or retention scope.

## Prometheus storage growth

Symptom:

- `prom_data` grows faster than expected.

Fix:

1. Lower `PROMETHEUS_RETENTION_TIME`.
2. Lower `PROMETHEUS_RETENTION_SIZE`.
3. Reduce scrape frequency in `prometheus/prometheus.yml` if needed.

## Node status endpoint degraded

Symptom:

- `GET /status` returns `degraded`.

Fix:

1. Check failed dependency in response JSON.
2. Inspect the failing service logs.
3. Confirm network reachability by service name.
