#!/usr/bin/env bash
source "./docker/scripts/helper.sh"

DOCKER_STATUS="$(docker inspect $(docker compose -f docker/docker-compose.yml -f docker/development/docker-compose.yml ps -q postgres 2>/dev/null) --format '{{.State.Health.Status}}' 2>/dev/null)"
if [ "$DOCKER_STATUS" != "healthy" ]; then
  print_warning 'database not ready. Waiting to be ready...'

  
  while [ "$DOCKER_STATUS" != "healthy" ]; do
	sleep 2;
	DOCKER_STATUS="$(docker inspect $(docker compose -f docker/docker-compose.yml -f docker/development/docker-compose.yml ps -q postgres 2>/dev/null) --format '{{.State.Health.Status}}' 2>/dev/null)"
  done
fi

if [ -d "$PRISMA_MIGRATION_FOLDER" ]; then
	print_warning 'database migration found.'
    confirm "Reinitialize databse ? All data will be lost. [Y/n]"
	rm -rf $PRISMA_MIGRATION_FOLDER
	yes | npx prisma migrate reset --force
fi

npx prisma generate
echo | npx prisma migrate dev

