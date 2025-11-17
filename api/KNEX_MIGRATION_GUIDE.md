# Knex Migration Guide

This project now supports **Knex.js** for database migrations alongside the existing Umzug migration system. This guide explains how to use Knex for database migrations and seeds.

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
npm run knex:migrate:make <migration_name>

# Run all pending migrations
npm run knex:migrate

# Rollback the last batch of migrations
npm run knex:migrate:rollback

# List completed and pending migrations
npm run knex:migrate:list
```

### Seed Commands

```bash
# Create a new seed file
npm run knex:seed:make <seed_name>

# Run all seed files
npm run knex:seed:run
```

### Direct Knex CLI Access

```bash
# Access knex CLI directly for advanced commands
npm run knex -- <command>
```

## Creating Migrations

### 1. Generate a New Migration

```bash
npm run knex:migrate:make create-users-table
```

This creates a new migration file in `api/src/db/migrations/` with a timestamp prefix (e.g., `20241207001_create-users-table.ts`).

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

### Automatic (On Server Start)

Migrations run automatically when the server starts via the `21-run-knex-migrations.ts` initializer. This ensures the database schema is always up-to-date.

### Manual Execution

```bash
# Run all pending migrations
npm run knex:migrate

# Check migration status
npm run knex:migrate:list

# Rollback the last batch
npm run knex:migrate:rollback
```

## Creating Seeds

### 1. Generate a New Seed

```bash
npm run knex:seed:make fill-centres-table
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

### Automatic (On Server Start in Development)

Seeds run automatically in development environment via the `31-run-knex-seeds.ts` initializer.

### Manual Execution

```bash
# Run all seed files
npm run knex:seed:run
```

**Note**: Seeds are skipped in production environments for safety.

## Migration Strategy

### Current Approach: Soft Migration

This project uses a **soft migration** approach:

1. **Umzug migrations remain functional** - Existing migrations continue to work
2. **Knex runs after Umzug** - The initializers run in order:
   - `20-run-migrations.ts` (Umzug)
   - `21-run-knex-migrations.ts` (Knex)
3. **New migrations use Knex** - All new migrations should be created using Knex
4. **Gradual transition** - Umzug will be phased out over time

### Migration Tables

- **Umzug**: Uses `SequelizeMeta` table to track migrations
- **Knex**: Uses `knex_migrations` and `knex_migrations_lock` tables

Both systems track their migrations independently, allowing them to coexist.

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
npm run knex:migrate:make create-users-table
npm run knex:migrate:make add-phone-to-centres
npm run knex:migrate:make backfill-region-column

# ❌ Bad
npm run knex:migrate:make migration1
npm run knex:migrate:make update
```

### 5. Test Rollbacks

Always test that your `down()` function works:

```bash
npm run knex:migrate
npm run knex:migrate:rollback
npm run knex:migrate
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
npm run knex:migrate:list

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
npm run knex:migrate:rollback --all

# Re-run all migrations
npm run knex:migrate
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
