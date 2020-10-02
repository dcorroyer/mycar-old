# How to build a Symfony - Webpack app

## Installation:

You have to clone this repository and make:

    docker-compose up -d

If you have any denied permission, make sudo

The command will download and install docker images to make your containers

When it is done, you'll have these containers

    php74-container
    node-container
    mysql-container
    nginx-container

You can access all your containers with this command:

    docker exec -it **yourcontainer** bash

Now, if you want to create your Symfony 5 app, you have to connect to the php container:

    docker exec -it php74-container bash

In your container, you'll be in your working folder, you just have to create the project (will be built in the app folder):

    composer create-project symfony/website-skeleton .

In the case of Symfony/React app you can install bundles in the container:

    composer req encore
    composer req api

Now your project is up. GREAT !

## Services

You need to use **services** to use php and yarn in your containers and you didn't need to connect any container to use them, stay in your primary folder:

    docker-compose run --rm php74-service php bin/console d:d:c (to create database)
    docker-compose run --rm node-service yarn install (to install nodejs dependencies)
    docker-compose run --rm node-service yarn dev (to run webpack)

A Makefile is up to provide some short commands to help you.

If you can't modify any file in the app folder, you can run this command in the php container:

    chmod -R 777 .
