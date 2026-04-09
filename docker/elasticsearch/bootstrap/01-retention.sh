#!/bin/sh
set -eu

ES_URL="http://elasticsearch:9200"
AUTH="elastic:${ELASTIC_PASSWORD}"

curl -fsS -u "${AUTH}" -H "Content-Type: application/json" -X PUT "${ES_URL}/_snapshot/local_fs" -d '
{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/data/snapshots",
    "compress": true
  }
}
'

curl -fsS -u "${AUTH}" -H "Content-Type: application/json" -X PUT "${ES_URL}/_ilm/policy/docker-logs-retention" -d '
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": {
            "max_age": "1d",
            "max_size": "2gb"
          }
        }
      },
      "delete": {
        "min_age": "7d",
        "actions": {
          "delete": {}
        }
      }
    }
  }
}
'

curl -fsS -u "${AUTH}" -H "Content-Type: application/json" -X PUT "${ES_URL}/_index_template/docker-logs-template" -d '
{
  "index_patterns": ["docker-logs-*"],
  "template": {
    "settings": {
      "index.lifecycle.name": "docker-logs-retention"
    }
  },
  "priority": 100
}
'

curl -fsS -u "${AUTH}" -H "Content-Type: application/json" -X PUT "${ES_URL}/_slm/policy/docker-logs-daily" -d '
{
  "schedule": "0 30 2 * * ?",
  "name": "<docker-logs-snap-{now/d}>",
  "repository": "local_fs",
  "config": {
    "indices": ["docker-logs-*"],
    "include_global_state": false
  },
  "retention": {
    "expire_after": "14d",
    "min_count": 5,
    "max_count": 100
  }
}
'

echo "ELK retention and snapshot policies configured"
