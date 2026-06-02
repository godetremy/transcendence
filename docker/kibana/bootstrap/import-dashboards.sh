#!/bin/bash
set -euo pipefail

# shellcheck source=/scripts/wait-utils.sh
source /scripts/wait-utils.sh

# Use internal URL for container-side API calls; KIBANA_URL is only for publicBaseUrl
KIBANA_INTERNAL_URL="https://127.0.0.1:5601"
AUTH="${KIBANA_SYSTEM_USERNAME}:${KIBANA_SYSTEM_PASSWORD}"
# elastic superuser is required for saved-objects import API
ADMIN_AUTH="${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}"
DASHBOARD_DIR="/usr/share/kibana/dashboards"

wait_for_kibana() {
	wait_for_http "${KIBANA_INTERNAL_URL}/api/status" 120 200 || true
	# Kibana may redirect (302) when not fully ready, so we also accept 302 as a
	# sign of life, but the strict wait_for_http above waits for 200.
	# Retry with relaxed expected code to avoid false negatives.
	local code
	code=$(curl -sSk -o /dev/null -w "%{http_code}" "${KIBANA_INTERNAL_URL}/api/status" -u "${AUTH}" 2>/dev/null || true)
	if [ "$code" != "200" ] && [ "$code" != "302" ]; then
		echo "ERROR: Kibana not ready after timeout (HTTP ${code})" >&2
		exit 1
	fi
	echo "Kibana is ready."
}

import_ndjson() {
	local file="$1"
	echo "Importing dashboard file: $file"
	curl -sSk -X POST "${KIBANA_INTERNAL_URL}/api/saved_objects/_import?overwrite=true" \
		-H "kbn-xsrf: true" \
		-u "${ADMIN_AUTH}" \
		--form "file=@$file" \
		-o /dev/null -w "%{http_code}"
	echo ""
}

wait_for_kibana

if [ -d "$DASHBOARD_DIR" ]; then
	for f in "$DASHBOARD_DIR"/*.ndjson; do
		[ -f "$f" ] || continue
		import_ndjson "$f"
	done
else
	echo "No dashboard directory found, skipping import."
fi

echo "Dashboard import complete."
