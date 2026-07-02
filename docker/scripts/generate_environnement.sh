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

POSTGRES_USER=$(read_with_prompt "Which username do you want to use for your database" "user");
POSTGRES_PASSWORD=$(read_password "Which password do you want to use for your database");
POSTGRES_DB=$(read_with_prompt "Which name do you want to use for your database" "transcendence");

GRAFANA_ADMIN_USER=$(read_with_prompt "Which username do you want for the Grafana admin" "admin");
GRAFANA_ADMIN_PASSWORD=$(read_password "Which password do you want for the Grafana admin");

ELASTIC_PASSWORD=$(read_password "Which password do you want for the Elasticsearch 'elastic' user");
KIBANA_PASSWORD=$(read_password "Which password do you want for the Kibana 'kibana_system' user");
ENCRYPTION_KEY=$(openssl rand -hex 32)

export DEVELOPMENT_DATABASE_NAME="dev_$POSTGRES_DB"
export STAGING_DATABASE_NAME="staging_$POSTGRES_DB"
export PRODUCTION_DATABASE_NAME="$POSTGRES_DB"

DEVELOPMENT_SESSION_SECRET=$(read_password "Which secret do you want to use for your session on development deploy");
STAGING_SESSION_SECRET=$(read_password "Which secret do you want to use for your session on staging deploy");
PRODUCTION_SESSION_SECRET=$(read_password "Which secret do you want to use for your session on production deploy");

echo
source ./docker/scripts/request_forty_two_api.sh
echo

BASE_ENV_CONTENT="

NEXT_PUBLIC_OAUTH_42_CLIENTID=$FORTYTWO_CLIENT_ID
OAUTH_42_SECRET=$FORTYTWO_CLIENT_SECRET

POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

ELASTIC_PASSWORD=$ELASTIC_PASSWORD
KIBANA_PASSWORD=$KIBANA_PASSWORD
ENCRYPTION_KEY=$ENCRYPTION_KEY
"

MONITORING_ENV_CONTENT="
GRAFANA_ADMIN_USER=$GRAFANA_ADMIN_USER
GRAFANA_ADMIN_PASSWORD=$GRAFANA_ADMIN_PASSWORD
"

DEVELOPMENT_ENV_CONTENT="
$BASE_ENV_CONTENT
POSTGRES_DB=$DEVELOPMENT_DATABASE_NAME

NEXT_PUBLIC_BASE_URL=$DEVELOPMENT_URL

SESSION_SECRET=$DEVELOPMENT_SESSION_SECRET

DATABASE_PORT=5431
ELASTICSEARCH_URL=https://localhost:9200
NODE_EXTRA_CA_CERTS=docker/services/elasticsearch/certs/ca/ca.crt
"

STAGING_ENV_CONTENT="
$BASE_ENV_CONTENT
$MONITORING_ENV_CONTENT
POSTGRES_DB=$STAGING_DATABASE_NAME

NEXT_PUBLIC_BASE_URL=$STAGING_URL

SESSION_SECRET=$STAGING_SESSION_SECRET

ELASTICSEARCH_URL=https://localhost:9200
NODE_EXTRA_CA_CERTS=docker/services/elasticsearch/certs/ca/ca.crt
"

PRODUCTION_ENV_CONTENT="
$BASE_ENV_CONTENT
$MONITORING_ENV_CONTENT
POSTGRES_DB=$PRODUCTION_DATABASE_NAME

NEXT_PUBLIC_BASE_URL=$PRODUCTION_URL

SESSION_SECRET=$PRODUCTION_SESSION_SECRET

ELASTICSEARCH_URL=https://localhost:9200
NODE_EXTRA_CA_CERTS=docker/services/elasticsearch/certs/ca/ca.crt
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