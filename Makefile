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

COMPOSE_DEV				= -f $(BASE_COMPOSE) -f $(DEV_FOLDER)/$(DOCKER_FILE) -f $(MONITORING_COMPOSE) --env-file $(DEV_FOLDER)/$(SECRET_FOLDER)/.env
COMPOSE_STAGING			= -f $(BASE_COMPOSE) -f $(STAGING_FOLDER)/$(DOCKER_FILE) -f $(NODE_COMPOSE) -f $(MONITORING_COMPOSE) --env-file $(STAGING_FOLDER)/$(SECRET_FOLDER)/.env
COMPOSE_PROD			= -f $(BASE_COMPOSE) -f $(PROD_FOLDER)/$(DOCKER_FILE) -f $(NODE_COMPOSE) -f $(MONITORING_COMPOSE) --env-file $(PROD_FOLDER)/$(SECRET_FOLDER)/.env
.DEFAULT_GOAL := help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "  init-dev      setup de dev et le lance"
	@echo "  env           cree l'env"
	@echo "  certs         cree tous les certs"
	@echo "  database      init la db"
	@echo "  dev           lance le dev"
	@echo "  staging       lance le staging"
	@echo "  prod          lance le prod"
	@echo "  down-dev      stop le dev"
	@echo "  clean-dev     clean le dev"
	@echo "  down-staging  stop le staging"
	@echo "  clean-staging clean le staging"
	@echo "  down-prod     stop le prod"
	@echo "  clean-prod    clean le prod"
	@echo "  fclean        del tout"

init-dev: env certs
	npm i
	make dev
	make database
	npm run dev

env:
	@bash $(SCRIPTS_FOLDER)/generate_environnement.sh

certs:
	@bash $(SCRIPTS_FOLDER)/generate_certificates.sh

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

.PHONY: help init-dev env certs database dev staging prod down-dev clean-dev down-staging clean-staging down-prod clean-prod fclean
