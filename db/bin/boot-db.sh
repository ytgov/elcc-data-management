#!/bin/bash

# Start SQL Server in the background
/opt/mssql/bin/sqlservr > /dev/null &
SQLSERVR_PID=$!

# Run initialization pipeline
cd /usr/src/db

./initializers/0001-wait-for-service.sh && \
  ./initializers/0002-initialize-database.sh

initialization_pipeline_status=$?
if [ $initialization_pipeline_status -ne 0 ]; then
  echo "Killing the SQL Server, as initialization pipeline failed with exit code $initialization_pipeline_status"
  kill -TERM $SQLSERVR_PID
  exit 1
fi

# Bring SQL Server to the foreground
wait $SQLSERVR_PID
