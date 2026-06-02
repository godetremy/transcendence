#!/bin/bash
set -euo pipefail

# shellcheck source=/opt/wait-utils.sh
source /opt/wait-utils.sh

bash /scripts/00-generate-certs.sh
chown -R 1000:0 /usr/share/elasticsearch/data /usr/share/elasticsearch/config/certs /usr/share/elasticsearch/logs

su elasticsearch -s /bin/bash -c 'export PATH="/usr/share/elasticsearch/bin:$PATH" && /usr/local/bin/docker-entrypoint.sh elasticsearch' &
ES_PID=$!

# Wait for Elasticsearch API to be reachable before running retention setup
wait_for_http "https://127.0.0.1:9200/_cluster/health" 120 200 \
	-k -u "${ELASTIC_USERNAME}:${ELASTIC_PASSWORD}" || true

bash /scripts/01-retention.sh || echo "WARNING: ES retention setup failed, continuing"
wait "$ES_PID"
