# Early Learning Childcare Centre
## Data Management Application

## Development

1. Rename `db/sapassword.env.sample` to `db/sapassword.env` and set the `MSSQL_SA_PASSWORD` variable.

2. Create a `src/api/.env.development` file with the following content:

```bash
VUE_APP_FRONTEND_URL=http://localhost:8080
VUE_APP_AUTH_DOMAIN=https://dev-0tc6bn14.eu.auth0.com
VUE_APP_AUTH_CLIENTID=9LYlWVby1DLUu7SDUiCcvorVXqAlCMYs
VUE_APP_AUTH_AUDIENCE=testing

AUTH0_AUDIENCE=testing
AUTH0_DOMAIN=https://dev-0tc6bn14.eu.auth0.com/

APPLICATION_NAME=ELCC Data Management

DB_USER=sa
DB_PASS=DevPwd99!
DB_HOST=localhost
DB_NAME=ELCC
DB_PORT=1433
```

Reuse the `db/sapassword.env` -> `MSSQL_SA_PASSWORD` value for the `DB_PASS`.

TODO: figure out what other environment variables go where, and in which files.

3. Boot the database via

```bash
docker compose -f ./docker-compose.dev.yml up
```

4. After the database has booted, connect to the `sqlcmd` terminal.
```bash
docker compose -f ./docker-compose.dev.yml exec -it db /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P DevPwd99!
```

You will see `1>`, now create the `ELCC` database via
```mssql
CREATE DATABASE ELCC
GO
```

To list the databases, and check that ELCC was created you can use:
```msql
SELECT NAME FROM SYS.DATABASES
GO
```

> NOTE: you need to type `GO`/`go` separately from the mssql commands. It acts like `;` in other databases languages.

5. You can now boot and connect to the back-end via

```bash
cd ./src/api
npm install
npm run start
```

6. Run the seed migrations go to http://localhost:3000/api/migrate/up.


7. Boot the front-end via

```bash
cd ./src/web
npm install
npm run start
```

8. You can go to the front-end at http://localhost:8080.
