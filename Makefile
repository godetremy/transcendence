#=================================================================#
#                       PROJECT VARIABLES                         #
#=================================================================#
PROJECT_NAME            = Transcendence
COMPOSE                 = docker compose
BASE                    = docker/compose.yaml
COMPOSE_DEV_FILE        = docker/development/compose.dev.yaml
COMPOSE_STAGING_FILE    = docker/staging/compose.staging.yaml
COMPOSE_PROD_FILE       = docker/production/compose.prod.yaml

#=================================================================#
#                      COMPOSE COMMANDS                           #
#=================================================================#
COMPOSE_DEV             = --env-file docker/development/secrets/.env -f $(BASE) -f $(COMPOSE_DEV_FILE)
COMPOSE_STAGING         = --env-file docker/staging/secrets/.env -f $(BASE) -f $(COMPOSE_STAGING_FILE)
COMPOSE_PROD            = --env-file docker/production/secrets/.env -f $(BASE) -f $(COMPOSE_PROD_FILE)

DEV_ENV                 = docker/development/secrets/.env
DEV_CERT                = docker/development/certificates/certificate.pem

#=================================================================#
#                           COLORS                                #
#=================================================================#
GREEN                   = \033[0;32m
YELLOW                  = \033[0;33m
RED                     = \033[0;31m
BLUE                    = \033[0;34m
RESET                   = \033[0m

#=================================================================#
#                            RULES                                #
#=================================================================#

all: help

env:
	@bash ./docker/scripts/generate_environnement.sh

certs:
	@bash ./docker/scripts/generate_development_certificates.sh

migrate:
	@echo "$(BLUE)Applying Prisma migrations...$(RESET)"
	@npx dotenv -e $(DEV_ENV) -- npx prisma migrate dev

dev:
	@$(COMPOSE) $(COMPOSE_DEV) up --build --watch

staging:
	@echo "$(RED)Je l'ai pas fait ça ne marche pas.$(RESET)"

prod:
	@echo "$(RED)Je l'ai pas fait ça ne marche pas.$(RESET)"

down-dev:
	@$(COMPOSE) $(COMPOSE_DEV) down

clean-dev:
	@echo "$(RED)WARNING: This will remove dev volumes$(RESET)"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@$(COMPOSE) $(COMPOSE_DEV) down -v

fclean: clean-dev
	@echo "$(YELLOW)Pruning Docker system, images, and volumes...$(RESET)"
	@docker system prune -a --volumes -f


help:
	@echo "$(GREEN)$(PROJECT_NAME) - Docker Stack Manager$(RESET)"
	@echo ""
	@echo "$(BLUE)Available targets:$(RESET)"
	@echo "  $(GREEN)env$(RESET)       : Generate environment files with Postgres variables"
	@echo "  $(GREEN)certs$(RESET)     : Generate development certificates (after env)"
	@echo "  $(GREEN)migrate$(RESET)   : Apply Prisma migrations on the dev database"
	@echo "  $(GREEN)dev$(RESET)	   : Start dev (hot reload + nginx conf watch)"
	@echo "  $(GREEN)staging$(RESET)   : Start staging (detached)"
	@echo "  $(GREEN)prod$(RESET)      : Start production (detached)"
	@echo "  $(GREEN)down-dev$(RESET)  : Stop dev containers"
	@echo "  $(GREEN)clean-dev$(RESET) : Stop dev containers and remove volumes"
	@echo "  $(GREEN)fclean$(RESET)    : Prune Docker system and remove unused images/volumes"
	@echo "  $(GREEN)help$(RESET)      : Show this help message"
	@echo ""

.PHONY: all env certs migrate dev staging prod down-dev clean-dev fclean help
