#!/bin/bash

# Configuration
INTERVAL_SECONDS=5
TIMEOUT_SECONDS=5       # in seconds
RETRIES=3
START_PERIOD_SECONDS=40  # in seconds, time before counting retries, but where script can still exit on a positive check

# Health check function
check_health() {
  local timeout_seconds=$1
  timeout $timeout_seconds /opt/mssql-tools/bin/sqlcmd -U sa -P "$MSSQL_SA_PASSWORD" -Q "SELECT 1" -b -o /dev/null
  return $?
}

retry_count=0
SECONDS=0 # magic bash variable that counts time since last set. a.k.a time since started
while [[ $retry_count -lt $RETRIES ]]; do
    check_health $TIMEOUT_SECONDS
    status=$?

    # If the health check is successful, exit with status 0
    if [[ $status -eq 0 ]]; then
        exit 0
    fi

    sleep $INTERVAL_SECONDS

    # If the health check fails during the start period, don't count it towards retries
    if [[ $SECONDS -lt $START_PERIOD_SECONDS ]]; then
        continue
    else
      ((retry_count++))
    fi
done

# If the maximum retries were reached without success, exit with status 1
exit 1
