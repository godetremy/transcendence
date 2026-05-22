#!/bin/bash
set -euo pipefail

KIBANA_URL="https://kibana:5601/kibana"
AUTH="${KIBANA_SYSTEM_USERNAME}:${KIBANA_SYSTEM_PASSWORD}"
DASHBOARD_DIR="/usr/share/kibana/dashboards"

wait_for_kibana() {
    for i in $(seq 1 60); do
        code=$(curl -sSk -o /dev/null -w "%{http_code}" "${KIBANA_URL}/api/status" -u "${AUTH}" || true)
        if [ "$code" = "200" ] || [ "$code" = "302" ]; then
            echo "Kibana is ready."
            return 0
        fi
        echo "Waiting for Kibana... ($i/60)"
        sleep 2
    done
    echo "ERROR: Kibana not ready after timeout" >&2
    exit 1
}

import_ndjson() {
    local file="$1"
    echo "Importing dashboard file: $file"
    curl -sSk -X POST "${KIBANA_URL}/api/saved_objects/_import?overwrite=true" \
        -H "kbn-xsrf: true" \
        -u "${AUTH}" \
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
