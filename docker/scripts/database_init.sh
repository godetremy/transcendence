#!/usr/bin/env bash
source "./docker/scripts/helper.sh"

docker compose -f docker/docker-compose.yml -f docker/development/docker-compose.yml --env-file docker/development/secrets/.env up -d --wait postgres

if [ -d "$PRISMA_MIGRATION_FOLDER" ]; then
	print_warning 'database migration found.'
    confirm "Reinitialize databse ? All data will be lost. [Y/n]"
	rm -rf $PRISMA_MIGRATION_FOLDER
	yes | npx prisma migrate reset --force
fi

npx prisma generate
echo | npx prisma migrate dev

