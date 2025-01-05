.PHONY: down up test

down:
	docker compose down

up:
	docker compose run -p "3000:3000" ddd-nestjs-beer-tap-dispenser-api

test:
	docker compose run --rm --no-deps ddd-nestjs-beer-tap-dispenser-api npm run test

coverage:
	docker compose run --rm --no-deps ddd-nestjs-beer-tap-dispenser-api npm run test:cov