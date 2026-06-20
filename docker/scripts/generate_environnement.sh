#!/usr/bin/env bash
source ./docker/scripts/helper.sh;

if [ -f "$DEVELOPMENT_ENV" ]||[ -f "$STAGING_ENV" ]||[ -f "$PRODUCTION_ENV" ]; then
	print_warning 'environment file found.'
    confirm "Reinitialize them ? [Y/n]"
fi

URL=$(read_with_prompt "Which base URL did you want to use" "bde.42angouleme.fr");

export DEVELOPMENT_URL="dev.$URL"
export STAGING_URL="staging.$URL"
export PRODUCTION_URL="$URL"

DATABASE_USERNAME=$(read_with_prompt "Which username do you want to use for your database" "user");
DATABASE_PASSWORD=$(read_password "Which password do you want to use for your database");
DATABASE_NAME=$(read_with_prompt "Which name do you want to use for your database", "transcendence");

export DEVELOPMENT_DATABASE_NAME="dev_$DATABASE_NAME"
export STAGING_DATABASE_NAME="staging_$DATABASE_NAME"
export PRODUCTION_DATABASE_NAME="$DATABASE_NAME"

DEVELOPMENT_SESSION_SECRET=$(read_password "Which secret do you want to use for your session on development deploy");
STAGING_SESSION_SECRET=$(read_password "Which secret do you want to use for your session on staging deploy");
PRODUCTION_SESSION_SECRET=$(read_password "Which secret do you want to use for your session on production deploy");

echo
source ./docker/scripts/request_forty_two_api.sh
echo

BASE_ENV_CONTENT="# This env has been generated automatically.

NEXT_PUBLIC_OAUTH_42_CLIENTID=$FORTYTWO_CLIENT_ID
OAUTH_42_SECRET=$FORTYTWO_CLIENT_SECRET

DATABASE_PORT=5432
DATABASE_USERNAME=$DATABASE_USERNAME
DATABASE_PASSWORD=$DATABASE_PASSWORD
"

DEVELOPMENT_ENV_CONTENT="
$BASE_ENV_CONTENT
DATABASE_NAME=$DEVELOPMENT_DATABASE_NAME

NEXT_PUBLIC_BASE_URL=$DEVELOPMENT_URL

SESSION_SECRET=$DEVELOPMENT_SESSION_SECRET
"

STAGING_ENV_CONTENT="
$BASE_ENV_CONTENT
DATABASE_NAME=$STAGING_DATABASE_NAME

NEXT_PUBLIC_BASE_URL=$STAGING_URL

SESSION_SECRET=$STAGING_SESSION_SECRET
"

PRODUCTION_ENV_CONTENT="
$BASE_ENV_CONTENT
DATABASE_NAME=$PRODUCTION_DATABASE_NAME

NEXT_PUBLIC_BASE_URL=$PRODUCTION_URL

SESSION_SECRET=$PRODUCTION_SESSION_SECRET
"

mkdir -p "$DEVELOPMENT_PATH/$DOCKER_SECRETS_PATH"
printf "%s" "$DEVELOPMENT_ENV_CONTENT" > "$DEVELOPMENT_ENV"
print_done "generated development environment"

mkdir -p "$STAGING_PATH/$DOCKER_SECRETS_PATH"
printf "%s" "$STAGING_ENV_CONTENT" > "$STAGING_ENV"
print_done "generated staging environment"

mkdir -p "$PRODUCTION_PATH/$DOCKER_SECRETS_PATH"
printf "%s" "$PRODUCTION_ENV_CONTENT" > "$PRODUCTION_ENV"
print_done "generated production environment"