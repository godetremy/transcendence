#!/bin/sh
set -e

# Generate Kibana certificates (original bootstrap)
/usr/share/kibana/config/bootstrap-generate-kibana-certs.sh

# Import dashboards in background after Kibana is ready
(
	AUTH="${KIBANA_SYSTEM_USERNAME}:${KIBANA_SYSTEM_PASSWORD}"
	KIBANA_URL="https://localhost:5601"

	for i in $(seq 1 60); do
		code=$(curl -sSk -o /dev/null -w "%{http_code}" "${KIBANA_URL}/api/status" -u "${AUTH}" || true)
		if [ "$code" = "200" ] || [ "$code" = "302" ]; then
			echo "[kibana] Kibana is ready, importing dashboards..."
			break
		fi
		sleep 2
	done

	DASHBOARD_DIR="/usr/share/kibana/dashboards"
	if [ -d "$DASHBOARD_DIR" ]; then
		for f in "$DASHBOARD_DIR"/*.ndjson; do
			[ -f "$f" ] || continue
			echo "[kibana] Importing dashboard file: $f"
			curl -sSk -X POST "${KIBANA_URL}/api/saved_objects/_import?overwrite=true" \
				-H "kbn-xsrf: true" \
				-u "${AUTH}" \
				--form "file=@$f" \
				-o /dev/null -w "%{http_code}"
			echo ""
		done
		echo "[kibana] Dashboard import complete."
	else
		echo "[kibana] No dashboard directory found, skipping import."
	fi
) &

# Start Kibana in foreground (PID 1) for graceful shutdown
exec /usr/local/bin/kibana-docker
