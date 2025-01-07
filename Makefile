.PHONY: help
help:
	@echo "make help                  Show this help message"
	@echo "make lint                  Run the code linter(s) and print any warnings"
	@echo "make format                Correctly format the code"
	@echo "make acceptance            Run the acceptance tests"
	@echo "make test                  Run the unit tests"
	@echo "                           all pass and generate coverage report"
	@echo "make run                   Run the app's locally"
	@echo "make run-docker            Run the app's Docker image locally"
	@echo "                           This command exists for conveniently testing"
	@echo "                           the Docker image locally in production mode"

.PHONY: lint
lint:
	@npm run lint

.PHONY: format
format:
	@npm run format

.PHONY: acceptance
acceptance:
	@npm run test:acceptance

.PHONY: test
test:
	@npm run test:cov

.PHONY: run
run:
	@npm run start

.PHONY: run-docker
run-docker:
	@docker compose run -p "3000:3000" ddd-nestjs-beer-tap-dispenser-api
