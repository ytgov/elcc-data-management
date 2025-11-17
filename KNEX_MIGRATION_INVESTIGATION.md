# Database Migration: Umzug to Knex Investigation

## Implementation Status

✅ **IMPLEMENTED** - Knex has been successfully integrated into the project using the soft migration approach.

See `api/KNEX_MIGRATION_GUIDE.md` for usage instructions.

## Executive Summary

This document investigates switching from Umzug to Knex for database migrations in the elcc-data-management project, based on patterns used in other icefoganalytics projects (vendor-portal, travel-authorization, digital-vault).

## Current State (Umzug)

### Configuration
- **Library**: `umzug` v3.3.1
- **Storage**: SequelizeStorage (tracking table: `SequelizeMeta`)
- **Migrations Location**: `api/src/db/migrations/`
- **Migration Pattern**: Sequelize QueryInterface-based
- **Naming Convention**: `YYYY.MM.DDTHH.MM.SS.description.ts`

### Current Setup Files
- `api/src/db/umzug.ts` - Umzug configuration
- `api/src/initializers/20-run-migrations.ts` - Migration runner
- `api/bin/migrate.ts` - CLI interface
- `api/src/db/templates/sample-migration.ts` - Migration template

### Example Current Migration Structure
```typescript
import { DataTypes } from "@sequelize/core"
import type { Migration } from "@/db/umzug"
import { MssqlSimpleTypes } from "@/db/utils/mssql-simple-types"

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable("users", {
    email: {
      type: DataTypes.STRING(200),
      primaryKey: true,
      autoIncrement: false,
      allowNull: false,
    },
    // ... more fields
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable("users")
}
```

## Proposed State (Knex)

### Configuration
- **Library**: `knex` v3.1.0
- **Storage**: Built-in migration table (default: `knex_migrations` + `knex_migrations_lock`)
- **Migrations Location**: `api/src/db/migrations/`
- **Migration Pattern**: Knex schema builder
- **Naming Convention**: `YYYYMMDDNNN_description.ts` (e.g., `20241007001_create-users-table.ts`)

### Knex Setup (Based on vendor-portal)
```typescript
// api/src/db/db-migration-client.ts
import path from "path"
import knex, { Knex } from "knex"
import { isEmpty, isNil, merge } from "lodash"

export function buildKnexConfig(options?: Knex.Config): Knex.Config {
  return merge(
    {
      client: "mssql",
      connection: {
        host: DB_HOST,
        user: DB_USERNAME,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        port: DB_PORT,
        options: {
          encrypt: true,
          trustServerCertificate: DB_TRUST_SERVER_CERTIFICATE,
        },
      },
      migrations: {
        directory: path.resolve(__dirname, "./migrations"),
        extension: "ts",
        stub: path.resolve(__dirname, "./templates/sample-migration.ts"),
      },
      seeds: {
        directory: path.resolve(__dirname, `./seeds/${NODE_ENV}`),
        extension: "ts",
        stub: path.resolve(__dirname, "./templates/sample-seed.ts"),
      },
    },
    options
  )
}

const config = buildKnexConfig()
const dbMigrationClient = knex(config)

export default dbMigrationClient
```

### Example Knex Migration Structure
```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", function (table) {
    table.increments("id").notNullable().primary()
    table.string("email", 150).notNullable()
    table.string("auth0_subject", 100).notNullable()
    table.string("first_name", 100).notNullable()
    table.string("last_name", 100).notNullable()
    table.string("display_name", 200).notNullable()
    table.string("roles", 255)

    table.specificType("deactivated_at", "DATETIME2(0)")
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    table.unique(["email"], {
      indexName: "users_email_unique",
      predicate: knex.whereNull("deleted_at"),
    })
    table.unique(["auth0_subject"], {
      indexName: "users_auth0_subject_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users")
}
```

## Comparison: Umzug vs Knex

### Advantages of Knex

1. **Native Migration Support**
   - Knex has built-in migration management (not a separate library)
   - More comprehensive CLI tooling (`knex migrate:make`, `knex migrate:latest`, `knex migrate:rollback`)
   - Better integration with schema builder

2. **Fluent Schema Builder API**
   - More readable and chainable syntax
   - Better TypeScript support and autocomplete
   - Cleaner code for complex migrations

3. **Database Agnostic**
   - Easy to switch between databases (PostgreSQL, MySQL, MSSQL, SQLite)
   - Consistent API across different database engines
   - Better for future portability

4. **Active Development**
   - Larger community and ecosystem
   - More frequent updates
   - Better documentation

5. **Query Building**
   - Knex provides query building capabilities beyond just migrations
   - Could potentially replace or supplement some Sequelize usage

6. **Locking Mechanism**
   - Built-in migration lock table prevents concurrent migration runs
   - More robust for production environments

### Advantages of Umzug (Current)

1. **Already Integrated**
   - No migration effort required
   - Team already familiar with the pattern
   - Works well with current Sequelize setup

