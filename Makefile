export COMPOSE_DOCKER_CLI_BUILD = 1
export DOCKER_BUILDKIT = 1

build:
	docker-compose -p pager -f test/test.yaml build
	# --force-rm

test: build
	docker-compose -p pager -f test/test.yaml run service-wait
	docker-compose -p pager -f test/test.yaml run test

down:
	docker-compose -p pager -f test/test.yaml down


