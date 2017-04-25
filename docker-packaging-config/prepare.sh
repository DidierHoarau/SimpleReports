#!/bin/bash

set -e

yarn install

rm -fr ${PACKAGING_CONFIG}/dist
mkdir -p ${PACKAGING_CONFIG}/dist
cp -R ${PROJECT_DIR}/src ${PACKAGING_CONFIG}/dist

cd ${PACKAGING_CONFIG}/dist/src
bower update

cd ${PACKAGING_CONFIG}/dist/src/api
composer install
