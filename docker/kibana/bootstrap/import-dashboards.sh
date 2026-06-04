#!/bin/bash
set -euo pipefail

# shellcheck source=/scripts/wait-utils.sh
source /scripts/wait-utils.sh

KIBANA_INTERNAL_URL="https://127.0.0.1:5601"
AUTH="${KIBANA_SYSTEM_USERNAME}:${KIBANA_SYSTEM_PASSWORD}"
# need the elastic superuser for the import endpoint
ADMIN_AUTH="${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}"
DASHBOARD_DIR="/usr/share/kibana/dashboards"

wait_for_kibana() {
	if ! wait_for_http "${KIBANA_INTERNAL_URL}/api/status" 120 200; then
		echo "[kibana] ERROR: Kibana never became ready after 120s, aborting dashboard import." >&2
		exit 1
	fi

	# 302 redirect also means kibana is alive
	local code
	code=$(curl -sSk -o /dev/null -w "%{http_code}" "${KIBANA_INTERNAL_URL}/api/status" -u "${AUTH}" 2>/dev/null || true)
	if [ "$code" != "200" ] && [ "$code" != "302" ]; then
		echo "[kibana] ERROR: Kibana status check failed (HTTP ${code}), aborting dashboard import." >&2
		exit 1
	fi
	echo "[kibana] Kibana is ready."
}

import_ndjson() {
	local file="$1"
	echo "[kibana] Importing dashboard file: $file"
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
	echo "[kibana] Dashboard import complete."
else
	echo "[kibana] No dashboard directory found, skipping import."
fi
