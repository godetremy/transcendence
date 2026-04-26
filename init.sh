#!/bin/bash

set -a
source .env
set +a

echo "## DATABASE_URL" >> .env
echo DATABASE_URL="postgres://$USER_POSTGRES:$PASSWORD_POSTGRES@$HOST:$PORT_POSTGRES/$DB_NAME_POSTGRES" >> .env

if ! docker ps | grep -q "$DB_NAME_POSTGRES" ; then
	echo "[Docker] The database $DB_NAME_POSTGRES not installed."
	echo "[Docker] installing Postgres..."
	if docker ps | grep -q  "$PORT_POSTGRES" ; then
		echo "[Docker]Error port $PORT_POSTGRES used :"
		echo -n "- "
		docker ps | grep -q  "$PORT_POSTGRES"
		exit 1
	fi
	docker compose up --build -d > /dev/null
else
	echo "[Docker] The database $DB_NAME_POSTGRES is install."
fi

if npm --version > /dev/null ; then
	echo "[Npm] is install"
else
	echo "[Npm] is not install"
	sudo apt update && sudo apt install nodejs npm -y
fi

echo "[Npm] init project"
npm i > /dev/null
echo "[Prisma] Reset data"
npx prisma migrate reset --force
echo "[Prisma] Generate data"
npx prisma generate
echo "[Prisma] Migrate data"
npx prisma migrate dev
echo "[Prisma] lauch server"
npm run dev