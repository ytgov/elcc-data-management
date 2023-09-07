#!/bin/sh

# Start the script to run the migrations
cd /usr/src/api

npm run migrate up && \
  npm exec ts-node ./bin/seed.ts

initialization_status=$?
if [ $initialization_status -ne 0 ]; then
  echo "Failed to complete initialization, exit code was $initialization_status"
  exit 1
fi

# Start Express Server
npm run start
