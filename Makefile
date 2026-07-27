DOCKER					= docker
COMPOSE 				= $(DOCKER) compose

SECRET_FOLDER			= secrets
DOCKER_FOLDER			= docker
DOCKER_FILE				= docker-compose.yml
DEV_FOLDER				= $(DOCKER_FOLDER)/development
STAGING_FOLDER			= $(DOCKER_FOLDER)/staging
PROD_FOLDER				= $(DOCKER_FOLDER)/production
SCRIPTS_FOLDER			= $(DOCKER_FOLDER)/scripts

BASE_COMPOSE			= $(DOCKER_FOLDER)/$(DOCKER_FILE)
MONITORING_COMPOSE		= $(DOCKER_FOLDER)/monitoring/docker-compose.yml
NODE_COMPOSE			= $(DOCKER_FOLDER)/node/docker-compose.yml

COMPOSE_DEV				= -f $(BASE_COMPOSE) -f $(DEV_FOLDER)/$(DOCKER_FILE) --env-file $(DEV_FOLDER)/$(SECRET_FOLDER)/.env
COMPOSE_STAGING			= -f $(BASE_COMPOSE) -f $(STAGING_FOLDER)/$(DOCKER_FILE) -f $(MONITORING_COMPOSE) --env-file $(STAGING_FOLDER)/$(SECRET_FOLDER)/.env
COMPOSE_PROD			= -f $(BASE_COMPOSE) -f $(PROD_FOLDER)/$(DOCKER_FILE) -f $(MONITORING_COMPOSE) --env-file $(PROD_FOLDER)/$(SECRET_FOLDER)/.env

init-dev: env
	npm i
	make dev
	make database
	npm run dev

init-staging: env
	npm i
	make staging
	make database

init-prod: env
	npm i
	make prod
	make database

env:
	@bash $(SCRIPTS_FOLDER)/generate_environnement.sh

monitoring:
	@bash $(SCRIPTS_FOLDER)/generate_monitoring.sh

database:
	@bash $(SCRIPTS_FOLDER)/database_init.sh

dev:
	@$(COMPOSE) $(COMPOSE_DEV) up --build -d

down-dev:
	@$(COMPOSE) $(COMPOSE_DEV) down

clean-dev:
	@echo "WARNING: This will remove dev volumes"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@$(COMPOSE) $(COMPOSE_DEV) down -v

staging:
	@$(COMPOSE) $(COMPOSE_STAGING) up --build -d

down-staging:
	@$(COMPOSE) $(COMPOSE_STAGING) down

clean-staging:
	@echo "WARNING: This will remove stagin volumes"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@$(COMPOSE) $(COMPOSE_STAGING) down -v

prod:
	@$(COMPOSE) $(COMPOSE_PROD) up --build -d

down-prod:
	@$(COMPOSE) $(COMPOSE_PROD) down

clean-prod:
	@echo "WARNING: This will remove prod volumes"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@$(COMPOSE) $(COMPOSE_PROD) down -v

fclean: clean-dev clean-staging clean-prod
	@echo "Pruning Docker system, images, and volumes..."
	@docker system prune -a --volumes -f

.PHONY: init-dev init-staging init-prod env monitoring database dev staging prod down-dev clean-dev down-staging clean-staging down-prod clean-prod fclean
