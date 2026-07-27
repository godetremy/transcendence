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

SUMUP_API_KEY=$(read_with_prompt "Enter your Sumup key");
SUMUP_MERCHANT_CODE=$(read_with_prompt "Enter your Sumup marchant code");


export ELASTIC_PASSWORD="$ELASTIC_PASSWORD"
export ELASTIC_USER="elastic"
export ENCRYPTION_KEY="$ENCRYPTION_KEY"

echo
source ./docker/scripts/request_forty_two_api.sh
echo

BASE_ENV_CONTENT="

NEXT_PUBLIC_OAUTH_42_CLIENTID=$FORTYTWO_CLIENT_ID
OAUTH_42_SECRET=$FORTYTWO_CLIENT_SECRET

POSTGRES_USER=$POSTGRES_USER
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=$ELASTIC_PASSWORD
KIBANA_PASSWORD=$KIBANA_PASSWORD
ENCRYPTION_KEY=$ENCRYPTION_KEY

SUMUP_API_KEY=$SUMUP_API_KEY
SUMUP_MERCHANT_CODE=$SUMUP_MERCHANT_CODE

ELASTICSEARCH_PASSWORD=$KIBANA_PASSWORD
XPACK_SECURITY_ENCRYPTIONKEY=$ENCRYPTION_KEY
XPACK_ENCRYPTEDSAVEDOBJECTS_ENCRYPTIONKEY=$ENCRYPTION_KEY
XPACK_REPORTING_ENCRYPTIONKEY=$ENCRYPTION_KEY
ELASTICSEARCH_URL=https://localhost:9200
NODE_EXTRA_CA_CERTS=certs/ca.crt
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

POSTGRES_HOST=localhost
DATABASE_PORT=5431
"

STAGING_ENV_CONTENT="
$BASE_ENV_CONTENT
$MONITORING_ENV_CONTENT
POSTGRES_DB=$STAGING_DATABASE_NAME
DATABASE_PORT=5432
DATABASE_PORT_DOCKER=5431
POSTGRES_HOST=postgres

NEXT_PUBLIC_BASE_URL=$STAGING_URL

SESSION_SECRET=$STAGING_SESSION_SECRET
"

PRODUCTION_ENV_CONTENT="
$BASE_ENV_CONTENT
$MONITORING_ENV_CONTENT
POSTGRES_DB=$PRODUCTION_DATABASE_NAME
DATABASE_PORT=5432
DATABASE_PORT_DOCKER=5431
POSTGRES_HOST=postgres

NEXT_PUBLIC_BASE_URL=$PRODUCTION_URL

SESSION_SECRET=$PRODUCTION_SESSION_SECRET
"

MONITORING_ENV_CONTENT="
DATA_SOURCE_NAME=postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres:5432/$POSTGRES_DB

ES_USERNAME=elastic
ES_PASSWORD=$ELASTIC_PASSWORD

GF_SECURITY_ADMIN_USER=$GRAFANA_ADMIN_USER
GF_SECURITY_ADMIN_PASSWORD=$GRAFANA_ADMIN_PASSWORD
GF_SERVER_ROOT_URL=https://grafana.$DEVELOPMENT_DATABASE_NAME
GF_USERS_ALLOW_SIGN_UP='false'
GF_AUTH_ANONYMOUS_ENABLED='false'
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

mkdir -p "$MONITORING_PATH/$DOCKER_SECRETS_PATH"
printf "%s" "$MONITORING_ENV_CONTENT" > "$MONITORING_ENV"
print_done "generated monitoring environment"

envsubst < ./docker/services/filebeat/filebeat.yml.template | sudo tee ./docker/services/filebeat/filebeat.yml > /dev/null

sudo chown root:root ./docker/services/filebeat/filebeat.yml
sudo chmod 644 ./docker/services/filebeat/filebeat.yml

envsubst < ./docker/services/kibana/kibana.yml.template > ./docker/services/kibana/kibana.yml