#!/bin/bash


# Environment
export NAME_DOCKER="simplereports"
export NAME_DOCKER_DB="simplereports-db"
export SOURCE_DIR="$(dirname $(pwd))/SimpleReports_src"
export DOCKER_BUILD_DIR="$(pwd)"
export DB_HOST="simplereports-db"
export DB_USER="my-user"
export DB_PASSWORD="my-password"
export DB_DBNAME="my-db"
export PORT_NUMBER="80"


# Build Docker
cd simplereports-db
./run.sh
cd ../simplereports
./run.sh


# Download dependencies webapp dependencies
cd $SOURCE_DIR && bower update
cd $SOURCE_DIR/api && compose install
cd $DOCKER_BUILD_DIR


# Load database
sleep 20
docker exec -ti $NAME_DOCKER_DB /opt/data/sqlloader.sh
