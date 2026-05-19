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

es_api POST "/_security/user/kibana_system/_password" \
	"{\"password\":\"${KIBANA_SYSTEM_PASSWORD}\"}" \
	"Configuring kibana_system password"

es_api PUT "/_ilm/policy/logs-policy" \
	'{"policy":{"phases":{"hot":{"min_age":"0ms","actions":{"rollover":{"max_primary_shard_size":"50gb","max_age":"30d"}}},"warm":{"min_age":"7d","actions":{"set_priority":{"priority":50}}},"delete":{"min_age":"30d","actions":{"delete":{}}}}}}' \
	"Creating ILM policy for logs"
