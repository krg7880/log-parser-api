export COMPOSE_DOCKER_CLI_BUILD = 1
export DOCKER_BUILDKIT = 1

.PHONY: all test clean

build:
	docker-compose -p pager -f docker-compose.yaml build

test:
	docker-compose -p pager -f docker-compose.yaml -f test/test.yaml run service-wait
	docker-compose -p pager -f docker-compose.yaml -f test/test.yaml run test

up:
	docker-compose -p pager -f docker-compose.yaml -f test/test.yaml run service-wait
	docker-compose -p pager -f docker-compose.yaml -f test/test.yaml up api
	docker-compose -p pager -f docker-compose.yaml -f test/test.yaml down

dev:
	docker-compose -p pager -f docker-compose.yaml -f test/test.yaml -f test/dev.yaml run service-wait
	docker-compose -p pager -f docker-compose.yaml -f test/test.yaml -f test/dev.yaml up test

down:
	docker-compose -p pager -f docker-compose.yaml -f test/test.yaml down


