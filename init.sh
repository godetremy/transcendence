#!/bin/bash

RESET='\e[0m'
BOLD='\e[1m'
RED='\e[0;31m'
GREEN='\e[0;32m'
BLUE='\e[0;34m'

PACKAGE=$(cat package.json)
NAME=$(echo $PACKAGE | jq -r .name)
VERSION=$(echo $PACKAGE | jq -r .version)

EXECUTABLE_REQUIREMENTS=(node npm docker)

check_requirement() {
	printf " ◇  Checking for requirement..."
	for EXECUTABLE in ${EXECUTABLE_REQUIREMENTS[*]}; do
		if ! command -v "$EXECUTABLE" >/dev/null 2>&1; then
			printf "\r$RED ◆$RESET  Cannot find required dependencies $BLUE$BOLD$EXECUTABLE$RESET. You must install them before continue.\n"
			exit 1
		fi
	done
	if [ ! -f /etc/hosts ]; then
		printf "\r$RED ◆$RESET  Missing hosts files. Are you on an UNIX based distribution ?\n"
		exit 1
	fi
	printf "\r$GREEN ◆$RESET  All requirement is checked.\n │\n"
}

get_base_url() {
	printf " ◇  Which base URL did you want to use [bde.42angouleme.fr]: "
	read
	URL=${REPLY:-bde.42angouleme.fr}
	PRODUCTION_URL="https://$URL"
	STAGING_URL="https://staging.$URL"
	DEV_URL="https://dev.$URL"
	tput cuu1
	tput el
	printf "$GREEN ◆$RESET  Selected base URL are set.\n"
	printf " │\n"
	printf " │ Production URL: $PRODUCTION_URL\n"
	printf " │ Staging URL: $STAGING_URL\n"
	printf " │ Developpement URL: $DEV_URL\n"
	printf " │\n"
}

get_database_username() {
	printf " ◇  What username do you want to use for your database [postgres]: "
	read
	DB_USERNAME=${REPLY:-postgres}
	tput cuu1
	tput el
	printf "$GREEN ◆$RESET  Database username set to : $DB_USERNAME.\n"
	printf " │\n"
}

get_database_password() {
	printf " ◇  Set a password for your database [randomly generated]: "
	read -s
	DB_PASSWORD=${REPLY:-$(openssl rand -base64 128 | tr -dc 'A-Za-z0-9' | head -c 64)}
	printf "\r"
	tput el
	printf "$GREEN ◆$RESET  Database password set.\n"
	printf " │\n"
}

get_database_table_name() {
	printf " ◇  What name do you want to use for your database table [bde_data]: "
	read
	DB_PRODUCTION_TABLE=${REPLY:-bde_data}
	DB_STAGING_TABLE="$DB_PRODUCTION_TABLE""_staging"
	DB_DEV_TABLE="$DB_PRODUCTION_TABLE""_dev"
	tput cuu1
	tput el
	printf "$GREEN ◆$RESET  Database tables name set.\n"
	printf " │\n"
	printf " │ Production table name: $DB_PRODUCTION_TABLE\n"
	printf " │ Staging table name: $DB_STAGING_TABLE\n"
	printf " │ Developpement table name: $DB_DEV_TABLE\n"
	printf " │\n"
}

get_session_secret() {
	printf " ◇  Set a secret for your session [randomly generated]: "
	read -s
	SESSION_SECRET=${REPLY:-$(openssl rand -base64 32)}
	printf "\r"
	tput el
	printf "$GREEN ◆$RESET  Session secret set.\n"
	printf " │\n"
}

echo
echo " ┌ Welcome to $NAME! (v$VERSION)"
echo " │"
check_requirement
get_base_url
get_database_username
get_database_password
get_database_table_name
get_session_secret
echo " └"
