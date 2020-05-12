#!/bin/sh

#
# Delete database artifacts once we're done with them.
#

function run_myssql_script() {
    /usr/local/mysql/bin/mysql -s -u root --password=$2 < $1 > /dev/null
}

read -s -p "MySQL local instance root password:" password
echo

run_myssql_script ./sql/remove.sql $password
