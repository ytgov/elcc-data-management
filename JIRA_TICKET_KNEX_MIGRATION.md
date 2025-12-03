# Switch Database Migration System from Umzug to Knex

## Type
Technical Improvement / Refactoring

## Priority
Medium

## Description

Switch the database migration system from Umzug to Knex to align with other icefoganalytics projects (vendor-portal, travel-authorization, wrap) and improve the developer experience with better tooling and type safety.

## Background

The project currently uses Umzug with Sequelize QueryInterface for database migrations. Other icefoganalytics projects have standardized on Knex for migrations, which provides:
- Better TypeScript support and type safety
- More readable fluent schema builder API
- Native migration tooling with comprehensive CLI
- Built-in migration locking mechanism
- Easier migration between database engines if needed

## Acceptance Criteria

- [x] Remove all Umzug-related code and dependencies
- [x] Create Knex migration client configuration
- [x] Convert complete database schema to individual Knex migrations
- [x] Update npm scripts to use Knex commands
- [x] Remove automatic migration running (follow wrap project pattern)
- [x] Update documentation with new migration commands
- [x] All 12 tables recreated as separate migration files
- [x] Migrations respect foreign key dependencies
- [x] Package.json matches wrap project structure

## Implementation Details

### Removed
- `umzug` dependency from package.json
- `bin/migrate.ts` and `bin/seed.ts` (old CLI)
- `src/db/umzug.ts` and `src/db/umzug-null-storage.ts`
- `src/initializers/20-run-migrations.ts` (auto-migration)
- `src/initializers/30-run-seeds.ts` (auto-seeding)

### Added
- `knex` v3.1.0 dependency
- `src/db/db-migration-client.ts` - Knex configuration for MSSQL
- `src/config.d/knexfile.ts` - Knexfile for CLI commands
- `src/db/templates/sample-migration.ts` - Knex migration template
- `src/db/templates/sample-seed.ts` - Knex seed template
- 12 migration files for complete database schema

### Changed
- Updated package.json scripts (removed `knex:` prefix)
- Updated KNEX_MIGRATION_GUIDE.md documentation

## Database Schema Migrations Created

**Base tables (no foreign keys):**
1. `20241117000001_create-users-table.ts`
2. `20241117000002_create-centres-table.ts`
3. `20241117000003_create-fiscal-periods-table.ts`
4. `20241117000004_create-funding-periods-table.ts`
5. `20241117000005_create-funding-submission-lines-table.ts`
6. `20241117000006_create-logs-table.ts`

**Tables with foreign keys:**
7. `20241117000007_create-employee-wage-tiers-table.ts`
8. `20241117000008_create-employee-benefits-table.ts`
9. `20241117000009_create-funding-submission-line-jsons-table.ts`
10. `20241117000010_create-payments-table.ts`
11. `20241117000011_create-user-roles-table.ts`
12. `20241117000012_create-wage-enhancements-table.ts`

## Migration Commands

### Old (Umzug)
```bash
npm run migrate  # Ran automatically on server start
npm run seed
```

### New (Knex)
```bash
# Manual execution (following wrap pattern)
npm run migrate              # Run pending migrations
npm run migrate:make <name>  # Create new migration
npm run migrate:rollback     # Rollback last batch
npm run migrate:list         # Show migration status
npm run seed:make <name>     # Create seed file
npm run seed:run             # Run seed files
```

## Key Changes in Approach

**Before (Umzug):**
- Migrations ran automatically on server start
- Used Sequelize QueryInterface API
- Mixed migration tracking with Sequelize

**After (Knex):**
- Migrations run manually (explicit control)
- Uses Knex fluent schema builder API
- Follows wrap project proven pattern
- Must run `npm run migrate` before `npm start`

## Testing Instructions

1. Fresh database setup:
```bash
cd api
npm install
npm run migrate
npm start
```

2. Create new migration:
```bash
npm run migrate:make add-new-column
# Edit the generated migration file
npm run migrate
```

3. Rollback test:
```bash
npm run migrate:rollback
npm run migrate
```

## Documentation

- Updated `api/KNEX_MIGRATION_GUIDE.md` with complete usage guide
- Updated `KNEX_MIGRATION_INVESTIGATION.md` with implementation status
- Both documents contain examples and best practices

## Related Projects

This implementation follows patterns from:
- [icefoganalytics/vendor-portal](https://github.com/icefoganalytics/vendor-portal)
- [icefoganalytics/travel-authorization](https://github.com/icefoganalytics/travel-authorization)
- [icefoganalytics/wrap](https://github.com/icefoganalytics/wrap)

## Branch

`claude/switch-db-migration-knex-01642n8wrzwxAJDB5NkbwSbV`

## Commits

1. `20922cf` - Implement Knex migration system alongside Umzug (soft migration approach)
2. `2e48dae` - Remove Umzug migration system and migrate to Knex-only setup
3. `1971b08` - Create complete database schema as Knex migrations
4. `4e7b493` - Update documentation to reflect Knex-only migration system
5. `5c2f2a9` - Simplify migration approach to match wrap project pattern
6. `81d694a` - Fix knexfile location to match wrap project structure

## Benefits

✅ **Consistency** - Matches other icefoganalytics projects
✅ **Better DX** - Fluent API, better TypeScript support
✅ **Explicit Control** - Manual migrations give production safety
✅ **Industry Standard** - Knex is widely used and actively maintained
✅ **Simpler** - Removed ~400 lines of Umzug-related code

## Breaking Changes

⚠️ **Migration execution is now manual** - Developers must run `npm run migrate` before starting the server. This is intentional for explicit control.

## Risk Assessment

**Low Risk:**
- All existing database schema preserved in new migrations
- Complete up/down functions for rollback capability
- Proven pattern from multiple production projects
- Comprehensive documentation provided

## Labels

`technical-debt`, `refactoring`, `database`, `migrations`, `developer-experience`
