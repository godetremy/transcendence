# Service Reference

This document explains each service configuration and why it exists.

## prometheus

- File: `prometheus/prometheus.yml`
- Role: scrape metrics and evaluate alert rules
- Low-memory settings are in compose command flags (retention and query caps)

## grafana

- Files: `grafana/datasource.yml`, `grafana/dashboards/provider.yml`
- Role: visualize Prometheus metrics and provision dashboards

## node-exporter

- Role: host metrics for CPU/memory/disk/network
- Scraped by Prometheus as `node-exporter`

## cadvisor

- Role: container metrics and resource usage
- Scraped by Prometheus as `cadvisor`

## elasticsearch

- File: `elasticsearch/elasticsearch.yml`
- Role: index and search logs
- Uses memory-aware query and fielddata cache limits
- Snapshot repository path is configured for local volume persistence

## elk-bootstrap

- File: `elasticsearch/bootstrap/01-retention.sh`
- Role: one-shot policy provisioning (ILM, index template, SLM)
- Retention tuned for low-memory and lower local storage pressure

## logstash

- Files: `logstash/logstash.yml`, `logstash/pipeline/logstash.conf`
- Role: ingest and forward logs to Elasticsearch
- Monitoring is enabled for observability in Elastic stack

## kibana

- Files: `kibana/kibana.yml`, `kibana/bootstrap-kibana.sh`
- Role: visualize logs from Elasticsearch
- Bootstrap script creates service account token at container start

## vault

- Role: secrets service for local development (dev mode)
- Production note: replace dev mode with persistent secure config

## vault-agent

- Files: `vault-agent/agent.hcl`, `vault-agent/bootstrap-vault-agent.sh`, `vault-agent/templates/app-config.ctmpl`
- Role: bootstrap read policy and token, then render secret template
- Seeded secret keys in `secret/data/app`: `app_secret`, `grafana_admin_password`, `elastic_password`, `elasticsearch_password`, `kibana_encryption_key`

## node

- File: `node/server.js`
- Role: app endpoint, health endpoint, metrics endpoint, dependency status endpoint

## nginx

- Role: ModSecurity CRS reverse proxy in front of node app
- WAF behavior tuned through environment thresholds

## portainer

- Role: Docker operations UI
- Uses Docker socket and persistent state volume

