#!/usr/bin/env bash
source ./docker/scripts/helper.sh;


printf "Now you must create an app on the 42 API, you can learn how to do that here : \nhttps://github.com/godetremy/transcendence/wiki/Comment-connecter-API-de-42-au-services-du-BDE\a\n\n"
printf "\e[0;1m─ Redirect uri (Copy and paste) ──────────────────────────────────────\e[0m\n"
printf "%s/app/api/auth/oauth/fortytwo/authorize\n" "$DEVELOPMENT_URL"
printf "%s/app/api/auth/oauth/fortytwo/authorize\n" "$STAGING_URL"
printf "%s/app/api/auth/oauth/fortytwo/authorize\n" "$PRODUCTION_URL"
printf "\e[0;1m──────────────────────────────────────────────────────────────────────\e[0m\n"
printf "\n"

export FORTYTWO_CLIENT_ID=$(read_with_prompt "Enter your 42 client ID");
export FORTYTWO_CLIENT_SECRET=$(read_with_prompt "Enter your 42 client secret");