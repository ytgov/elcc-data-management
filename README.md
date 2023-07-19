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

4. Boot the back-end via

```bash
cd ./src/api
npm install
npm run start
```

5. Boot the front-end via

```bash
cd ./src/web
npm install
npm run start
```

6. To run the seed migrations go to http://localhost:3000/api/migrate/up.
