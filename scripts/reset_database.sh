#!/bin/sh

#
# Delete, then recreate database artifacts to simplify dev/test.
#

function run_myssql_script() {
    /usr/local/mysql/bin/mysql -s -u root --password=$2 < $1 > /dev/null
}

read -s -p "MySQL local instance root password:" password
echo

run_myssql_script ./sql/cleanup.sql $password
run_myssql_script ./sql/create.sql $password
run_myssql_script ./sql/seed.sql $password
