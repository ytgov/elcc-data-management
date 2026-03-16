# Top-Level Bin Directory

## `dev` Command

The `dev` command is the main development helper for this repository. It wraps docker compose with project-specific shortcuts.

Common usage:

```bash
dev up --build              # Boot application (--build on first run or after Dockerfile changes)
dev down                    # Stop application
dev logs                    # View logs
dev sh                      # Access shell in API container

dev test_api                                    # Run all backend tests
dev test_web                                    # Run all frontend tests
dev test api -- --run tests/models/fiscal-period.test.ts  # Run single backend test file
dev test web -- --run src/components/SomeComponent.test.ts # Run single frontend test file

dev web npm run check-types         # Check frontend types
dev api npm run check-types         # Check backend types

dev migrate create -- --name create-users-table.ts  # Create migration
dev migrate up                                       # Run pending migrations
dev migrate down                                     # Rollback last migration
dev migrate down -- --to 0                          # Rollback all migrations

dev seed create -- --name fill-users-table.ts       # Create seed file
dev seed up                                          # Run seeds

dev api npm install lodash  # Run npm in API container
dev web npm install vue     # Run npm in web container
```

For example, you can run a sql script via

```bash
dev sqlcmd -i ./data/funding_submission_lines.sql
```

assuming the file is located at `/db/data/funding_submission_lines.sql`

Note that the `dev` command uses the `db` service, and so only has access to folders under the top-level `db` directory.