2. **Storage Flexibility**
   - Can use custom storage mechanisms (e.g., UmzugNullStorage for seeds)
   - More control over migration tracking

### Key Differences

| Feature | Umzug | Knex |
|---------|-------|------|
| Primary Purpose | Generic migration runner | Full query builder + migrations |
| Schema API | Uses Sequelize QueryInterface | Native Knex schema builder |
| TypeScript Support | Good | Excellent |
| Migration Tracking | SequelizeMeta table | knex_migrations + knex_migrations_lock |
| CLI Tools | Basic (via runAsCLI) | Comprehensive native CLI |
| Community Size | Medium | Large |
| Learning Curve | Low (if familiar with Sequelize) | Low-Medium |

## Migration Strategy

### Phase 1: Setup (No Breaking Changes)

1. **Install Knex**
   ```bash
   npm install knex@^3.1.0
   npm install --save-dev @types/knex
   ```

2. **Create Knex Configuration**
   - Create `api/src/db/db-migration-client.ts`
   - Configure for MSSQL with existing connection settings
   - Set up migrations directory and templates

3. **Create Migration Template**
   - Create `api/src/db/templates/sample-migration-knex.ts`
   - Follow vendor-portal pattern

4. **Test Parallel Running**
   - Ensure Knex can read current database state
   - Verify no conflicts with existing SequelizeMeta table

### Phase 2: Migration Conversion (Optional)

Two approaches:

#### Option A: Soft Migration (Recommended)
- Keep existing migrations as-is
- Use Knex for NEW migrations only
- Run both systems in initializer
- Gradually phase out Umzug

#### Option B: Hard Migration
- Convert all existing migrations to Knex format
- Use a script to automate conversion where possible
- Manually verify each migration
- Update migration tracking table

### Phase 3: Update Initializers

Replace `api/src/initializers/20-run-migrations.ts`:

```typescript
import knex from "@/db/db-migration-client"

type MigrationInfo = {
  file: string
  directory: string
}

async function runMigrations(): Promise<void> {
  const [_completedMigrations, pendingMigrations]: [MigrationInfo[], MigrationInfo[]] =
    await knex.migrate.list()

  if (pendingMigrations.length === 0) {
    console.info("No pending migrations.")
    return
  }

  return pendingMigrations
    .reduce(async (previousMigration, { file, directory }) => {
      await previousMigration

      console.info(`Running migration: ${directory}/${file}`)
      return knex.migrate.up()
    }, Promise.resolve())
    .then(() => {
      console.info("All migrations completed successfully.")
    })
    .catch((error) => {
      console.error(`Error running migrations: ${error}`, { error })
      throw error
    })
}

export default runMigrations
```

### Phase 4: Update Scripts

Update `package.json`:
```json
{
  "scripts": {
    "knex": "ts-node -r tsconfig-paths/register ./node_modules/.bin/knex --knexfile src/db/db-migration-client.ts",
    "migrate": "npm run knex -- migrate:latest",
    "migrate:make": "npm run knex -- migrate:make",
    "migrate:rollback": "npm run knex -- migrate:rollback",
    "migrate:list": "npm run knex -- migrate:list"
  }
}
```

## Implementation Checklist

- [ ] Install knex and types
- [ ] Create `db-migration-client.ts` with configuration
- [ ] Create knex migration template
- [ ] Update or create new initializer for knex migrations
- [ ] Update package.json scripts
- [ ] Create migration utilities (if needed)
- [ ] Test migration in development environment
- [ ] Document new migration process for team
- [ ] Update CI/CD if applicable
- [ ] Plan rollout strategy (soft vs hard migration)

## Risks & Mitigation

### Risk 1: Breaking Existing Migrations
**Mitigation**: Use soft migration approach - keep existing umzug migrations, use knex for new ones

### Risk 2: Database State Mismatch
**Mitigation**: Test thoroughly in development and staging environments before production

### Risk 3: Team Learning Curve
**Mitigation**: Provide documentation and examples, knex syntax is similar to current patterns

### Risk 4: Lost Migration History
**Mitigation**: Keep SequelizeMeta table intact, document the transition point

## Recommendations

1. **Start with Soft Migration**: Keep existing umzug setup, add knex alongside it
2. **Use Knex for New Migrations**: All new migrations should use knex patterns
3. **Follow vendor-portal Patterns**: Use their proven structure and conventions
4. **Maintain Backward Compatibility**: Don't remove umzug immediately
5. **Document Everything**: Update README with new migration commands and patterns

## References

- [Knex Migration Documentation](https://knexjs.org/guide/migrations.html)
- vendor-portal repository: `icefoganalytics/vendor-portal`
- travel-authorization repository: `icefoganalytics/travel-authorization`
- digital-vault repository: `icefoganalytics/digital-vault`

## Next Steps

1. Review this document with team
2. Decide on soft vs hard migration approach
3. Create proof of concept in development branch
4. Test with existing database
5. Proceed with implementation if approved
