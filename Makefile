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
COMPOSE_BASE			= docker compose -p trans -f $(COMPOSE_FILE)
COMPOSE_DEV				= $(COMPOSE_BASE) -f $(COMPOSE_DEV_FILE)
COMPOSE_PROD			= $(COMPOSE_BASE) -f $(COMPOSE_PROD_FILE)
KIBANA_CERTS_DIR		= docker/kibana/certs
ELASTICSEARCH_CERTS_DIR = docker/elasticsearch/certs

#=================================================================#
#                         DOCKER TOOLS                            #
#=================================================================#
DOCKER					= docker
DOCKER_COMPOSE			= docker compose
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
	@echo "$(BLUE)Starting $(PROJECT_NAME) in development mode...$(RESET)"
	@$(COMPOSE_DEV) up --build -d
	@echo "$(GREEN)✓ Development environment started$(RESET)"

prod:
	@echo "$(BLUE)Starting $(PROJECT_NAME) in production mode...$(RESET)"
	@$(COMPOSE_PROD) up --build -d
	@echo "$(GREEN)✓ Production environment started$(RESET)"

down:
	@echo "$(YELLOW)Stopping all containers...$(RESET)"
	@$(COMPOSE_DEV) down 2>/dev/null || true
	@$(COMPOSE_PROD) down 2>/dev/null || true
	@echo "$(GREEN)✓ All containers stopped$(RESET)"

status:
	@echo "$(BLUE)=== Container Status ====$(RESET)"
	@$(COMPOSE_BASE) ps -a
	@echo ""
	@echo "$(BLUE)=== Memory Usage ====$(RESET)"
	@$(DOCKER_STATS) --no-stream --format "table {{.Name}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.CPUPerc}}" 2>/dev/null || true

ps:
	@echo "$(BLUE)=== Active Containers ====$(RESET)"
	@$(COMPOSE_BASE) ps -a

clean:
	@echo "$(RED)WARNING: This will remove all volumes and certificates (data loss!)$(RESET)"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(YELLOW)Removing containers and volumes...$(RESET)"
	@$(COMPOSE_DEV) down -v 2>/dev/null || true
	@$(COMPOSE_PROD) down -v 2>/dev/null || true
	@echo "$(GREEN)✓ Cleanup complete$(RESET)"

prune:
	@echo "$(RED)WARNING: This will remove all volumes, images, networks, certificates and unused resources (data loss!)$(RESET)"
	@read -p "Continue? [y/N] " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "$(YELLOW)Removing containers and volumes...$(RESET)"
	@$(COMPOSE_DEV) down -v 2>/dev/null || true
	@$(COMPOSE_PROD) down -v 2>/dev/null || true
	@rm -rf $(KIBANA_CERTS_DIR)
	@rm -rf $(ELASTICSEARCH_CERTS_DIR)
	@echo "$(YELLOW)Pruning Docker containers, images, networks, build cache, and unused resources...$(RESET)"
	@$(DOCKER) container prune -f
	@$(DOCKER) image prune -a -f
	@$(DOCKER) network prune -f
	@$(DOCKER) volume prune -f
	@$(DOCKER) builder prune -a -f
	@$(DOCKER) system prune -a -f
	@echo "$(GREEN)✓ Full prune complete$(RESET)"

help:
	@echo "$(GREEN)$(PROJECT_NAME) - Docker Stack Manager$(RESET)"
	@echo ""
	@echo "$(BLUE)Available targets:$(RESET)"
	@echo "  $(GREEN)dev$(RESET)      : Start in development mode (hot reload, vault dev)"
	@echo "  $(GREEN)prod$(RESET)     : Start in production mode (built app, vault persistent)"
	@echo "  $(GREEN)down$(RESET)     : Stop all containers"
	@echo "  $(GREEN)status$(RESET)   : Show container status + memory usage"
	@echo "  $(GREEN)ps$(RESET)       : Show all containers"
	@echo "  $(GREEN)clean$(RESET)    : Stop + remove volumes (DESTRUCTIVE)"
	@echo "  $(GREEN)prune$(RESET)    : Stop + remove volumes, containers, logs + prune images/networks/system (DESTRUCTIVE)"
	@echo "  $(GREEN)help$(RESET)     : Show this help message"
	@echo ""

.PHONY: dev prod down status clean ps help prune
