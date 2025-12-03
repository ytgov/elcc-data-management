Create a Jira ticket in project ELCC at https://yg-hpw.atlassian.net/ with the following details:

**Summary:** Switch Database Migration System from Umzug to Knex

**Type:** Technical Improvement

**Priority:** Medium

**Description:**

Switch the database migration system from Umzug to Knex to align with other icefoganalytics projects (vendor-portal, travel-authorization, wrap) and improve the developer experience with better tooling and type safety.

The project currently uses Umzug with Sequelize QueryInterface for database migrations. Other icefoganalytics projects have standardized on Knex for migrations, which provides:
- Better TypeScript support and type safety
- More readable fluent schema builder API
- Native migration tooling with comprehensive CLI
- Built-in migration locking mechanism
- Easier migration between database engines if needed

**Work Completed:**

All work has been completed on branch: `claude/switch-db-migration-knex-01642n8wrzwxAJDB5NkbwSbV`

Changes include:
1. Removed all Umzug-related code and dependencies (umzug package, bin/migrate.ts, bin/seed.ts, src/db/umzug.ts)
2. Created Knex migration client configuration at src/db/db-migration-client.ts
3. Created 12 individual migrations for complete database schema (users, centres, fiscal_periods, funding_periods, funding_submission_lines, logs, employee_wage_tiers, employee_benefits, funding_submission_line_jsons, payments, user_roles, wage_enhancements)
4. Removed automatic migration running (migrations now manual, following wrap project pattern)
5. Updated package.json scripts (removed knex: prefix)
6. Created comprehensive documentation in KNEX_MIGRATION_GUIDE.md

**New Migration Commands:**
```
npm run migrate              # Run pending migrations
npm run migrate:make <name>  # Create new migration
npm run migrate:rollback     # Rollback last batch
npm run migrate:list         # Show migration status
npm run seed:make <name>     # Create seed file
npm run seed:run             # Run seed files
```

**Breaking Change:**
Migrations now run manually instead of automatically on server start. Developers must run `npm run migrate` before `npm start`. This is intentional for explicit control and matches the wrap project pattern.

**Benefits:**
- ✅ Consistency with other icefoganalytics projects
- ✅ Better developer experience with fluent API
- ✅ Explicit control over migrations (production safety)
- ✅ Industry standard tooling
- ✅ Removed ~400 lines of Umzug code

**Labels:** technical-debt, refactoring, database, migrations, developer-experience

**Full documentation available at:** `/home/user/elcc-data-management/JIRA_TICKET_KNEX_MIGRATION.md`
