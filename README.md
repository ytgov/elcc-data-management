# Early Learning Childcare Centre

## Data Management Application

## Development

### Set up `dev` command

The `dev` command vastly simplifies development using docker compose. It requires `ruby`, though `direnv` and `asdf` will make it easier to use.

Its more or less simply a wrapper around docker compose will the ability to quickly add custom helpers.

All commands are just strings joined together so its easy to add new commmands. It prints out each command that it runs, so that you can run the command manually to debug it, or just so you learn some docker compose while using it.

1. (optional) Install `asdf` as seen in https://asdf-vm.com/guide/getting-started.html.

   e.g. for Linux

   ```bash
   apt install curl git

   git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.12.0

   echo '
   # asdf
   . "$HOME/.asdf/asdf.sh"
   . "$HOME/.asdf/completions/asdf.bash"
   ' >> ~/.bashrc
   ```

2. Install `ruby` via `asdf` as seen here https://github.com/asdf-vm/asdf-ruby, or using whatever custom Ruby install method works for your platform.

   e.g. for Linux

   ```bash
   asdf plugin add ruby https://github.com/asdf-vm/asdf-ruby.git

   # install version from .tool-versions file
   asdf install ruby

   asdf reshim ruby
   ```

   You will now be able to run the `./bin/dev` command.

3. (optional) Install [direnv](https://direnv.net/) and create an `.envrc` with

   ```bash
    #!/usr/bin/env bash

    PATH_add bin
   ```

   and then run `direnv allow`.

   You will now be able to do `dev xxx` instead ov `./bin/dev xxx`.

4. Create a `./api/.env.development` file with the following content:

   ```bash
   VUE_APP_FRONTEND_URL=http://localhost:8080
   VUE_APP_AUTH_DOMAIN=https://dev-0tc6bn14.eu.auth0.com
   VUE_APP_AUTH_CLIENTID=9LYlWVby1DLUu7SDUiCcvorVXqAlCMYs
   VUE_APP_AUTH_AUDIENCE=testing

   AUTH0_AUDIENCE=testing
   AUTH0_DOMAIN=https://dev-0tc6bn14.eu.auth0.com/

   APPLICATION_NAME=ELCC Data Management
   ```

5. Connect to the default database via to create the app database. _This will be automated in the future._

   ```
   DB_NAME=master dev sqlcmd

   # or

   docker compose -f docker-compose.development.yaml run --rm db sh -c '
     /opt/mssql/bin/sqlservr &
     sleep 30
     /opt/mssql-tools/bin/sqlcmd \
       -U "$DB_USER" \
       -P "$DB_PASS" \
       -H "$DB_HOST" \
       -d "$DB_NAME" \
       -I
   '
   ```

   After the database has booted, you are connected to the `sqlcmd` terminal. You will see `1>`.

   Create the `ELCC` database via

   ```mssql
   CREATE DATABASE ELCC
   GO
   ```

   To list the databases, and check that ELCC was created you can use:

   ```msql
   SELECT NAME FROM SYS.DATABASES
   GO
   ```

   > NOTE: you need to type `GO`/`go` separately from the mssql commands. It applies the current changes as a transaction, _I think_.

6. Boot the database and api services using

   ```bash
   dev up

   # or

   docker compose -f docker-compose.development.yaml up --remove-orphans
   ```

7. Run migrations via navigating to http://localhost:3000/api/migrate/up, and refreshing the page once for each migration.

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
                   "directory": "<project-directory>/elcc-data-management/api/src/data/migrations"
               },
               // ... other pending migrations

           ]
       ]
   }
   ```

   Keep refreshing the page until all the pending migrations are completed migrations.

   > From `./api/src/routes/migration-router.ts`

8. (currently broken) Run seeds via navigating to http://localhost:3000/api/migrate/seed

   > From `./api/src/routes/migration-router.ts`

9. Boot the front-end via

   ```bash
   cd ./web
   npm install
   npm run start
   ```

10. The front-end is viewable at http://localhost:8080.

11. TODO: figure out what the database setup needs to be.

### Editor Setup

Your text editor or IDE might require you to manually install the dependencies to get TypesScript autocompletion working. Hopefully, it "just works :tm:". If not you can install packages locally like so:

1. Install `asdf` using instructions from [README -> Set Up dev Commnd](./README.md#set-up-dev-command)

2. Install the `nodejs` plugin via and the appropriate nodejs version.

   ```bash
   asdf plugin add nodejs

   # install the version from the .tool-verions file
   asdf install nodejs
   ```

   Check that you have the correct version set up by seeing that these two commands match:

   ```bash
   asdf current nodejs
   node -v
   ```


3. Go to `./api` and run `npm install`

4. Go to `./web` and run `npm run install`

### Linting and Pretification

Linting and prettification support easier collaborator by standardizing code.
They also can make programming faster as you no longer need to worry about formatting, as it happens automatically.

To enable linting and prettification:

1. Install the root level packages via `npm install`

2. Install the recommended extensions for VS Code

3. Reboot VS Code.

4. TODO: test on a second machine and see if more instructions are needed.
