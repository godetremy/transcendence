#=================================================================#
#                       PROJECT VARIABLES                         #
#=================================================================#
PROJECT_NAME			= Transcendence
COMPOSE_DEV_FILE		= docker/dev/docker-compose.dev.yaml
COMPOSE_PROD_FILE		= docker/prod/docker-compose.prod.yaml

#=================================================================#
#                      COMPOSE COMMANDS                           #
#=================================================================#
COMPOSE_DEV				= docker compose -f $(COMPOSE_DEV_FILE)
COMPOSE_PROD			= docker compose -f $(COMPOSE_PROD_FILE)

#=================================================================#
#                           COLORS                                #
#=================================================================#
GREEN					= \033[0;32m
YELLOW					= \033[0;33m
RED						= \033[0;31m
BLUE					= \033[0;34m
RESET					= \033[0m

#=================================================================#
#                            RULES                                #
#=================================================================#

all: help

dev:
	@echo "$(BLUE)Starting $(PROJECT_NAME) in development mode...$(RESET)"
	@$(COMPOSE_DEV) up --build -d

prod:
	@echo "$(BLUE)Starting $(PROJECT_NAME) in production mode...$(RESET)"
	@$(COMPOSE_PROD) up --build -d

down-dev:
	@echo "$(YELLOW)Stopping dev environments...$(RESET)"
	@echo "$(BLUE)Note: volumes are preserved. Use 'make clean' to remove them.$(RESET)"
	-@$(COMPOSE_DEV) down
	@echo "$(GREEN)✓ All environments stopped$(RESET)"

down-prod:
	@echo "$(YELLOW)Stopping prod environments...$(RESET)"
	@echo "$(BLUE)Note: volumes are preserved. Use 'make clean' to remove them.$(RESET)"
	-@$(COMPOSE_PROD) down
	@echo "$(GREEN)✓ All environments stopped$(RESET)"

clean:
	@echo "$(RED)WARNING: This will remove dev volumes$(RESET)"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(YELLOW)Removing containers and volumes...$(RESET)"
	-@$(COMPOSE_DEV) down -v
	@echo "$(GREEN)✓ Cleanup complete$(RESET)"

clean-prod:
	@echo "$(RED)WARNING: This will remove prod volumes$(RESET)"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(YELLOW)Removing containers and volumes...$(RESET)"
	-@$(COMPOSE_PROD) down -v
	@echo "$(GREEN)✓ Cleanup complete$(RESET)"

help:
	@echo "$(GREEN)$(PROJECT_NAME) - Docker Stack Manager$(RESET)"
	@echo ""
	@echo "$(BLUE)Available targets:$(RESET)"
	@echo "  $(GREEN)dev$(RESET)      : Start in development mode (hot reload, debug tools)"
	@echo "  $(GREEN)prod$(RESET)     : Start in production mode (built app, SSL)"
	@echo "  $(GREEN)down-dev$(RESET)     : Stop dev containers"
	@echo "  $(GREEN)down-prod$(RESET)     : Stop prod containers"
	@echo "  $(GREEN)clean-dev$(RESET)    : Stop + remove volumes"
	@echo "  $(GREEN)clean-prod$(RESET)    : Stop + remove volumes"
	@echo "  $(GREEN)help$(RESET)     : Show this help message"
	@echo ""

.PHONY: all dev prod down-dev down-prod clean-dev clean-prod help