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

init-dev: env certs
	npm i
	make dev 	
	make database
	npm run dev

env:
	@bash $(SCRIPTS_FOLDER)/generate_environnement.sh

certs:
	@bash $(SCRIPTS_FOLDER)/generate_development_certificates.sh

database:
	@bash $(SCRIPTS_FOLDER)/database_init.sh

dev:
	@$(COMPOSE) -f $(BASE_COMPOSE) -f $(DEV_FOLDER)/$(DOCKER_FILE) --env-file docker/development/secrets/.env up --build -d
 
staging:
	@echo "$(RED)Je l'ai pas fait ça ne marche pas.$(RESET)"

prod:
	@echo "$(RED)Je l'ai pas fait ça ne marche pas.$(RESET)"

down-dev:
	@$(COMPOSE) -f $(BASE_COMPOSE) -f $(DEV_FOLDER)/$(DOCKER_FILE) --env-file docker/development/secrets/.env down

clean-dev:
	@echo "$(RED)WARNING: This will remove dev volumes$(RESET)"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@$(COMPOSE) $(COMPOSE_DEV) down -v

fclean: clean-dev
	@echo "$(YELLOW)Pruning Docker system, images, and volumes...$(RESET)"
	@docker system prune -a --volumes -f

.PHONY: all env certs migrate dev staging prod down-dev clean-dev fclean help
