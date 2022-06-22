up:
	docker-compose up -d

down:
	docker-compose down

rebuild:
	docker-compose build --no-cache

back:
	docker-compose exec php8-service bash

composer:
	docker-compose run --rm php8-service composer install

dbcreate:
	docker-compose run --rm php8-service php bin/console d:d:c

dbupdate:
	docker-compose run --rm php8-service php bin/console d:s:u --force

dbrebuild:
	docker-compose run --rm php8-service php bin/console d:d:d --force
	docker-compose run --rm php8-service php bin/console d:d:c
	docker-compose run --rm php8-service php bin/console d:s:u --force

dbfixtures:
	docker-compose run --rm php8-service php bin/console d:f:l
