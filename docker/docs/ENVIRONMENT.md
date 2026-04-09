# Environment Variables

This file documents all runtime variables used by the stack.

## Core

- `GRAFANA_ADMIN_USER`: Grafana admin username
- `GRAFANA_ADMIN_PASSWORD`: Grafana admin password
- `VAULT_DEV_ROOT_TOKEN_ID`: Vault dev root token
- `VAULT_DEV_LISTEN_ADDRESS`: Vault bind address
- `VAULT_ADDR`: Internal Vault URL used by `vault-agent`
- `VAULT_APP_SECRET`: Secret value written to `secret/app`
- `NODE_ENV`: Node environment (`production` by default)
- `NODE_PORT`: Node internal and published port

## Nginx WAF

- `NGINX_PROXY`: Enables proxy mode (`1`)
- `NGINX_BACKEND`: Backend service URL (default `http://node:8888`)
- `NGINX_PARANOIA`: CRS paranoia level (higher means stricter)
- `NGINX_ANOMALY_INBOUND`: Inbound anomaly threshold
- `NGINX_ANOMALY_OUTBOUND`: Outbound anomaly threshold

## ELK

- `ELK_VERSION`: Shared Elastic image version
- `ES_JAVA_OPTS`: Elasticsearch heap options (`-Xms512m -Xmx512m`)
- `LS_JAVA_OPTS`: Logstash heap options (`-Xms256m -Xmx256m`)
- `KIBANA_NODE_OPTIONS`: Kibana Node runtime heap cap (recommended `--max-old-space-size=768`)
- `ELASTIC_PASSWORD`: Elastic superuser password
- `ELASTICSEARCH_USERNAME`: Logstash output username
- `ELASTICSEARCH_PASSWORD`: Logstash output password
- `KIBANA_ENCRYPTION_KEY`: Encrypted saved objects key (32+ chars)

## Monitoring and Alerting

- `PROMETHEUS_RETENTION_TIME`: TSDB time retention (default `3d`)
- `PROMETHEUS_RETENTION_SIZE`: TSDB size cap (default `2GB`)
- `PROMETHEUS_QUERY_MAX_CONCURRENCY`: Max query concurrency
- `PROMETHEUS_QUERY_TIMEOUT`: Query timeout

## Secret hygiene model

- `.env.example` is tracked and safe to share.
- `.env.local` is local-only and gitignored.
- Start compose with `--env-file .env.local` to avoid committing secrets.
- Secret variables are seeded into Vault at `secret/data/app` by `vault-agent` bootstrap and rendered to `/vault/agent/rendered/app-config.env`.
