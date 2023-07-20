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

5. Install `asdf` using instructions at https://asdf-vm.com/guide/getting-started.html.

6. Install the `nodejs` plugin via and the appropriate nodejs version.

    ```bash
    asdf plugin add nodejs
    asdf install nodejs # installs the version from the .tool-verions file
    ```

    Check that you have the correct version set up by seeing that these two commands match:

    ```bash
    asdf current nodejs
    node -v
    ```

7. You can now boot and connect to the back-end via

    ```bash
    cd ./src/api
    npm install
    npm run start
    ```

8. Run migrations via navigating to http://localhost:3000/api/migrate/up, and refreshing the page once for each migration.

    Response data will look like

    ```js
    {
        "data": [
            [
                {
                    "name": "001_create-users.ts"
                },
                // ... other completed migrations
            ],
            [
                {
                    "file": "005_logs.ts",
                    "directory": "/home/marlen/code/icefoganalytics/elcc-data-management/src/api/src/data/migrations"
                },
                // ... other pending migrations

            ]
        ]
    }
    ```

    Keep refreshing the page until all the pending migrations are completed migrations.

    > From `src/api/src/routes/migration-router.ts`

9. (currently broken) Run seeds via navigating to http://localhost:3000/api/migrate/seed

    > From `src/api/src/routes/migration-router.ts`

9. Boot the front-end via

    ```bash
    cd ./src/web
    npm install
    npm run start
    ```

8. The front-end is viewable at http://localhost:8080.

9. TODO: figure out what the database setup needs to be.
