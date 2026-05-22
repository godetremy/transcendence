#=================================================================#
#                       PROJECT VARIABLES                         #
#=================================================================#
PROJECT_NAME			= Transcendence
COMPOSE_FILE			= docker-compose.yaml
COMPOSE_DEV_FILE		= docker-compose.dev.yml
COMPOSE_PROD_FILE		= docker-compose.prod.yml

#=================================================================#
#                      COMPOSE COMMANDS                           #
#=================================================================#
# Project names are defined in each compose file (trans, trans-dev, trans-prod)
COMPOSE_BASE			= docker compose -f $(COMPOSE_FILE)
COMPOSE_DEV				= $(COMPOSE_BASE) -f $(COMPOSE_DEV_FILE)
COMPOSE_PROD			= $(COMPOSE_BASE) -f $(COMPOSE_PROD_FILE)
KIBANA_CERTS_DIR		= docker/kibana/certs
ELASTICSEARCH_CERTS_DIR	= docker/elasticsearch/certs

#=================================================================#
#                         DOCKER TOOLS                            #
#=================================================================#
DOCKER					= docker
DOCKER_STATS			= docker stats

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
	@echo "$(YELLOW)═══════════════════════════════════════════════════════$(RESET)"
	@echo "$(YELLOW)  Switching to DEVELOPMENT mode$(RESET)"
	@echo "$(YELLOW)═══════════════════════════════════════════════════════$(RESET)"
	@echo "$(YELLOW)Stopping production environment if running...$(RESET)"
	-@$(COMPOSE_PROD) down -v --remove-orphans 2>/dev/null || true
	@echo "$(BLUE)Starting $(PROJECT_NAME) in development mode...$(RESET)"
	@$(COMPOSE_DEV) up --build -d
	@echo "$(GREEN)✓ Development environment started$(RESET)"
	@echo "$(BLUE)App:      http://localhost:8080$(RESET)"
	@echo "$(BLUE)Kibana:   http://kibana.localhost:8080$(RESET)"

	@echo "$(BLUE)Vault:    http://vault.localhost:8080/ui$(RESET)"

prod:
	@echo "$(YELLOW)═══════════════════════════════════════════════════════$(RESET)"
	@echo "$(YELLOW)  Switching to PRODUCTION mode$(RESET)"
	@echo "$(YELLOW)═══════════════════════════════════════════════════════$(RESET)"
	@echo "$(YELLOW)Stopping development environment if running...$(RESET)"
	-@$(COMPOSE_DEV) down -v --remove-orphans 2>/dev/null || true
	@echo "$(BLUE)Starting $(PROJECT_NAME) in production mode...$(RESET)"
	@$(COMPOSE_PROD) up --build -d
	@echo "$(GREEN)✓ Production environment started$(RESET)"
	@echo "$(BLUE)App:      https://localhost$(RESET)"
	@echo "$(BLUE)Kibana:   https://kibana.localhost$(RESET)"

	@echo "$(BLUE)Vault:    https://vault.localhost/ui$(RESET)"

down:
	@echo "$(YELLOW)Stopping all environments...$(RESET)"
	-@$(COMPOSE_DEV) down --remove-orphans 2>/dev/null || true
	-@$(COMPOSE_PROD) down --remove-orphans 2>/dev/null || true
	@echo "$(GREEN)✓ All environments stopped$(RESET)"

status:
	@echo "$(BLUE)═══════════════════════════════════════════════════════$(RESET)"
	@echo "$(BLUE)  Dev Environment$(RESET)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════$(RESET)"
	-@$(COMPOSE_DEV) ps -a 2>/dev/null || echo "  (not running)"
	@echo ""
	@echo "$(BLUE)═══════════════════════════════════════════════════════$(RESET)"
	@echo "$(BLUE)  Prod Environment$(RESET)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════$(RESET)"
	-@$(COMPOSE_PROD) ps -a 2>/dev/null || echo "  (not running)"
	@echo ""
	@echo "$(BLUE)═══════════════════════════════════════════════════════$(RESET)"
	@echo "$(BLUE)  Memory Usage$(RESET)"
	@echo "$(BLUE)═══════════════════════════════════════════════════════$(RESET)"
	-@$(DOCKER_STATS) --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.CPUPerc}}" 2>/dev/null || true

