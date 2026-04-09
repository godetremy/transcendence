# Resource and Memory Tuning

This stack is tuned for a low-memory local profile while remaining functional.

## Service budgets

- Elasticsearch: `mem_limit=1g`, `cpus=1.00`, heap `512m`
- Logstash: `mem_limit=512m`, `cpus=0.50`, heap `256m`
- Kibana: `mem_limit=512m`, `cpus=0.50`, Node heap `256m`
- Prometheus: `mem_limit=512m`, `cpus=0.50`, retention `3d/2GB`
- Grafana: `mem_limit=256m`, `cpus=0.25`
- Nginx: `mem_limit=256m`, `cpus=0.50`
- Vault: `mem_limit=256m`, `cpus=0.25`
- Vault Agent: `mem_limit=192m`, `cpus=0.25`
- Portainer: `mem_limit=384m`, `cpus=0.50`

## Elasticsearch tuning

- `indices.queries.cache.size: 10%`
- `indices.fielddata.cache.size: 15%`
- ILM rollover: `1d` or `2gb`
- ILM delete phase: `7d`
- Snapshot retention: `14d`

## Prometheus tuning

Prometheus runs with bounded storage and query pressure:

- `--storage.tsdb.retention.time=3d`
- `--storage.tsdb.retention.size=2GB`
- `--query.max-concurrency=4`
- `--query.timeout=2m`

## When to scale up

Increase memory if you observe one of these patterns:

- Elasticsearch frequent long GC pauses
- Logstash queue backlog growth during sustained ingest
- Kibana dashboard timeouts
- Prometheus query timeout on normal dashboard load

## Quick validation commands

```bash
docker stats --no-stream

docker compose --env-file .env.local ps

curl -fsS http://localhost:9090/-/ready
curl -fsS http://localhost:5601/api/status
curl -fsS http://localhost:9600
```
