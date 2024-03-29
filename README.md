# Early Learning Childcare Centre - Data Management Application

## Production - building locally

1. Create an `api/.env.production` file from the `api/.env.sample` file and fill with the appropriate mathcing the local development config with some minor changes.

   ```bash
   VUE_APP_FRONTEND_URL=http://localhost:8080
   VUE_APP_AUTH_DOMAIN=some-url
   VUE_APP_AUTH_CLIENTID=some-secret
   VUE_APP_AUTH_AUDIENCE=testing

   AUTH_REDIRECT=http://localhost:8080/dashboard
   AUTH0_AUDIENCE=testing
   AUTH0_DOMAIN=some-url

   APPLICATION_NAME=ELCC Data Management
   API_PORT=8080

   NODE_ENV=production

   DB_NAME=ELCC
   DB_HOST=db
   DB_USER=sa
   DB_PASS=DevPwd99!
   DB_PORT=1433
   ```

   > replace the `VUE_APP_AUTH_DOMAIN`, `VUE_APP_AUTH_CLIENTID`, and `AUTH0_DOMAIN` with appropriate values.

2. Duplicate the `api/.env.production` to `.env` at the top level.

3. Run `docker compose up --build` to build the application and boot it locally.

4. (optional) If you want to run seeds you can do that manually via:

   ```
   dc exec app sh
   NODE_ENV=development node
   const { runSeeds } = require("./dist/initializers/30-run-seeds.js")
   runSeeds().then(console.log)
   ```

5. Go to http://localhost:8080/ and sign in to the app.

## Development

### Set up `dev` command

The `dev` command vastly simplifies development using docker compose. It requires `ruby`, though `direnv` and `asdf` will make it easier to use.

Its more or less simply a wrapper around docker compose will the ability to quickly add custom helpers.

All commands are just strings joined together, so it's easy to add new commmands. `dev` prints out each command that it runs, so that you can run the command manually to debug it, or just so you learn some docker compose while using it.

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

### Boot the Application

1. Create a `./api/.env.development` file with the following content:

   ```bash
   VUE_APP_FRONTEND_URL=http://localhost:8080
   VUE_APP_AUTH_DOMAIN=https://dev-0tc6bn14.eu.auth0.com
   VUE_APP_AUTH_CLIENTID=9LYlWVby1DLUu7SDUiCcvorVXqAlCMYs
   VUE_APP_AUTH_AUDIENCE=testing

   AUTH0_AUDIENCE=testing
   AUTH0_DOMAIN=https://dev-0tc6bn14.eu.auth0.com

   APPLICATION_NAME=ELCC Data Management
   ```

2. Boot the api, web, and database services, and run the migrations and seeds using

   ```bash
   dev up --build

   # or

   docker compose -f docker-compose.development.yaml up --remove-orphans --build
   ```

   > You only need the --build option if it's your first time building the app, or if you are modifying the the Docker files.

3. The front-end is viewable at http://localhost:8080.

> NOTE: make sure you delete the .env file before runing a development setup again as it is auto-loaded by docker compose.

> NOTE: You can also skip seeding when database is not empty by setting the `SKIP_SEEDING_UNLESS_EMPTY=true` environment variable.

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

4. Go to `./web` and run `npm install`

### Linting and Pretification

Linting and prettification support easier collaborator by standardizing code.
They also can make programming faster as you no longer need to worry about formatting, as it happens automatically.

To enable linting and prettification:

1. Install the root level packages via `npm install`

2. Install the recommended extensions for VS Code

3. Reboot VS Code.

4. TODO: test on a second machine and see if more instructions are needed.

## Migrations - Database Management

This project is using [umzug](https://github.com/sequelize/umzug) instead of [sequelize-cli](https://github.com/sequelize/cli) because `sequelize-cli` doesn't have TypeScript support.

NOTE: while database table names use snake_case, sequelize models use camelCase to match the JS standard. This means that migrations need to either provide a "field" name for each column that is snake_case, or use snake_case for the column names.

1. To create a new migration from the template [sample-migration](./api/src/db/template/sample-migration.ts) do:

   ```bash
   dev migrate create -- --name create-users-table.ts

   # Or

   dev sh
   npm run migrate create --name create-users-table.ts
   ```

   > If you are using Linux, all files created in docker will be created as `root` so you won't be able to edit them. Luckily, this is handle by the `dev migrate` command, when using Linux, after you provide your `sudo` password.

2. To run the all new migrations do:

   ```bash
   dev migrate up
   ```

3. To rollback the last executed migration:

   ```bash
   dev migrate down
   ```

4. To rollback all migrations:

   ```bash
   dev migrate down -- --to 0
   ```

### Seeding

Seeding is effectively the same as migrating, you just replace the `dev migrate` command with `dev seed`.

e.g.

- `dev seed create -- --name fill-users-table.ts`

Seeds are separated by environment.
i.e. api/src/db/seeds/development vs. api/src/db/seeds/production

This allows for the convenient loading of required defaults in production, with more complex seeds in development, for easy QA.

Seed code should be idempotent, so that it can be executed at any point in every environment.

Seeds currently don't keep track of whether they have run or not. An alternative to this would be to store seeds in a `SequelizeData` table. via `new SequelizeStorage({ sequelize, tablename: "SequelizeData" })` in the umzug seeder config.

### References

- [umzug](https://github.com/sequelize/umzug)
- [query-interface](https://sequelize.org/docs/v6/other-topics/query-interface/) migration examples.
- [query interface api](https://sequelize.org/api/v6/class/src/dialects/abstract/query-interface.js~queryinterface) for full details.

### Extras

If you want to take over a directory or file in Linux you can use `dev ownit <path-to-directory-or-file>`.

If you are on Windows or Mac, and you want that to work, you should implement it in the `bin/dev` file. You might never actually need to take ownership of anything, so this might not be relevant to you.

## Testing

### Back-end

Run `dev test_api` to run the back-end tests.

### Front-end

Run `dev test_web` to run the front-end tests.
