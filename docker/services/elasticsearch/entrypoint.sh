#!/usr/bin/env bash

SETUP_DONE=/tmp/kibana-system-password-set
ES_URL=https://localhost:9200
CA=config/certs/ca/ca.crt

rm -f "$SETUP_DONE"

(
	curl -fsS --retry 120 --retry-delay 5 --retry-connrefused \
		--cacert "$CA" -u "elastic:${ELASTIC_PASSWORD}" "$ES_URL" >/dev/null &&
		curl -fsS -X POST --cacert "$CA" \
			-u "elastic:${ELASTIC_PASSWORD}" \
			-H "Content-Type: application/json" \
			"$ES_URL/_security/user/kibana_system/_password" \
			-d "{\"password\":\"${KIBANA_PASSWORD}\"}" >/dev/null &&
		touch "$SETUP_DONE"
) &

exec /usr/local/bin/docker-entrypoint.sh "$@"
