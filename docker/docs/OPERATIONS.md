# Operations Runbook

## Start

```bash
docker compose --env-file .env.local up -d
```

## Stop

```bash
docker compose --env-file .env.local down
```

## Restart one service

```bash
docker compose --env-file .env.local restart <service>
```

## Check health and logs

```bash
docker compose --env-file .env.local ps

docker compose --env-file .env.local logs -f <service>
```

## Core checks

- Node health: `curl -fsS http://localhost:8888/health`
- Node status report: `curl -fsS http://localhost:8888/status`
- WAF path test: `curl -i http://localhost:8080`
- Prometheus ready: `curl -fsS http://localhost:9090/-/ready`
- Elasticsearch health: `curl -u elastic:<password> http://localhost:9200/_cluster/health`
- Kibana status: `curl -fsS http://localhost:5601/api/status`
- Vault health: `curl -fsS http://localhost:8200/v1/sys/health`

## Validate Vault secret seeding

The `vault-agent` bootstrap writes secret values to `secret/data/app` and renders them to `/vault/agent/rendered/app-config.env`.

Example checks:

```bash
ROOT_TOKEN=$(grep '^VAULT_DEV_ROOT_TOKEN_ID=' .env.local | cut -d= -f2-)
docker compose --env-file .env.local exec -T vault sh -lc "VAULT_ADDR=http://127.0.0.1:8200 VAULT_TOKEN=${ROOT_TOKEN} vault kv get secret/app"
docker compose --env-file .env.local exec -T vault-agent sh -lc "cat /vault/agent/rendered/app-config.env"
```

## Backup and retention

- Elasticsearch retention is managed by ILM policy in `elasticsearch/bootstrap/01-retention.sh`.
- Prometheus retention is bounded by time and size flags in compose.

## Network checks

List project networks:

```bash
docker network ls | grep dockerconfig_
```

Inspect one segmented network:

```bash
docker network inspect dockerconfig_monitoring
```

Inspect a container network membership:

```bash
docker inspect dockerconfig-node --format '{{json .NetworkSettings.Networks}}'
```

