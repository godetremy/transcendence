#!/bin/bash
set -euo pipefail

source /scripts/wait-utils.sh

/usr/share/kibana/config/bootstrap-generate-kibana-certs.sh

source /scripts/wait-utils.sh
/scripts/import-dashboards.sh

exec /usr/local/bin/kibana-docker
