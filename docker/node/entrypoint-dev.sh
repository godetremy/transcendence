#!/bin/sh
set -e

if [ ! -f /home/node/app/node_modules/.bin/next ]; then
	echo "[dev] Seeding node_modules from image backup..."
	rm -rf /home/node/app/node_modules/* 2>/dev/null || true
	cp -r /home/node/node_modules_backup/. /home/node/app/node_modules/
fi

if [ -f /home/node/app/src/database/prisma/schema.prisma ]; then
	echo "[dev] Applying Prisma migrations..."
	npx prisma migrate deploy --schema=/home/node/app/src/database/prisma/schema.prisma
fi

exec "$@"
