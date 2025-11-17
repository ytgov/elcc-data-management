# Knex Migration Guide

This project uses **Knex.js** for all database migrations and seeds. This guide explains how to use Knex for managing database schema changes.

## Table of Contents

- [Overview](#overview)
- [Available Commands](#available-commands)
- [Creating Migrations](#creating-migrations)
- [Migration Patterns](#migration-patterns)
- [Running Migrations](#running-migrations)
- [Creating Seeds](#creating-seeds)
- [Running Seeds](#running-seeds)
- [Migration Strategy](#migration-strategy)
- [Best Practices](#best-practices)

## Overview

**Knex** is a SQL query builder and migration tool that provides:
- Fluent schema builder API
- Native migration support with comprehensive CLI
- Better TypeScript support
- Built-in migration locking mechanism
- Database-agnostic design

### Why Knex?

- **More Readable**: Fluent, chainable API for building schemas
- **Better Tooling**: Comprehensive CLI commands for managing migrations
- **Type Safety**: Excellent TypeScript support with autocomplete
- **Industry Standard**: Large community and active development
- **Future Proof**: Easier to migrate between different database engines if needed

## Available Commands

### Migration Commands

```bash
# Create a new migration
npm run migrate:make <migration_name>

# Run all pending migrations
npm run migrate

# Rollback the last batch of migrations
npm run migrate:rollback

# List completed and pending migrations
npm run migrate:list
```

### Seed Commands

```bash
# Create a new seed file
npm run seed:make <seed_name>

# Run all seed files
npm run seed:run
```

### Direct Knex CLI Access

```bash
# Access knex CLI directly for advanced commands
npm run knex -- <command>
```

## Creating Migrations

### 1. Generate a New Migration

```bash
npm run migrate:make create-users-table
```

This creates a new migration file in `api/src/db/migrations/` with a timestamp prefix (e.g., `20241117000013_create-users-table.ts`).

### 2. Edit the Migration File

The generated file will have the following structure:

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  // Add your migration code here
}

export async function down(knex: Knex): Promise<void> {
  // Add rollback code here
}
```

## Migration Patterns

### Creating a Table

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", function (table) {
    // Primary key (auto-increment)
    table.increments("id").notNullable().primary()

    // String columns
    table.string("email", 150).notNullable()
    table.string("first_name", 100).notNullable()
    table.string("last_name", 100).notNullable()

    // Boolean
    table.boolean("is_active").notNullable().defaultTo(true)

    // MSSQL-specific timestamps
    table
      .specificType("created_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table
      .specificType("updated_at", "DATETIME2(0)")
      .notNullable()
      .defaultTo(knex.raw("GETUTCDATE()"))
    table.specificType("deleted_at", "DATETIME2(0)")

    // Unique constraint (excluding soft-deleted records)
    table.unique(["email"], {
      indexName: "users_email_unique",
      predicate: knex.whereNull("deleted_at"),
    })
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users")
}
```

### Adding Columns to an Existing Table

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("centres", function (table) {
    table.string("phone_number", 20)
    table.string("email", 100)
    table.boolean("is_active").notNullable().defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("centres", function (table) {
    table.dropColumn("phone_number")
    table.dropColumn("email")
    table.dropColumn("is_active")
  })
}
```

### Creating Foreign Keys

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("employee_benefits", function (table) {
    table.increments("id").notNullable().primary()

    // Foreign key to centres table
    table
      .integer("centre_id")
      .notNullable()
      .references("id")
      .inTable("centres")
      .onDelete("CASCADE")
      .onUpdate("CASCADE")

    // Foreign key to fiscal_periods table
    table
      .integer("fiscal_period_id")
      .notNullable()
      .references("id")
      .inTable("fiscal_periods")
      .onDelete("RESTRICT")
      .onUpdate("CASCADE")

    table.decimal("amount", 10, 2).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("employee_benefits")
}
```

### Creating Indexes

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("payments", function (table) {
    // Simple index
    table.index("centre_id", "payments_centre_id_index")

    // Composite index
    table.index(["centre_id", "fiscal_period_id"], "payments_centre_fiscal_index")
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("payments", function (table) {
    table.dropIndex("centre_id", "payments_centre_id_index")
    table.dropIndex(["centre_id", "fiscal_period_id"], "payments_centre_fiscal_index")
  })
}
```

### Data Migrations

```typescript
import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  // Update existing records
  await knex("centres")
    .where("region", null)
    .update({ region: "Unknown" })

  // Insert new records
  await knex("centres").insert([
    {
      name: "Example Centre",
      license: "123",
      community: "Whitehorse",
      region: "WHITEHORSE",
    },
  ])
}

export async function down(knex: Knex): Promise<void> {
  // Rollback data changes
  await knex("centres")
    .where("region", "Unknown")
    .update({ region: null })
}
```

## Running Migrations

Migrations must be run manually before starting the application. This gives you explicit control
over when schema changes are applied.

```bash
# Run all pending migrations
npm run migrate

# Check migration status
npm run migrate:list

# Rollback the last batch
npm run migrate:rollback
```

**Important:** Always run migrations before starting the server, especially in production environments.

## Creating Seeds

### 1. Generate a New Seed

```bash
npm run seed:make fill-centres-table
```

This creates a new seed file in `api/src/db/seeds/{environment}/`.

### 2. Edit the Seed File

```typescript
import type { Knex } from "knex"

export async function seed(knex: Knex): Promise<void> {
  // Use upsert pattern for idempotent seeding
  await knex("centres")
    .insert([
      {
        id: 1,
        name: "Example Centre",
        license: "123",
        community: "Whitehorse",
        region: "WHITEHORSE",
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      },
    ])
    .onConflict("id")
    .merge()

  // Alternative: Check before inserting
  const existing = await knex("centres").where({ id: 1 }).first()
  if (!existing) {
    await knex("centres").insert({
      id: 1,
      name: "Example Centre",
      license: "123",
      community: "Whitehorse",
    })
  }
}
```

## Running Seeds

Seeds must be run manually when you want to populate the database with sample/test data.

```bash
# Run all seed files
npm run seed:run
```

**Note**: Seeds should only be run in development/test environments, never in production.

## Migration Strategy

This project uses **Knex** as its sole migration system. The database schema is defined
through 12 base migrations created on 2024-11-17 that establish the complete schema:

1. `20241117000001_create-users-table.ts`
2. `20241117000002_create-centres-table.ts`
3. `20241117000003_create-fiscal-periods-table.ts`
4. `20241117000004_create-funding-periods-table.ts`
5. `20241117000005_create-funding-submission-lines-table.ts`
6. `20241117000006_create-logs-table.ts`
7. `20241117000007_create-employee-wage-tiers-table.ts`
8. `20241117000008_create-employee-benefits-table.ts`
9. `20241117000009_create-funding-submission-line-jsons-table.ts`
10. `20241117000010_create-payments-table.ts`
11. `20241117000011_create-user-roles-table.ts`
12. `20241117000012_create-wage-enhancements-table.ts`

### Migration Tables

Knex uses two tables to track migrations:
- `knex_migrations` - Stores executed migration names and batch numbers
- `knex_migrations_lock` - Prevents concurrent migrations from running

## Best Practices

### 1. Always Write Both Up and Down

```typescript
// ✅ Good
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", ...)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users")
}

// ❌ Bad
export async function down(knex: Knex): Promise<void> {
  // Empty - cannot rollback!
}
```

### 2. Use Transactions for Data Migrations

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx("centres").update({ region: "Unknown" }).where("region", null)
    await trx("centres").insert([...])
  })
}
```

### 3. Make Seeds Idempotent

Seeds should be safe to run multiple times:

```typescript
// ✅ Good - uses upsert
await knex("centres")
  .insert([{ id: 1, name: "Test" }])
  .onConflict("id")
  .merge()

// ❌ Bad - will fail on second run
await knex("centres").insert([{ id: 1, name: "Test" }])
```

### 4. Use Descriptive Migration Names

```bash
# ✅ Good
npm run migrate:make create-users-table
npm run migrate:make add-phone-to-centres
npm run migrate:make backfill-region-column

# ❌ Bad
npm run migrate:make migration1
npm run migrate:make update
```

### 5. Test Rollbacks

Always test that your `down()` function works:

```bash
npm run migrate
npm run migrate:rollback
npm run migrate
```

### 6. Use MSSQL-Specific Types When Needed

For MSSQL Server, use `specificType` for precision control:

```typescript
// For timestamps
table.specificType("created_at", "DATETIME2(0)")
  .notNullable()
  .defaultTo(knex.raw("GETUTCDATE()"))

// For decimals
table.specificType("amount", "DECIMAL(10,2)")
```

### 7. Soft Delete Pattern

Use the predicate option for unique constraints with soft deletes:

```typescript
table.unique(["email"], {
  indexName: "users_email_unique",
  predicate: knex.whereNull("deleted_at"),
})
```

This ensures uniqueness only applies to non-deleted records.

## Configuration

Knex configuration is managed in:

- **Client Config**: `api/src/db/db-migration-client.ts`
- **Knexfile**: `api/src/config.d/knexfile.ts`
- **Environment Variables**: Same as existing DB config (DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_PORT)

## Troubleshooting

### Migration Won't Run

```bash
# Check migration status
npm run migrate:list

# Check database connection
npm run knex -- migrate:currentVersion
```

### Need to Skip a Migration

```bash
# Manually mark migration as complete (use with caution!)
npm run knex -- migrate:up <migration_name>
```

### Reset All Migrations (Development Only)

```bash
# Rollback all migrations
npm run migrate:rollback --all

# Re-run all migrations
npm run migrate
```

## Additional Resources

- [Knex.js Documentation](https://knexjs.org/)
- [Knex Migration API](https://knexjs.org/guide/migrations.html)
- [Knex Schema Builder](https://knexjs.org/guide/schema-builder.html)
- Investigation Document: `/KNEX_MIGRATION_INVESTIGATION.md`

## Questions?

For questions or issues with Knex migrations, refer to:
1. This guide
2. The investigation document at `/KNEX_MIGRATION_INVESTIGATION.md`
3. Example migrations in other icefoganalytics projects (vendor-portal, travel-authorization)
