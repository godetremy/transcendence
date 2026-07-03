#!/bin/sh
set -e

curl -fsS -u "elastic:${ELASTIC_PASSWORD}" \
	-X POST "http://kibana:5601/api/saved_objects/_import?overwrite=true" \
	-H "kbn-xsrf: true" \
	-F file=@/import/logs-dashboard.ndjson
echo "dashboard importe"
