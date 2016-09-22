#!/bin/bash

# Clean previous container
docker stop $NAME_DOCKER
docker rm $NAME_DOCKER
docker rmi $NAME_DOCKER

# Run Webapp
DB_DOCKER="simplereports-db"
docker build -t $NAME_DOCKER .
docker run -d --name $NAME_DOCKER -v $SOURCE_DIR:/var/www/html -p $PORT_NUMBER:80 --link $NAME_DOCKER_DB:$NAME_DOCKER_DB $NAME_DOCKER
