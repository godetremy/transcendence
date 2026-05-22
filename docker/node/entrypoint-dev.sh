#!/bin/sh
set -e

# If node_modules is missing key binaries (e.g. fresh named volume seeded from host),
# re-seed it from the image backup
if [ ! -f /home/node/app/node_modules/.bin/next ]; then
	echo "[dev] Seeding node_modules from image backup..."
	rm -rf /home/node/app/node_modules/* 2>/dev/null || true
	cp -r /home/node/node_modules_backup/. /home/node/app/node_modules/
fi

exec "$@"
