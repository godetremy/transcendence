# Setup Guide

This guide brings up the full stack in a repeatable and low-memory way.

## Prerequisites

- Docker Engine 24+
- Docker Compose plugin 2.20+
- At least 6 GB free RAM (target stack footprint is around 4.5 to 5.5 GB)
- At least 15 GB free disk

## 1) Prepare environment values

Use the example file as your baseline and keep private values in `.env.local`.

```bash
cp .env.example .env.local
```

Update secret values in `.env.local`:

- `GRAFANA_ADMIN_PASSWORD`
- `VAULT_DEV_ROOT_TOKEN_ID`
- `VAULT_APP_SECRET`
- `ELASTIC_PASSWORD`
- `ELASTICSEARCH_PASSWORD`
- `KIBANA_ENCRYPTION_KEY`

Generate a strong Kibana encryption key (32+ chars):

```bash
openssl rand -base64 48
```

## 2) Validate configuration

```bash
docker compose --env-file .env.local config > /tmp/dockerconfig.rendered.yml
```

If this command fails, review variable names in `.env.local`.

## 3) Start services

```bash
docker compose --env-file .env.local up -d
```

On first startup, Compose creates segmented networks: `edge`, `app` (internal), `monitoring` (internal), `elk` (internal), and `vault_net` (internal).

## 4) Verify health

```bash
docker compose --env-file .env.local ps
```

All services should move to `running` and most should show `healthy` after startup periods.

## 5) Access endpoints

- Node app through WAF: `http://localhost:8080`
- Node app direct: `http://localhost:8888`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`
- Elasticsearch: `http://localhost:9200`
- Kibana: `http://localhost:5601`
- Logstash API: `http://localhost:9600`
- Vault: `http://localhost:8200`
- Portainer: `https://localhost:9443`

## 6) Stop and cleanup

Stop services:

```bash
docker compose --env-file .env.local down
```

Stop and remove all persisted data volumes:

```bash
docker compose --env-file .env.local down -v
```

Use `down -v` only when you intentionally want to reset all state.
