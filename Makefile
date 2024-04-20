
SHELL := /bin/bash
.PHONY: help


## Show help
help:
	@echo ''
	@echo 'Usage:'
	@echo "${YELLOW} make ${RESET} ${GREEN}<target> [options]${RESET}"
	@echo ''
	@echo 'Targets:'
	@awk '/^[a-zA-Z\-\_0-9]+:/ { \
    	message = match(lastLine, /^## (.*)/); \
		if (message) { \
			command = substr($$1, 0, index($$1, ":")-1); \
			message = substr(lastLine, RSTART + 3, RLENGTH); \
			printf "  ${YELLOW_S}%-$(TARGET_MAX_CHAR_NUM)s${RESET} %s\n", command, message; \
		} \
	} \
    { lastLine = $$0 }' $(MAKEFILE_LIST)
	@echo ''

## create container for development
dev:
	docker-compose up --build --force-recreate --remove-orphans --detach

## remove container
tear-dev:
	docker-compose down -v

## Start the prod environment
prod:
	docker-compose -f docker-compose.prod.yml up --detach --build --force-recreate --remove-orphans

## Run CI tests.
test:
	docker-compose -f docker-compose.yml up --build --force-recreate --remove-orphans --detach 
	docker-compose -f docker-compose.yml run academy npx prisma migrate dev --name init 
	docker-compose -f docker-compose.yml run academy npx prisma db push
	docker-compose -f docker-compose.yml run academy pnpm test

ifeq (test,$(firstword $(MAKECMDGOALS)))
  TAG_ARGS := $(word 2, $(MAKECMDGOALS))
  $(eval $(TAG_ARGS):;@:)
endif

# COLORS
GREEN  := `tput setaf 2`
YELLOW := `tput setaf 3`
WHITE  := `tput setaf 7`
YELLOW_S := $(shell tput -Txterm setaf 3)
NC := "\e[0m"
RESET  := $(shell tput -Txterm sgr0)

INFO := @bash -c 'printf $(YELLOW); echo "===> $$1"; printf $(NC)' SOME_VALUE
SUCCESS := @bash -c 'printf $(GREEN); echo "===> $$1"; printf $(NC)' SOME_VALUE