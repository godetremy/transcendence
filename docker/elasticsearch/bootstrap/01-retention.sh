#!/bin/bash
set -euo pipefail

ES_URL="https://elasticsearch:9200"

es_api() {
	method="$1"
	path="$2"
	body="$3"
	desc="$4"
	tmpfile="/tmp/es-response-$(echo "$path" | tr '/' '-').json"

	echo "${desc}..."
	http_code="$(curl -sSk -o "${tmpfile}" -w "%{http_code}" \
		-X "${method}" "${ES_URL}${path}" \
		-H "Content-Type: application/json" \
		-u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
		-d "${body}")"

	if [ "$http_code" -lt 200 ] || [ "$http_code" -ge 300 ]; then
		echo "Failed: ${desc} (HTTP ${http_code})"
		cat "${tmpfile}"
		exit 1
	fi
}

es_api_ignore_400() {
	method="$1"
	path="$2"
	body="$3"
	desc="$4"
	tmpfile="/tmp/es-response-$(echo "$path" | tr '/' '-').json"

	echo "${desc}..."
	http_code="$(curl -sSk -o "${tmpfile}" -w "%{http_code}" \
		-X "${method}" "${ES_URL}${path}" \
		-H "Content-Type: application/json" \
		-u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" \
		-d "${body}")"

	if [ "$http_code" = "400" ]; then
		echo "Skipping: ${desc} already exists (HTTP 400)"
		return 0
	fi

	if [ "$http_code" -lt 200 ] || [ "$http_code" -ge 300 ]; then
		echo "Failed: ${desc} (HTTP ${http_code})"
		cat "${tmpfile}"
		exit 1
	fi
}

es_api POST "/_security/user/kibana_system/_password" \
	"{\"password\":\"${KIBANA_SYSTEM_PASSWORD}\"}" \
	"Configuring kibana_system password"

es_api PUT "/_ilm/policy/logs-policy" \
	"$(cat /scripts/policies/logs-policy.json)" \
	"Creating ILM policy for logs"

es_api PUT "/_index_template/transcendence-template" \
	"$(cat /scripts/templates/transcendence-template.json)" \
	"Creating index template for transcendence"

es_api_ignore_400 PUT "/transcendence-000001" \
	"$(cat /scripts/bootstrap/transcendence-alias.json)" \
	"Bootstrapping first transcendence index"

es_api PUT "/_index_template/elastic-stack-logs-template" \
	"$(cat /scripts/templates/elastic-stack-logs-template.json)" \
	"Creating index template for elastic-stack-logs"

es_api_ignore_400 PUT "/elastic-stack-logs-000001" \
	"$(cat /scripts/bootstrap/elastic-stack-logs-alias.json)" \
	"Bootstrapping first elastic-stack-logs index"

echo "Elasticsearch setup complete."
