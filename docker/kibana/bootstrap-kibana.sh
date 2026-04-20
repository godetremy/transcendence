#!/bin/sh
# Bootstrap script for Kibana

set -e

echo "Starting Kibana..."

# Import kibana config
if [ -f /usr/share/kibana/config/kibana.yml ]; then
  echo "Kibana config imported"
fi

# Start Kibana
exec /usr/local/bin/kibana-docker
