# Agent Guidelines for ELCC Data Management

ELCC Data Management is a web application for tracking government contributions to child care services.

This file follows the format from https://agents.md/ for AI agent documentation.

## Documentation Philosophy

Keep `AGENTS.md` focused on project-wide conventions and other high-level concepts. When guidance becomes specific to a broader architectural area, move it into a nearby `README.md` or `agents/` folder and link to it from here.

Useful local documentation:

- [bin/README.md](./bin/README.md)
- [api/src/controllers/README.md](./api/src/controllers/README.md)
- [api/src/models/README.md](./api/src/models/README.md)
- [api/src/services/README.md](./api/src/services/README.md)
- [api/src/serializers/README.md](./api/src/serializers/README.md)
- [api/tests/README.md](./api/tests/README.md)
- [web/src/api/README.md](./web/src/api/README.md)
- [web/src/components/README.md](./web/src/components/README.md)
- [web/src/pages/README.md](./web/src/pages/README.md)
- [web/src/use/README.md](./web/src/use/README.md)
- [agents/workflows/README.md](./agents/workflows/README.md)

## Development Approach

- Study existing code before implementing new features. Prefer adapting established patterns over inventing new ones.
- Start with the simplest working solution, then improve iteratively.
- Document uncertainties and follow-up simplifications as you go.
- Use git to discover emerging patterns when needed:

```bash
git log --since="3 months ago" --diff-filter=A --name-only --pretty=format: | sort | uniq -c | sort -nr
```

## Development Environment

For initial environment setup, see [README.md](./README.md).

### Tech Stack

- Frontend: Vue 3, Vuetify 3, TypeScript, Vite, Pinia
- Backend: Express, Sequelize 7, TypeScript
- Database: Microsoft SQL Server 2019
- Infrastructure: Docker Compose
- Testing: Vitest

### Common Commands

Development primarily uses `./bin/dev`. If `direnv` is active, `dev` may also work as a shortcut. Keep `dev`-specific usage in [bin/README.md](./bin/README.md).

Common entry points:

```bash
./bin/dev up --build
./bin/dev test_api
./bin/dev test_web
./bin/dev api npm run check-types
./bin/dev web npm run check-types
```

Direct docker compose remains available:

```bash
docker compose -f docker-compose.development.yaml up --remove-orphans --build
```

### Project Structure

```text
api/    Express + Sequelize backend
web/    Vue 3 + Vuetify frontend
bin/    Development helper scripts
```

Backend request flow:

```text
Route -> Controller -> Policy -> Service -> Model -> Serializer -> Response
```

Frontend responsibility split:

```text
Parent discovers data -> Child displays or edits a specific record
```

## Code Style Preferences

### General Principles

- Prefer descriptive naming. Remove redundant context when the caller already provides it.
- Avoid abbreviations in variables, functions, table names, aliases, and parameters.
- Prefer self-documenting code over explanatory comments.
- Prefer expanded, linear code over dense functional style.
- Use guard clauses with a blank line before the main path.
- Keep imports grouped by conceptual distance:
  1. Third-party packages
  2. Standard library modules
  3. Local application imports
- Use one import per line except when importing multiple members from the same module.
- Remove unused imports.

### Commit Messages

- Avoid emojis in source and configuration files.
- Git commit messages use GitHub-style emoji prefixes:

```text
:emoji: concise description

[optional] Why? Why I made the changes
```

## Frontend Patterns

Keep detailed frontend guidance in:

- [web/src/components/README.md](./web/src/components/README.md)
- [web/src/pages/README.md](./web/src/pages/README.md)
- [web/src/use/README.md](./web/src/use/README.md)
- [web/src/api/README.md](./web/src/api/README.md)

Project-wide frontend conventions:

- Prefer dedicated pages over dialogs for complex workflows.
- Keep parent components responsible for querying and filtering. Child components should work from stable ids or already-resolved records.
- Handle loading, empty, error, and success states explicitly.
- Organize routes and files by domain with predictable route-name-to-file-path mapping.

### Financial Precision

Financial calculations must minimize rounding error and remain reproducible.

- Never use JavaScript arithmetic operators on financial values.
- Financial values are strings in TypeScript, not `number`.
- Use SQL `DECIMAL` types for storage.
- Use `big.js` for arithmetic.
- Use string literals in tests, such as `"100.50"`.
- Use `.toFixed(4)` for money and `.toFixed(2)` for percentages or hours.

## Backend Patterns

Keep detailed backend guidance in:

- [api/src/controllers/README.md](./api/src/controllers/README.md)
- [api/src/models/README.md](./api/src/models/README.md)
- [api/src/services/README.md](./api/src/services/README.md)
- [api/src/serializers/README.md](./api/src/serializers/README.md)

Project-wide backend conventions:

- Controllers coordinate requests, policies authorize, services hold business logic, models persist, and serializers shape responses.
- In models, prefer section order `Fields -> Helpers -> Associations -> Static methods`.
- Use getters for computed properties that do not take parameters.
- Use plural enum names and expose enums through the model when convenient.
- Use `CreationOptional` only for non-nullable database fields with defaults.
- Name scopes for the relationship or business rule, not the parameter type:
  - `byFundingPeriod`
  - `byCentre`
- Sequelize paranoid mode is enabled by default. Include `deletedAt` on models that persist data and exclude soft-deleted rows from unique indexes.
- Seeds should be idempotent and use memory-efficient iteration when walking large tables.

### SQL Patterns

- Wrap all subqueries in parentheses.
- For composable Sequelize subqueries, prefer the `id: { [Op.in]: subquery }` pattern.
- When excluding rows with a related match, prefer correlated `NOT EXISTS` predicates over client-built exclusion lists and over `NOT IN`.

## Testing Conventions

Detailed test guidance lives in [api/tests/README.md](./api/tests/README.md).

Project-wide expectations:

- Tests should map to a specific file under `api/src`.
- Describe blocks should identify the file, class or model, and method under test.
- Prefer simple assertions against concrete values.
- Avoid redundant `where` clauses in isolated scope or query tests unless the filter itself is under test.
- Use the Arrange, Act, Assert structure.

## Authentication and Authorization

- All routes require authentication by default.
- Define public routes first, then apply authentication middleware to the protected route tree.
- Do not add ad hoc per-route authentication when the route should live under the protected `/api` area.
- Keep authorization decisions in policies.

## Changelog Management

- Maintain a single canonical [CHANGELOG.md](./CHANGELOG.md) in the origin repository.
- Use Keep a Changelog structure with `## [Unreleased]` at the top.
- Track upstream releases with time-based versions: `vYYYY.MM.DD.x`.
- Keep origin-only work under `Unreleased` until it becomes part of an upstream release.
- Write user-facing entries grouped by theme, not commit-log summaries.
- For pull requests that change user-visible behavior or database schema, add at least one `Unreleased` entry unless the change is pure refactoring or tests.

## Pull Request Documentation

Pull requests follow [`.github/pull_request_template.md`](./.github/pull_request_template.md).

### Implementation

- Use a numbered list of high-level technical changes.
- Group by architectural concern or dependency order.
- Focus on what changed, not file-by-file narration.

### Testing Instructions

- Provide step-by-step verification for the main user-facing changes.
- Include the relevant automated checks.
- Include feature-specific manual verification when needed.
