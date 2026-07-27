#!/usr/bin/env bash

set -euo pipefail

source ./docker/scripts/helper.sh

print_info 'Interactive Docker image monitoring setup'
printf "  - Prometheus scrape config\n"
printf "  - Alert thresholds\n"
printf "  - Exporters (node / postgres / nginx / elasticsearch)\n"
printf "  - Grafana admin credentials\n"
printf "\n"

if [ -f "$MONITORING_ENV" ]; then
	print_warning "monitoring secrets file already exists at $MONITORING_ENV"
	confirm "Reinitialize monitoring configuration? [Y/n]"
fi

PROM_SCRAPE_INTERVAL=$(read_default_from_file "$MONITORING_ENV" 'PROM_SCRAPE_INTERVAL' '15s')
PROM_SCRAPE_INTERVAL=$(read_with_prompt "Prometheus scrape interval" "$PROM_SCRAPE_INTERVAL")

PROM_EVAL_INTERVAL=$(read_default_from_file "$MONITORING_ENV" 'PROM_EVAL_INTERVAL' '15s')
PROM_EVAL_INTERVAL=$(read_with_prompt "Prometheus evaluation interval" "$PROM_EVAL_INTERVAL")

PROM_RETENTION=$(read_default_from_file "$MONITORING_ENV" 'PROM_RETENTION' '15d')
PROM_RETENTION=$(read_with_prompt "Prometheus retention (e.g. 15d)" "$PROM_RETENTION")

ALERT_CPU_HIGH_THRESHOLD=$(read_default_from_file "$MONITORING_ENV" 'ALERT_CPU_HIGH_THRESHOLD' '90')
ALERT_CPU_HIGH_THRESHOLD=$(read_with_prompt "HostHighCpu alert threshold (percent)" "$ALERT_CPU_HIGH_THRESHOLD")

PROMETHEUS_URL=$(read_default_from_file "$MONITORING_ENV" 'PROMETHEUS_URL' 'http://prometheus:9090')

print_info "Exporters (each one populates a Prometheus scrape job)"

NODE_EXPORTER_ENABLED=$(read_yes_no "Enable node-exporter (host CPU/mem/disk)?" "$(read_default_from_file "$MONITORING_ENV" 'NODE_EXPORTER_ENABLED' 'y')")
POSTGRES_EXPORTER_ENABLED=$(read_yes_no "Enable postgres-exporter?" "$(read_default_from_file "$MONITORING_ENV" 'POSTGRES_EXPORTER_ENABLED' 'y')")
NGINX_EXPORTER_ENABLED=$(read_yes_no "Enable nginx-exporter (stub_status)?" "$(read_default_from_file "$MONITORING_ENV" 'NGINX_EXPORTER_ENABLED' 'y')")
ELASTICSEARCH_EXPORTER_ENABLED=$(read_yes_no "Enable elasticsearch-exporter?" "$(read_default_from_file "$MONITORING_ENV" 'ELASTICSEARCH_EXPORTER_ENABLED' 'y')")

GRAFANA_ADMIN_USER=$(read_default_from_file "$MONITORING_ENV" 'GF_SECURITY_ADMIN_USER' 'admin')
GRAFANA_ADMIN_USER=$(read_with_prompt "Grafana admin username" "$GRAFANA_ADMIN_USER")

if [ -n "$(read_default_from_file "$MONITORING_ENV" 'GF_SECURITY_ADMIN_PASSWORD' '')" ]; then
	REUSE=$(read_yes_no "Reuse the existing Grafana admin password?" 'y')
	if [ "$REUSE" = 'y' ]; then
		GRAFANA_ADMIN_PASSWORD=$(read_default_from_file "$MONITORING_ENV" 'GF_SECURITY_ADMIN_PASSWORD' '')
	else
		GRAFANA_ADMIN_PASSWORD=$(read_password "New Grafana admin password")
	fi
else
	GRAFANA_ADMIN_PASSWORD=$(read_password "Grafana admin password")
fi


export PROM_SCRAPE_INTERVAL
export PROM_EVAL_INTERVAL
export PROM_RETENTION
export ALERT_CPU_HIGH_THRESHOLD
export PROMETHEUS_URL
export GRAFANA_ADMIN_USER
export GRAFANA_ADMIN_PASSWORD

