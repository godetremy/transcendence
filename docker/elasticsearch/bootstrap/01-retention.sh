#!/bin/sh
# Bootstrap script for Elasticsearch ILM policies

set -e

ELASTICSEARCH_HOST="${ELASTICSEARCH_HOST:-https://elasticsearch:9200}"
ELASTIC_USER="${ELASTIC_USER:-elastic}"
ELASTIC_PASSWORD="${ELASTIC_PASSWORD:-change-me}"
KIBANA_SYSTEM_PASSWORD="${KIBANA_SYSTEM_PASSWORD:-}"

echo "Waiting for Elasticsearch to be ready..."
until curl -fsSk -u "$ELASTIC_USER:$ELASTIC_PASSWORD" "$ELASTICSEARCH_HOST" > /dev/null; do
  echo "Elasticsearch not ready yet, waiting..."
  sleep 5
done

if [ -z "$KIBANA_SYSTEM_PASSWORD" ]; then
  echo "KIBANA_SYSTEM_PASSWORD is not set"
  exit 1
fi

echo "Configuring kibana_system password..."
HTTP_CODE="$(curl -sSk -o /tmp/kibana-password-response.json -w "%{http_code}" -X POST "$ELASTICSEARCH_HOST/_security/user/kibana_system/_password" \
  -H "Content-Type: application/json" \
  -u "$ELASTIC_USER:$ELASTIC_PASSWORD" \
  -d "{\"password\":\"$KIBANA_SYSTEM_PASSWORD\"}")"

if [ "$HTTP_CODE" -lt 200 ] || [ "$HTTP_CODE" -ge 300 ]; then
  echo "Failed to configure kibana_system password (HTTP $HTTP_CODE)"
  cat /tmp/kibana-password-response.json
  exit 1
fi

echo "Creating ILM policy for logs..."
HTTP_CODE="$(curl -sSk -o /tmp/ilm-policy-response.json -w "%{http_code}" -X PUT "$ELASTICSEARCH_HOST/_ilm/policy/logs-policy" \
  -H "Content-Type: application/json" \
  -u "$ELASTIC_USER:$ELASTIC_PASSWORD" \
  -d '{
    "policy": {
      "phases": {
        "hot": {
          "min_age": "0ms",
          "actions": {
            "rollover": {
              "max_primary_shard_size": "50gb",
              "max_age": "30d"
            }
          }
        },
        "warm": {
          "min_age": "7d",
          "actions": {
            "set_priority": {
              "priority": 50
            }
          }
        },
        "delete": {
          "min_age": "30d",
          "actions": {
            "delete": {}
          }
        }
      }
    }
  }')"

if [ "$HTTP_CODE" -lt 200 ] || [ "$HTTP_CODE" -ge 300 ]; then
  echo "Failed to create ILM policy (HTTP $HTTP_CODE)"
  cat /tmp/ilm-policy-response.json
  exit 1
fi

echo "ILM policy created successfully"
