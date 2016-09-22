#!/bin/bash
cd /opt/data/
mysql -h "localhost" -u "$MYSQL_USER" "-p$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "dump.sql"
