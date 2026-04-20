#!/bin/sh
# Bootstrap script for Elasticsearch ILM policies

set -e

ELASTICSEARCH_HOST="${ELASTICSEARCH_HOST:-http://elasticsearch:9200}"
ELASTIC_USER="${ELASTIC_USER:-elastic}"
ELASTIC_PASSWORD="${ELASTIC_PASSWORD:-changeme123!@}"

echo "Waiting for Elasticsearch to be ready..."
until curl -s -u "$ELASTIC_USER:$ELASTIC_PASSWORD" "$ELASTICSEARCH_HOST" > /dev/null; do
  echo "Elasticsearch not ready yet, waiting..."
  sleep 5
done

echo "Creating ILM policy for logs..."
curl -X PUT "$ELASTICSEARCH_HOST/_ilm/policy/logs-policy" \
  -H "Content-Type: application/json" \
  -u "$ELASTIC_USER:$ELASTIC_PASSWORD" \
  -d '{
    "policy": "logs-policy",
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
  }'

echo "ILM policy created successfully"
