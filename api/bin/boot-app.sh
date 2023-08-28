#!/bin/sh

# Start the script to run the migrations
cd /usr/src/api

npm exec ts-node ./bin/migrate-latest.ts

migration_status=$?
if [ $migration_status -ne 0 ]; then
  echo "Failed to run migrations, exit code was $migration_status"
  exit 1
fi

# Start Express Server
npm run start
