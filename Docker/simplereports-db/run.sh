#!/bin/bash

# Clean previous container
docker stop $NAME_DOCKER_DB
docker rm $NAME_DOCKER_DB
docker rmi $NAME_DOCKER_DB

# Run
docker build -t $NAME_DOCKER_DB .
docker run -d --name $NAME_DOCKER_DB -h $DB_HOST \
           -e "MYSQL_RANDOM_ROOT_PASSWORD=1" \
           -e "MYSQL_USER=$DB_USER" \
           -e "MYSQL_DATABASE=$DB_DBNAME" \
           -e "MYSQL_PASSWORD=$DB_PASSWORD" \
           $NAME_DOCKER_DB
