FROM mcr.microsoft.com/mssql/server:2019-latest

# current user:group => $whoami:$(id -gn) => mssql:root
USER root
RUN mkdir -p /usr/src/db && chown mssql:root /usr/src/db
USER mssql

WORKDIR /usr/src/db

COPY --chown=mssql:root --chmod=+x ./entrypoint.sh ./
COPY --chown=mssql:root --chmod=+x ./initializers ./initializers

ENTRYPOINT ["/usr/src/db/entrypoint.sh"]
