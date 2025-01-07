.PHONY: help
help:
	@echo "make help                  Show this help message"
	@echo "make lint                  Run the code linter(s) and print any warnings"
	@echo "make format                Correctly format the code"
	@echo "make test                  Run the unit tests"
	@echo "                           all pass and generate coverage report"
	@echo "make run                   Run the app's locally"
	@echo "make docker                Make the app's Docker image"
	@echo "make run-docker            Run the app's Docker image locally"
	@echo "                           This command exists for conveniently testing"
	@echo "                           the Docker image locally in production mode"

lint:
	@npm run lint

format:
	@npm run format

test:
	@npm run test:cov

run:
	@npm run start

docker:
	@git archive --format=tar.gz HEAD | docker build -f Dockerfile.${DOCKER_TAG} -t ddd-nestjs-beer-tap-dispenser-api:$(DOCKER_TAG) -

run-docker:
	@docker compose run -p "3000:3000" ddd-nestjs-beer-tap-dispenser-api
