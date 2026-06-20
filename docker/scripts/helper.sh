#!/usr/bin/env bash

export MKCERT='mkcert'

export DEVELOPMENT_PATH='./docker/development'
export STAGING_PATH='./docker/staging'
export PRODUCTION_PATH='./docker/production'

export DOCKER_SECRETS_PATH='secrets'
export DOCKER_CERTIFICATES_PATH='certificates'

export DEVELOPMENT_ENV="$DEVELOPMENT_PATH/$DOCKER_SECRETS_PATH/.env"
export STAGING_ENV="$STAGING_PATH/$DOCKER_SECRETS_PATH/.env"
export PRODUCTION_ENV="$PRODUCTION_PATH/$DOCKER_SECRETS_PATH/.env"

print_error() {
	 printf "\e[0;1;31mError:\e[0m %s\n" "$1";
}

print_error_and_exit() {
	print_error "$1";
	exit 1;
}

print_warning() {
	 printf "\e[0;1;33mWarning:\e[0m $1\n"
}

print_done() {
	 printf "\e[0;1;32mDone:\e[0m $1\n"
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
        exit 1
    fi
    printf '\n'
}