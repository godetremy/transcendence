#!/usr/bin/env bash
set -euo pipefail

SETUP_DONE=/tmp/kibana-system-password-set
ES_URL=https://localhost:9200
CA=config/certs/ca/ca.crt

rm -f "$SETUP_DONE"

/usr/local/bin/docker-entrypoint.sh "$@" &
es_pid=$!

stop_elasticsearch() {
	kill -TERM "$es_pid" 2>/dev/null || true
	wait "$es_pid" 2>/dev/null || true
}

trap stop_elasticsearch TERM INT

echo "Waiting for Elasticsearch to accept credentials..."
until curl -fsS --cacert "$CA" -u "elastic:${ELASTIC_PASSWORD}" "$ES_URL" >/dev/null; do
	if ! kill -0 "$es_pid" 2>/dev/null; then
		wait "$es_pid"
		exit $?
	fi
	sleep 5
done

echo "Setting kibana_system password..."
curl -fsS -X POST --cacert "$CA" \
	-u "elastic:${ELASTIC_PASSWORD}" \
	-H "Content-Type: application/json" \
	"$ES_URL/_security/user/kibana_system/_password" \
	-d "{\"password\":\"${KIBANA_PASSWORD}\"}" >/dev/null

touch "$SETUP_DONE"
echo "kibana_system password set"

wait "$es_pid"