ENVSUBST_PROM_VARS='${PROM_SCRAPE_INTERVAL} ${PROM_EVAL_INTERVAL}'
ENVSUBST_ALERT_VARS='${ALERT_CPU_HIGH_THRESHOLD}'
ENVSUBST_DS_VARS='${PROMETHEUS_URL}'

envsubst "$ENVSUBST_PROM_VARS" < "$PROMETHEUS_TEMPLATE_PATH" > "$PROMETHEUS_CONFIG_PATH"
print_done "rendered $PROMETHEUS_CONFIG_PATH"

envsubst "$ENVSUBST_ALERT_VARS" < "$ALERTS_TEMPLATE_PATH" > "$ALERTS_CONFIG_PATH"
print_done "rendered $ALERTS_CONFIG_PATH"

envsubst "$ENVSUBST_DS_VARS" < "$DATASOURCE_TEMPLATE_PATH" > "$DATASOURCE_CONFIG_PATH"
print_done "rendered $DATASOURCE_CONFIG_PATH"

SCRAPE_CONFIGS="

scrape_configs:
    - job_name: 'prometheus'
      static_configs:
          - targets: ['localhost:9090']

    - job_name: 'cadvisor'
      static_configs:
          - targets: ['cadvisor:8080']
"

if [ "$NODE_EXPORTER_ENABLED" = 'y' ]; then
	SCRAPE_CONFIGS="$SCRAPE_CONFIGS
    - job_name: 'node'
      static_configs:
          - targets: ['node-exporter:9100']
"
fi

if [ "$POSTGRES_EXPORTER_ENABLED" = 'y' ]; then
	SCRAPE_CONFIGS="$SCRAPE_CONFIGS
    - job_name: 'postgres'
      static_configs:
          - targets: ['postgres-exporter:9187']
"
fi

if [ "$NGINX_EXPORTER_ENABLED" = 'y' ]; then
	SCRAPE_CONFIGS="$SCRAPE_CONFIGS
    - job_name: 'nginx'
      static_configs:
          - targets: ['nginx-exporter:9113']
"
fi

if [ "$ELASTICSEARCH_EXPORTER_ENABLED" = 'y' ]; then
	SCRAPE_CONFIGS="$SCRAPE_CONFIGS
    - job_name: 'elasticsearch'
      static_configs:
          - targets: ['elasticsearch-exporter:9114']
"
fi

printf '%s' "$SCRAPE_CONFIGS" >> "$PROMETHEUS_CONFIG_PATH"
print_done "appended scrape_configs to $PROMETHEUS_CONFIG_PATH"


write_env_kv "$MONITORING_ENV" \
	"PROM_SCRAPE_INTERVAL=$PROM_SCRAPE_INTERVAL" \
	"PROM_EVAL_INTERVAL=$PROM_EVAL_INTERVAL" \
	"PROM_RETENTION=$PROM_RETENTION" \
	"ALERT_CPU_HIGH_THRESHOLD=$ALERT_CPU_HIGH_THRESHOLD" \
	"PROMETHEUS_URL=$PROMETHEUS_URL" \
	"NODE_EXPORTER_ENABLED=$NODE_EXPORTER_ENABLED" \
	"POSTGRES_EXPORTER_ENABLED=$POSTGRES_EXPORTER_ENABLED" \
	"NGINX_EXPORTER_ENABLED=$NGINX_EXPORTER_ENABLED" \
	"ELASTICSEARCH_EXPORTER_ENABLED=$ELASTICSEARCH_EXPORTER_ENABLED"

write_env_kv "$MONITORING_ENV" \
	"GF_SECURITY_ADMIN_USER=$GRAFANA_ADMIN_USER" \
	"GF_SECURITY_ADMIN_PASSWORD=$GRAFANA_ADMIN_PASSWORD"

print_done "wrote $MONITORING_ENV"

printf "\n"
print_info "Image monitoring setup summary"
printf "  Prometheus    scrape=%s eval=%s retention=%s\n" "$PROM_SCRAPE_INTERVAL" "$PROM_EVAL_INTERVAL" "$PROM_RETENTION"
printf "  Alerts        HostHighCpu>%s%%\n" "$ALERT_CPU_HIGH_THRESHOLD"
printf "  Exporters     node=%s postgres=%s nginx=%s elasticsearch=%s\n" \
	"$NODE_EXPORTER_ENABLED" "$POSTGRES_EXPORTER_ENABLED" "$NGINX_EXPORTER_ENABLED" "$ELASTICSEARCH_EXPORTER_ENABLED"
