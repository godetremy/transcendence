#!/bin/sh
set -eu

ES_URL="http://elasticsearch:9200"
TOKEN_NAME="kibana-$(date +%s)"

RESP="$(curl -fsS -u "elastic:${ELASTIC_PASSWORD}" -X POST "${ES_URL}/_security/service/elastic/kibana/credential/token/${TOKEN_NAME}")"

TOKEN="$(printf '%s' "${RESP}" | sed -n 's/.*"value":"\([^"]*\)".*/\1/p')"

if [ -z "${TOKEN}" ]; then
  echo "Failed to create Kibana service token: ${RESP}" >&2
  exit 1
fi

export ELASTICSEARCH_SERVICEACCOUNTTOKEN="${TOKEN}"
exec /usr/local/bin/kibana-docker
