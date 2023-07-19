# Early Learning Childcare Centre
## Data Management Application

## Development

1. Boot the database via

```bash
docker compose -f ./docker-compose.dev.yml up
```

TODO: figure out what environment variables go where, and in which files.

2. Boot the back-end via

```bash
cd ./src/api
npm install
npm run start
```

3. Boot the front-end via

```bash
cd ./src/web
npm install
npm run start
```

4. To run the seed migrations go to http://localhost:3000/api/migrate/up.
