#!/bin/sh

#
# Create database artifacts and seed the starter data.
#

function run_myssql_script() {
    /usr/local/mysql/bin/mysql -s -u root --password=$2 < $1 > /dev/null
}

read -s -p "MySQL local instance root password:" password
echo

run_myssql_script ./sql/create.sql $password
run_myssql_script ./sql/seed.sql $password
