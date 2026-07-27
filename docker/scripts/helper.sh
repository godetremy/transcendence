#!/usr/bin/env bash

export MKCERT='mkcert'

export DEVELOPMENT_PATH='./docker/development'
export STAGING_PATH='./docker/staging'
export PRODUCTION_PATH='./docker/production'
export MONITORING_PATH='./docker/monitoring'

export DOCKER_SECRETS_PATH='secrets'
export DOCKER_CERTIFICATES_PATH='certificates'

export ELASTICSEARCH_CERTS_PATH='./docker/services/elasticsearch/certs'

export DEVELOPMENT_ENV="$DEVELOPMENT_PATH/$DOCKER_SECRETS_PATH/.env"
export STAGING_ENV="$STAGING_PATH/$DOCKER_SECRETS_PATH/.env"
export PRODUCTION_ENV="$PRODUCTION_PATH/$DOCKER_SECRETS_PATH/.env"
export MONITORING_ENV="$MONITORING_PATH/$DOCKER_SECRETS_PATH/.env"

export PRISMA_MIGRATION_FOLDER='src/database/prisma/migrations'

export PROMETHEUS_CONFIG_PATH='./docker/services/prometheus/prometheus.yml'
export PROMETHEUS_TEMPLATE_PATH='./docker/services/prometheus/prometheus.yml.template'
export ALERTS_CONFIG_PATH='./docker/services/prometheus/alerts.yml'
export ALERTS_TEMPLATE_PATH='./docker/services/prometheus/alerts.yml.template'
export DATASOURCE_CONFIG_PATH='./docker/services/grafana/provisioning/datasources/datasource.yml'
export DATASOURCE_TEMPLATE_PATH='./docker/services/grafana/provisioning/datasources/datasource.yml.template'

print_error() {
	 printf "\e[0;1;31mError:\e[0m %s\n" "$1";
}

print_error_and_exit() {
	print_error "$1";
	exit 1;
}

print_warning() {
	 printf "\e[0;1;33mWarning:\e[0m %s\n" "$1"
}

print_done() {
	 printf "\e[0;1;32mDone:\e[0m %s\n" "$1"
}

read_with_prompt() {
	printf "\e[0;1m%s" "$1" >&2;

	if [ ! -z "$2" ]; then
		printf " [%s]" "$2" >&2;
	fi

	printf "\e[0m: " >&2;

	read -r
	echo "${REPLY:-$2}"
}

read_password() {
	RANDOM_PASS=$(openssl rand -base64 128 | tr -dc 'A-Za-z0-9' | head -c 64)
	printf "\e[0;1m%s [randomly generated]\e[0m: " "$1" >&2;
	read -r -s
	printf "\n" >&2;
	echo "${REPLY:-"$RANDOM_PASS"}"
}

confirm() {
	printf "\e[0;1m%s\e[0m: " "$1";
	read -r -n 1;
	if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
    	printf "\n\e[0;90mGiving up...\e[0m\n";
        exit 0
    fi
    printf '\n'
}

read_yes_no() {
	local default="$2"
	local prompt_default
	if [ "$default" = "y" ] || [ "$default" = "Y" ]; then
		prompt_default='Y/n'
	else
		prompt_default='y/N'
	fi
	while true; do
		printf "\e[0;1m%s [%s]\e[0m: " "$1" "$prompt_default" >&2
		read -r REPLY
		REPLY="${REPLY:-$default}"
		case "$REPLY" in
			y|Y|yes|YES|true) echo 'y'; return 0 ;;
			n|N|no|NO|false)  echo 'n'; return 0 ;;
			*) printf "\e[0;90mAnswer y or n.\e[0m\n" >&2 ;;
		esac
	done
}

choose_one() {
	local prompt="$1"
	shift
	local options=("$@")
	local i=1
	printf "\e[0;1m%s\e[0m\n" "$prompt" >&2
	for opt in "${options[@]}"; do
		printf "\e[0;90m  [%d]\e[0m %s\n" "$i" "$opt" >&2
		i=$((i + 1))
	done
	local default="${options[0]}"
	while true; do
		printf "\e[0;1mChoice [1, default '%s']\e[0m: " "$default" >&2
		read -r REPLY
		if [ -z "$REPLY" ]; then
			echo "$default"
			return 0
		fi
		if [[ "$REPLY" =~ ^[0-9]+$ ]] && [ "$REPLY" -ge 1 ] && [ "$REPLY" -le "${#options[@]}" ]; then
			echo "${options[$((REPLY - 1))]}"
			return 0
		fi
		printf "\e[0;90mInvalid choice, pick between 1 and %d.\e[0m\n" "${#options[@]}" >&2
	done
}

read_default_from_file() {
	local file="$1"
	local key="$2"
	local fallback="$3"
	if [ -f "$file" ]; then
		local existing
		existing=$(grep -E "^${key}=" "$file" 2>/dev/null | tail -n1 | cut -d= -f2-)
		if [ -n "$existing" ]; then
			echo "$existing"
			return 0
		fi
	fi
	echo "$fallback"
}

write_env_kv() {
	local file="$1"
	shift
	mkdir -p "$(dirname "$file")"
	[ -f "$file" ] || : > "$file"
	for kv in "$@"; do
		local key="${kv%%=*}"
		local value="${kv#*=}"
		if grep -qE "^${key}=" "$file"; then
			local escaped_value
			escaped_value=$(printf '%s' "$value" | sed -e 's/[\\&]/\\&/g' -e 's/[/]/\\&/g')
			sed -i -E "s|^${key}=.*|${key}=${escaped_value}|" "$file"
		else
			printf '%s=%s\n' "$key" "$value" >> "$file"
		fi
	done
}

print_info() {
	printf "\e[0;1;36mInfo:\e[0m %s\n" "$1"
}