#!/bin/bash
set -euo pipefail

# shellcheck source=/scripts/wait-utils.sh
source /scripts/wait-utils.sh

# generate certs if they don't exist yet
/usr/share/kibana/config/bootstrap-generate-kibana-certs.sh

# import dashboards once kibana is actually up
(
	# shellcheck source=/scripts/wait-utils.sh
	source /scripts/wait-utils.sh
	/scripts/import-dashboards.sh
) &

# keep kibana in foreground so docker can stop it cleanly
exec /usr/local/bin/kibana-docker
