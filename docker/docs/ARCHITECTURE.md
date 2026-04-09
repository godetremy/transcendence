# Architecture

## Service groups

- Edge and app: `nginx`, `node`
- Secrets: `vault`, `vault-agent`
- Metrics and dashboards: `prometheus`, `grafana`, `node-exporter`, `cadvisor`
- Logging: `elasticsearch`, `logstash`, `kibana`, `elk-bootstrap`
- Operations: `portainer`

## Network segmentation

- `edge` (bridge): services with published host ports and controlled cross-domain access
- `app` (bridge, internal): traffic path between `nginx` and `node`
- `monitoring` (bridge, internal): metrics path for `prometheus`, `grafana`, `node`, `node-exporter`, `cadvisor`
- `elk` (bridge, internal): log ingestion/analysis path for `elasticsearch`, `logstash`, `kibana`, `elk-bootstrap`
- `vault_net` (bridge, internal): secrets path for `vault` and `vault-agent`

Using `internal: true` on non-edge networks blocks direct outbound access for containers on those networks and reduces lateral movement surface.

## Data flows

### HTTP flow

1. Client sends request to `nginx` on port 8080.
2. WAF applies ModSecurity rules.
3. Request is forwarded to `node`.

### Metrics flow

1. Prometheus scrapes `node`, `node-exporter`, `cadvisor`, and itself.
2. Prometheus evaluates alert rules from `prometheus/alerts.yml`.
3. Grafana queries Prometheus for visualization.

### Log flow

1. Log shippers can send events to Logstash (`5044`).
2. Logstash writes to Elasticsearch (`docker-logs-*` indices).
3. Kibana reads from Elasticsearch.
4. `elk-bootstrap` applies ILM/SLM policies after Elasticsearch is healthy.

### Secrets flow

1. Vault runs in dev mode.
2. `vault-agent` waits for Vault readiness.
3. `vault-agent` writes policy, creates token, and stores token in sink file.
4. Vault Agent renders template to `/vault/agent/rendered/app-config.env`.

## Dependencies

- `nginx` depends on healthy `node`.
- `grafana` depends on healthy `prometheus`.
- `elk-bootstrap`, `logstash`, and `kibana` depend on healthy `elasticsearch`.
- `vault-agent` depends on healthy `vault`.

## Persistence

Named volumes persist state for logs, metrics, dashboards, DB data, backups, and agent tokens.

- `elastic_data`
- `prom_data`
- `grafana_data`
- `vault_agent_data`
- `portainer_data`
