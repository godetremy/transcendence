#!/bin/sh
set -eu

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

# Same as es_api but ignores 400 errors (useful for idempotent index creation)
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

# 1. Set kibana_system password
es_api POST "/_security/user/kibana_system/_password" \
	"{\"password\":\"${KIBANA_SYSTEM_PASSWORD}\"}" \
	"Configuring kibana_system password"

# 2. Create ILM policy with rollover
es_api PUT "/_ilm/policy/logs-policy" \
	'{"policy":{"phases":{"hot":{"min_age":"0ms","actions":{"rollover":{"max_primary_shard_size":"1gb","max_age":"7d","max_docs":1000000}}},"warm":{"min_age":"3d","actions":{"set_priority":{"priority":50},"readonly":{}}},"delete":{"min_age":"30d","actions":{"delete":{}}}}}}' \
	"Creating ILM policy for logs"

# 3. Create index template for the transcendence alias
es_api PUT "/_index_template/transcendence-template" \
	'{"index_patterns":["transcendence-*"],"template":{"settings":{"number_of_shards":1,"number_of_replicas":0,"index.lifecycle.name":"logs-policy","index.lifecycle.rollover_alias":"transcendence"},"mappings":{"dynamic_templates":[{"strings_as_keywords":{"match_mapping_type":"string","mapping":{"type":"keyword","ignore_above":1024}}}],"properties":{"@timestamp":{"type":"date"},"service":{"type":"keyword"},"log_level":{"type":"keyword"},"log_type":{"type":"keyword"},"request_id":{"type":"keyword"},"event_type":{"type":"keyword"},"message":{"type":"text"},"app":{"type":"object","dynamic":true}}}},"priority":500,"composed_of":[],"version":1,"_meta":{"description":"Template for transcendence logs with ILM"}}' \
	"Creating index template for transcendence"

# 4. Bootstrap the first write index for the alias
es_api_ignore_400 PUT "/transcendence-000001" \
	'{"aliases":{"transcendence":{"is_write_index":true}}}' \
	"Bootstrapping first transcendence index"

# 5. Create index template for elastic-stack-logs (ES / Kibana / Logstash logs)
es_api PUT "/_index_template/elastic-stack-logs-template" \
	'{"index_patterns":["elastic-stack-logs-*"],"template":{"settings":{"number_of_shards":1,"number_of_replicas":0,"index.lifecycle.name":"logs-policy","index.lifecycle.rollover_alias":"elastic-stack-logs"},"mappings":{"dynamic_templates":[{"strings_as_keywords":{"match_mapping_type":"string","mapping":{"type":"keyword","ignore_above":1024}}}],"properties":{"@timestamp":{"type":"date"},"service":{"type":"keyword"},"log_level":{"type":"keyword"},"log_type":{"type":"keyword"},"message":{"type":"text"},"app":{"type":"object","dynamic":true}}}},"priority":500,"composed_of":[],"version":1,"_meta":{"description":"Template for Elastic Stack component logs"}}' \
	"Creating index template for elastic-stack-logs"

# 6. Bootstrap the first write index for elastic-stack-logs
es_api_ignore_400 PUT "/elastic-stack-logs-000001" \
	'{"aliases":{"elastic-stack-logs":{"is_write_index":true}}}' \
	"Bootstrapping first elastic-stack-logs index"

echo "Elasticsearch setup complete."