ps: status

logs-dev:
	@echo "$(BLUE)=== Dev Logs ====$(RESET)"
	@$(COMPOSE_DEV) logs --tail=100 -f

logs-prod:
	@echo "$(BLUE)=== Prod Logs ====$(RESET)"
	@$(COMPOSE_PROD) logs --tail=100 -f

logs:
	@echo "$(YELLOW)Use 'make logs-dev' or 'make logs-prod' to follow specific environment logs$(RESET)"

clean:
	@echo "$(RED)WARNING: This will remove all volumes and certificates (data loss!)$(RESET)"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(YELLOW)Removing containers and volumes...$(RESET)"
	@$(COMPOSE_DEV) down -v 2>/dev/null || true
	@$(COMPOSE_PROD) down -v 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete$(RESET)"

prune:
	@echo "$(RED)═══════════════════════════════════════════════════════$(RESET)"
	@echo "$(RED)  WARNING: This will DESTROY all project data!$(RESET)"
	@echo "$(RED)  - All containers (dev + prod)$(RESET)"
	@echo "$(RED)  - All volumes (databases, caches, secrets)$(RESET)"
	@echo "$(RED)  - All project images$(RESET)"
	@echo "$(RED)  - All generated certificates$(RESET)"
	@echo "$(RED)  - All unused Docker resources (system-wide)$(RESET)"
	@echo "$(RED)═══════════════════════════════════════════════════════$(RESET)"
	@read -p "Type 'yes' to continue: " confirm && [ "$$confirm" = "yes" ] || exit 1
	@echo ""
	@echo "$(YELLOW)[1/7] Stopping and removing dev environment...$(RESET)"
	-@$(COMPOSE_DEV) down -v --remove-orphans 2>/dev/null || true
	@echo "$(YELLOW)[2/7] Stopping and removing prod environment...$(RESET)"
	-@$(COMPOSE_PROD) down -v --remove-orphans 2>/dev/null || true
	@echo "$(YELLOW)[3/7] Removing project volumes...$(RESET)"
	-@docker volume ls -q --filter "name=trans-" | xargs -r docker volume rm 2>/dev/null || true
	@echo "$(YELLOW)[4/7] Removing project images...$(RESET)"
	-@docker images --filter "reference=transcendence*" --format '{{.ID}}' | xargs -r docker rmi -f 2>/dev/null || true
	-@docker images --filter "dangling=true" --format '{{.ID}}' | xargs -r docker rmi -f 2>/dev/null || true
	@echo "$(YELLOW)[5/7] Removing generated certificates...$(RESET)"
	@rm -rf $(KIBANA_CERTS_DIR) $(ELASTICSEARCH_CERTS_DIR)
	@echo "$(YELLOW)[6/7] Pruning unused Docker resources (volumes, networks, images)...$(RESET)"
	@docker system prune -a --volumes -f
	@echo "$(YELLOW)[7/7] Pruning build cache...$(RESET)"
	@docker builder prune -f
	@echo ""
	@echo "$(GREEN)✓ Full purge complete. All project resources removed.$(RESET)"

help:
	@echo "$(GREEN)$(PROJECT_NAME) - Docker Stack Manager$(RESET)"
	@echo ""
	@echo "$(BLUE)Available targets:$(RESET)"
	@echo "  $(GREEN)dev$(RESET)      : Start in development mode (hot reload, debug tools)"
	@echo "  $(GREEN)prod$(RESET)     : Start in production mode (built app, SSL)"
	@echo "  $(GREEN)down$(RESET)     : Stop all containers"
	@echo "  $(GREEN)status$(RESET)   : Show container status + memory usage"
	@echo "  $(GREEN)ps$(RESET)       : Show all containers"
	@echo "  $(GREEN)logs$(RESET)     : Follow logs from all services"
	@echo "  $(GREEN)clean$(RESET)    : Stop + remove volumes (DESTRUCTIVE)"
	@echo "  $(GREEN)prune$(RESET)    : Stop + remove volumes, images, networks + prune system (DESTRUCTIVE)"
	@echo "  $(GREEN)help$(RESET)     : Show this help message"
	@echo ""

.PHONY: all dev prod down status ps logs clean prune help
