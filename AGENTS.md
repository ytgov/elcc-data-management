# Agent Guidelines for ELCC Data Management

ELCC Data Management is a web application tracking government contributions to child care services.

This file follows the format from https://agents.md/ for AI agent documentation.

**Documentation philosophy:** This file focuses on patterns, conventions, and architecture rather than documenting specific features or domain models. Examples illustrate patterns, not exhaustive feature documentation.

---

## Table of Contents

- [Development Environment](#development-environment)
  - [Tech Stack](#tech-stack)
  - [Common Commands](#common-commands)
  - [Project Structure](#project-structure)
- [Code Style Preferences](#code-style-preferences)
- [Frontend Patterns](#frontend-patterns)
  - [Composables: Singular vs Plural](#composables-singular-vs-plural)
  - [Component Architecture](#component-architecture)
  - [Component Naming and Location](#component-naming-and-location)
  - [Route and File Organization](#route-and-file-organization)
  - [Decimal Type Handling](#decimal-type-handling)
- [Backend Patterns](#backend-patterns)
  - [Model Organization](#model-organization)
    - [Soft Delete (Paranoid Mode)](#soft-delete-paranoid-mode)
  - [Seed File Patterns](#seed-file-patterns)
  - [Controller Structure](#controller-structure)
  - [Policy Authorization](#policy-authorization)
  - [Service Layer](#service-layer)
  - [Serializers](#serializers)
- [Testing Conventions](#testing-conventions)
  - [Test Describe Blocks](#test-describe-blocks)
  - [Test Structure (AAA Pattern)](#test-structure-aaa-pattern)
- [Authentication and Authorization](#authentication-and-authorization)
- [Changelog Management](#changelog-management)
- [Pull Request Documentation](#pull-request-documentation)

---

## Development Approach

**Pattern Learning:** Study existing code before implementing new features. Find similar functionality and adapt established patterns rather than reinventing approaches. When uncertain, choose the simplest approach that follows existing code structure.

**Progressive Enhancement:** Build minimal working solutions first, then improve iteratively. Document uncertainties and future simplification opportunities. Start with working solutions, then enhance based on feedback and requirements.

**Pattern Discovery:** Use git to identify emerging patterns by examining recently added files: `git log --since="3 months ago" --diff-filter=A --name-only --pretty=format: | sort | uniq -c | sort -nr`

---

## Development Environment

> For initial environment setup (installing Ruby, Node.js, creating `.env` files, etc.), see [README.md](./README.md).

### Tech Stack

- **Frontend**: Vue 3, Vuetify 3, TypeScript, Vite, Pinia
- **Backend**: Express, Sequelize 7, TypeScript
- **Database**: Microsoft SQL Server 2019
- **Infrastructure**: Docker Compose
- **Testing**: Vitest (both frontend and backend)

### Common Commands

Development uses the `./bin/dev` Ruby helper script (or just `dev` with direnv). It wraps docker compose with convenience helpers.

**Application Management:**

```bash
dev up --build              # Boot application (--build on first run or after Dockerfile changes)
dev down                    # Stop application
dev logs                    # View logs
dev sh                      # Access shell in API container
```

**Testing:**

```bash
dev test_api                                    # Run all backend tests
dev test_web                                    # Run all frontend tests
dev test api -- --run tests/models/fiscal-period.test.ts  # Run single backend test file
dev test web -- --run src/components/SomeComponent.test.ts # Run single frontend test file
```

**Type Checking:**

```bash
dev web npm run check-types         # Check frontend types
dev api npm run check-types         # Check backend types
```

**Database Management:**

```bash
dev migrate create -- --name create-users-table.ts  # Create migration
dev migrate up                                       # Run pending migrations
dev migrate down                                     # Rollback last migration
dev migrate down -- --to 0                          # Rollback all migrations

dev seed create -- --name fill-users-table.ts       # Create seed file
dev seed up                                          # Run seeds
```

**NPM Commands:**

```bash
dev api npm install lodash  # Run npm in API container
dev web npm install vue     # Run npm in web container
```

**Direct Docker Compose:**

```bash
docker compose -f docker-compose.development.yaml up --remove-orphans --build
```

### Project Structure

```
├── api/                    # Express + Sequelize backend
│   ├── src/
│   │   ├── controllers/    # Request handlers (coordinate policies/services/serializers)
│   │   ├── models/         # Sequelize models (camelCase properties, snake_case DB columns)
│   │   ├── policies/       # Authorization logic (who can do what, permitted attributes)
│   │   ├── services/       # Business logic (create/update operations)
│   │   ├── serializers/    # Response formatting (control exposed attributes)
│   │   ├── db/
│   │   │   ├── migrations/ # Database schema changes (snake_case columns)
│   │   │   └── seeds/      # Environment-specific data (development/production)
│   │   ├── router.ts       # Route definitions (secure by default)
│   │   └── ...
│   └── tests/
├── web/                    # Vue 3 + Vuetify frontend
│   ├── src/
│   │   ├── api/            # API client modules
│   │   ├── components/     # Vue components ({Model}[Modifier]{VuetifyComponent}.vue)
│   │   ├── pages/          # Page-level components
│   │   ├── use/            # Vue composables (use-model.ts singular, use-models.ts plural)
│   │   ├── router.ts       # Route definitions
│   │   └── ...
│   └── tests/
└── bin/
    └── dev                 # Ruby development helper script
```

**Request Flow (Backend):** Route → Controller → Policy → Service → Model → Serializer → Response

**Component Responsibility (Frontend):** Parent discovers data (query/filter) → Child manipulates data (edit/business logic)

---

## Code Style Preferences

### General Principles

1. **Descriptive naming**
   - Functions: `standardizeHexPattern` over `expandHex`
   - Variables: `employeeBenefitsByMonth` over `benefits`
   - Constants: Hoist magic numbers with descriptive names
   - **Concise function naming**: Remove redundant context when clear from caller (e.g., `calculateEmployeeBenefitCost` over `calculateEmployeeBenefitMonthlyCost`)
   - **Simplified parameter types**: Use minimal types needed, avoid unnecessary complexity
   - **Direct parameter naming**: Use simple names without redundant context
   - **Minimal parameter passing**: Pass only specific data needed, not entire objects (e.g., `fiscalPeriodId: number` over `fiscalPeriod: FiscalPeriod`)

2. **No abbreviations**
   - Variables: `migration` not `mig`
   - SQL tables: `employee_benefits` not `emp_ben`
   - Function parameters: `fiscalPeriod` not `fp`

3. **Self-documenting code**
   - Remove extraneous comments when code structure and naming are self-documenting
   - Trust clear variable names and logic to provide clarity over explanatory comments
   - Only retain comments that explain non-obvious business logic or complex reasoning
   - **Prefer informative variable names over comments**: Choose descriptive names that make code self-documenting
   - Reference: https://www.rubytapas.com/2016/06/13/episode-418/no-comment/

4. **Expanded, linear code over terse/functional**
   - Prefer one thing per line

5. **Guard clauses with blank lines**

   ```typescript
   if (isNil(value)) return

   // Continue with main logic
   ```

6. **No emojis in code and commit message format**
   - Avoid using emojis in source code, documentation files, and configuration files
   - **Git commit messages** use GitHub-style emojis with specific format:

     ```
     :emoji: concise description

     [optional] Why? Why I made the changes
     ```

   - **Common emojis**: `:hammer:` (refactoring), `:lock:` (security), `:recycle:` (cleanup), `:sparkles:` (new features), `:bug:` (bug fixes), `:docs:` (documentation), `:truck:` (move files), `:butterfly:` (database/table changes), `:pencil:` (typos/comments), `:fire:` (remove features), `:beetle:` (fix attempts), `:tophat:` (GitHub workflow), `:white_check_mark:` (passing tests), `:heavy_check_mark:` (passing tests), `:construction:` (work in progress), `:x:` (failing tests), `:mute:` (suppress warnings/logging), `:heavy_plus_sign:` (add dependencies), `:gear:` (configuration), `:factory:` (test factories), `:heavy_minus_sign:` (remove dependencies), `:refactor:` (refactoring), `:zap:` (performance), `:art:` (formatting/styling), `:loud_sound:` (logging)
   - **Guidelines**: Keep first line concise (50 chars or less), use present tense, add "Why?" section for complex changes needing context

7. **Import Organization and Formatting**
   - **Import grouping strategy** (conceptual distance approach):
     1. Foreign/third party imports (lodash, @sequelize/core, etc.) - most distant
     2. Standard library imports - medium distance
     3. Local application/library specific imports (models, policies, services, serializers) - closest
   - **Blank lines between groups** as required by PEP 8
   - **One import per line**: `import fs from "fs"` `import path from "path"` not `import fs, path from "fs"`
   - **Exception**: Multiple imports from same module: `import { readFile, writeFile } from "fs/promises"`
   - **Import placement**: Always at top of file, after comments/docstrings, before globals
   - **Remove unused imports**: Keep import sections clean
   - Reference: https://peps.python.org/pep-0008/#imports (modified for conceptual distance)

---

## Frontend Patterns

### Component Architecture

- **Dedicated pages over dialogs**: Prefer dedicated pages for complex interactions instead of dialogs
  - Better mobile support and flexibility
  - More scalable for complex forms and data display
  - Follow established admin page patterns
- **Shared components**: Create reusable components for common UI elements (e.g., fiscal year selectors)
- **Component standardization**: Align similar pages with consistent patterns and structure

### Component Structure

- **Vue component organization**:
  ```typescript
  // Types
  // Constants
  // Props/Component setup
  // Computed values
  // Methods/Functions
  // Lifecycle hooks
  ```

### Event Handler Naming

**Pattern:** Name functions based on what they do, not where they're called from.

```vue
<template>
  <!-- Good: Action-based naming -->
  <tr @click="startEditingRow(index, 'estimated')">
    <input
      @blur="saveAndExitEditMode()"
      @keydown="handleKeyboardNavigation($event)"
    />

    <!-- Bad: Generic event-based naming -->
  </tr>

  <tr @click="onRowClick(index)">
    <input
      @blur="onInputBlur()"
      @keydown="onKeyDown($event)"
    />
  </tr>
</template>

<script setup>
function onRowClick(index) {
  startEditingRow(index)
}
function onInputBlur() {
  saveChanges()
}
function onKeyDown(event) {
  handleNavigation(event)
}
</script>
```

**Key principles:**

- Avoid generic wrappers like `onClick`, `onSubmit`, `handleClick`, `onBlur`
- Call action functions directly from event handlers
- Function names should describe the action being performed, not the event that triggered it

### Composables: Singular vs Plural

Follow the **singular/plural pattern** for data operations:

#### **Singular Composables** (`use-model.ts`)

For single-record CRUD operations identified by ID.

**Pattern:**

```typescript
// web/src/use/use-user.ts
import { type Ref, reactive, toRefs, unref, watch } from "vue"
import { isNil } from "lodash"

import usersApi, { UserRoles, type UserAsShow, type UserPolicy } from "@/api/users-api"

export { UserRoles, type UserAsShow, type UserPolicy }

export function useUser(userId: Ref<number | null | undefined>) {
  const state = reactive<{
    user: UserAsShow | null
    policy: UserPolicy | null
    isLoading: boolean
    isErrored: boolean
  }>({
    user: null,
    policy: null,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<UserAsShow> {
    const staticUserId = unref(userId)

    if (isNil(staticUserId)) {
      throw new Error("userId is required")
    }

    state.isLoading = true

    try {
      const { user, policy } = await usersApi.get(staticUserId)
      state.isErrored = false
      state.user = user
      state.policy = policy
      return user
    } catch (error) {
      console.error(`Failed to fetch user: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  async function save(): Promise<UserAsShow> {
    const staticUserId = unref(userId)

    if (isNil(staticUserId)) {
      throw new Error("userId is required")
    }

    if (isNil(state.user)) {
      throw new Error("user is required")
    }

    state.isLoading = true

    try {
      const { user, policy } = await usersApi.update(staticUserId, state.user)
      state.isErrored = false
      state.user = user
      state.policy = policy
      return user
    } catch (error) {
      console.error(`Failed to save user: ${error}`, { error })
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => unref(userId),
    async (newUserId) => {
      if (isNil(newUserId)) return

      await fetch()
    },
    { immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
    save,
  }
}

export default useUser
```

**Key characteristics:**

- Accepts `id: Ref<number | null | undefined>`
- Uses `modelApi.get(id)` to fetch single record
- Returns single item + policy
- Has `save()` method for updates
- Auto-fetches when `id` changes

#### **Plural Composables** (`use-models.ts`)

For list/query operations with filtering, pagination, etc.

**Pattern:**

```typescript
// web/src/use/use-employee-benefits.ts
import { type Ref, reactive, toRefs, ref, unref, watch } from "vue"
import employeeBenefitsApi, {
  type EmployeeBenefit,
  type EmployeeBenefitWhereOptions,
  type EmployeeBenefitFiltersOptions,
  type EmployeeBenefitQueryOptions,
} from "@/api/employee-benefits-api"

export {
  type EmployeeBenefit,
  type EmployeeBenefitWhereOptions,
  type EmployeeBenefitFiltersOptions,
  type EmployeeBenefitQueryOptions,
}

export function useEmployeeBenefits(
  queryOptions: Ref<EmployeeBenefitQueryOptions> = ref({}),
  { skipWatchIf = () => false }: { skipWatchIf?: () => boolean } = {}
) {
  const state = reactive<{
    employeeBenefits: EmployeeBenefit[]
    totalCount: number
    isLoading: boolean
    isErrored: boolean
  }>({
    employeeBenefits: [],
    totalCount: 0,
    isLoading: false,
    isErrored: false,
  })

  async function fetch(): Promise<EmployeeBenefit[]> {
    state.isLoading = true
    try {
      const { employeeBenefits, totalCount } = await employeeBenefitsApi.list(unref(queryOptions))
      state.isErrored = false
      state.employeeBenefits = employeeBenefits
      state.totalCount = totalCount
      return employeeBenefits
    } catch (error) {
      console.error("Failed to fetch employee benefits:", error)
      state.isErrored = true
      throw error
    } finally {
      state.isLoading = false
    }
  }

  watch(
    () => [skipWatchIf(), unref(queryOptions)],
    async ([skip]) => {
      if (skip) return

      await fetch()
    },
    { deep: true, immediate: true }
  )

  return {
    ...toRefs(state),
    fetch,
    refresh: fetch,
  }
}

export default useEmployeeBenefits
```

**Key characteristics:**

- Accepts `queryOptions: Ref<QueryOptions>` with `where`, `filters`, pagination
- Uses `modelApi.list(queryOptions)` to fetch multiple records
- Returns array + `totalCount`
- Has optional `skipWatchIf` to conditionally skip fetching
- Auto-fetches when query options change

### Component Architecture

#### **Component Responsibility Boundaries**

Follow the **Single Responsibility Principle**: separate data discovery from data manipulation. Parent components handle querying and filtering to locate records, child components handle editing and business logic for a specific record.

This separation provides:

- **Dependency Inversion**: Child components depend on a stable abstraction (an ID) rather than implementation details (query parameters, filter logic)
- **Reusability**: Editor components can be used in any context where you have an ID
- **Testability**: Components can be tested in isolation
- **Open/Closed**: New query strategies don't require changing editor components

When the data model has complex lookups (e.g., finding a record by composite keys), the parent absorbs this complexity and presents a simple interface to the child.

#### **Explicit State Handling**

Handle all possible component states explicitly rather than implicitly.

### Component Naming and Location

- **Component standardization**: Align similar pages with consistent patterns and structure
- **Shared components**: Create reusable components for common UI elements (e.g., fiscal year selectors)
- **Vuetify global defaults**: Use framework global defaults instead of custom styling for consistency and reduced maintenance

**Pattern:** `components/{model-plural}/{ModelSingularOrPlural}[Modifier]{VuetifyComponent}.vue`

The component name uses singular or plural based on whether it interacts with one entity or multiple entities. An optional modifier describes the action or purpose (Edit, Manage, etc.). The component type is the outermost Vuetify component used in the template.

**Examples:**

```
components/
  employee-benefits/
    EmployeeBenefitEditTable.vue     # Edits ONE employee benefit (modifier: Edit, component: Table)
    EmployeeBenefitCard.vue          # Displays ONE employee benefit (no modifier, component: Card)
    EmployeeBenefitsDataTable.vue    # Lists MULTIPLE employee benefits (no modifier, component: DataTable)
  funding-periods/
    FundingPeriodEditDialog.vue      # Edits ONE funding period (modifier: Edit, component: Dialog)
    FundingPeriodsDataTable.vue      # Lists MULTIPLE funding periods (no modifier, component: DataTable)
  users/
    UserEditDialog.vue               # Edits ONE user (modifier: Edit, component: Dialog)
    UsersDataTableServer.vue         # Lists MULTIPLE users (modifier: Server, component: DataTable)
```

**Rules:**

- Directory: Always plural, kebab-case (`employee-benefits/`)
- Component name: Singular if it works with one entity, plural if it works with multiple
- Modifier (optional): Describes action or purpose (`Edit`, `Editor`, `Manage`, `Create`, etc.)
- Component case: PascalCase
- Vuetify component: The outermost Vuetify component in the template
  - `Dialog` - `v-dialog`
  - `DataTable` - `v-data-table`
  - `Table` - `v-table`
  - `Card` - `v-card`
  - `Form` - `v-form`

### Route and File Organization

**Core Principle:** Organize routes and files by domain, with predictable patterns between route names and file paths.

#### Route Naming Pattern

Use `{domain}/{resource}/{PageName}` format for route names:

- `administration/submission-lines/SubmissionLineNewPage`
- `administration/funding-periods/FundingPeriodEditPage`

This makes it mechanical to locate the file from the route name.

#### File Organization Pattern

Group by domain, then resource:

```
pages/
  administration/
    AdministrationSubmissionLinesPage.vue      # List page at /administration/submission-lines
    submission-lines/
      SubmissionLineNewPage.vue                # New page at /administration/submission-lines/new
    funding-periods/
      FundingPeriodEditPage.vue                # Edit page at /administration/funding-periods/:id/edit
```

#### Route Example

```ts
// web/src/routes/administration-routes.ts
{
  path: "administration/submission-lines/new",
  name: "administration/submission-lines/SubmissionLineNewPage",
  component: () => import("@/pages/administration/submission-lines/SubmissionLineNewPage.vue"),
}
```

**Pattern:** The route name mirrors the file path under `pages/`.

### Financial Precision

**Principle:** Financial calculations must minimize rounding errors and be reproducible. Precision loss from floating-point arithmetic must be avoided in intermediate calculations.

**Why it matters:**

- Floating-point arithmetic introduces unpredictable rounding (0.1 + 0.2 ≠ 0.3 in JavaScript)
- Small errors compound across hundreds of records and fiscal periods
- Financial reports should reconcile with source data
- Audit requirements demand reproducible, explainable calculations
- Rounding should be explicit and controlled, not a side effect of arithmetic

**Current implementation:** The system uses fixed-precision decimal types for storage and arbitrary-precision arithmetic for calculations. Financial values are never stored or calculated using JavaScript's native `Number` type.

#### Storage

Financial data uses SQL DECIMAL types with sufficient precision:

- **Money fields**: `DECIMAL(15,4)` - currency amounts
- **Rate fields**: `DECIMAL(10,4)` - hourly wages, unit rates
- **Percentage fields**: `DECIMAL(5,2)` - cost caps, rates
- **Hours/quantities**: `DECIMAL(10,2)` - time tracking, quantities

Database values serialize as strings to preserve precision during JSON transport.

#### Type Definitions

TypeScript types reflect the string serialization:

```typescript
@Attribute(DataTypes.DECIMAL(15, 4))
@NotNull
declare amount: string

@Attribute(DataTypes.DECIMAL(5, 2))
@NotNull
declare costCapPercentage: string
```

#### Arithmetic

All financial calculations use `big.js` for arbitrary-precision arithmetic:

**Backend:**

```typescript
import Big from "big.js"
import sumByDecimal from "@/utils/sum-by-decimal"

// Operations return strings
const total = Big(amount1).plus(amount2).toFixed(4)
const result = Big(monthlyAmount).mul(rate).toFixed(4)

// Utilities for common operations
const sum = sumByDecimal(items, "amount").toFixed(4)
```

**Frontend:**

```typescript
import Big from "big.js"
import { formatMoney } from "@/utils/formatters"
import sumByDecimal from "@/utils/sum-by-decimal"

// Calculations maintain precision
const total = Big(line.monthlyAmount).mul(rate).toFixed(4)
const sum = sumByDecimal(items.value, "amount").toFixed(4)

// Display formatting accepts strings or Big instances
const formatted = formatMoney(total)
```

#### Rules

- Never use JavaScript arithmetic operators (`+`, `-`, `*`, `/`) on financial values
- All financial values are strings in TypeScript, never `number`
- Test data must use string literals: `"100.50"` not `100.50`
- Use `.toFixed(4)` for money, `.toFixed(2)` for percentages/hours
- Financial calculations must be reproducible and minimize precision loss.

---

## Backend Patterns

### Model Organization

#### Structure

- **Section order**: Fields → Helpers → Associations → Static methods
- **Helpers section**: Use dedicated "// Helpers" comment for computed properties and helper methods
- **Getter over method**: Use getters for computed properties that don't take parameters
- **NonAttribute typing**: Use `NonAttribute<T>` for computed properties that aren't database fields
- **CreationOptional typing**: Use `CreationOptional<T>` only for actual database fields with defaults

#### Enum Patterns

- **Static enum access**: Add `static readonly Statuses = FundingReconciliationStatuses` to models for convenient access
- **Plural enum naming**: Use plural forms for enum names (e.g., `FundingReconciliationStatuses` not `Status`)
- **Export enum arrays**: `FUNDING_RECONCILIATION_STATUSES = Object.values(FundingReconciliationStatuses)`
- **Dynamic validation**: Use template literals with enum arrays: `Status must be one of: ${FUNDING_RECONCILIATION_STATUSES.join(", ")}`
- **Import reduction**: Consumers only need to import the model, not both model and enum

#### Typing Rules

- **CreationOptional Rule**: Use `CreationOptional` only for non-nullable fields with database defaults
- **Nullable fields**: Type as `Type | null` without `CreationOptional`
- **Required fields**: Don't use `CreationOptional` when they must be provided during creation
- **Database defaults**: `CreationOptional` tells TypeScript the database will provide the value
- **Examples**:
  - `timestampField: CreationOptional<Date>` (non-nullable with database default)
  - `optionalField: Type | null` (truly nullable, no CreationOptional)
  - `requiredField: Type` (required, no CreationOptional)

#### Soft Delete (Paranoid Mode)

**Pattern:** Sequelize paranoid mode is enabled globally by default in `db-client.ts`. All models automatically support soft deletes.

**Model Configuration:**

```typescript
// No @Table decorator needed - paranoid: true is the global default
export class MyModel extends BaseModel<...> {
  // Standard fields...

  @Attribute(DataTypes.DATE)
  declare deletedAt: CreationOptional<Date | null>  // Required for paranoid mode
}

// Only override if you explicitly DON'T want soft deletes:
// @Table({ paranoid: false })
```

**Migration Configuration:**

```typescript
await queryInterface.createTable("my_table", {
  // ... other fields
  deleted_at: {
    type: "datetime2",
    allowNull: true, // Must be nullable
  },
})
```

**Unique Index Configuration:**

Unique indexes must exclude soft-deleted records to allow re-creating previously deleted records.

**Index Decorator (in model):**

```typescript
export const MyUniqueIndex = createIndexDecorator("my-unique-index", {
  unique: true,
  name: "unique_my_table_on_field1_field2", // Must match migration name
  where: {
    deletedAt: null, // camelCase - matches model property
  },
  msg: "A record with these values already exists", // User-friendly error message
})
```

**Migration Index:**

```typescript
await queryInterface.addIndex("my_table", ["field1", "field2"], {
  name: "unique_my_table_on_field1_field2", // Must match decorator name
  unique: true,
  where: {
    deleted_at: null, // snake_case - matches database column
  },
})
```

**Key Requirements:**

- Model decorator: Not needed (paranoid is globally enabled by default in `db-client.ts`)
- Model field: `deletedAt: CreationOptional<Date | null>` (required)
- Migration column: `deleted_at datetime2 NULL` (required)
- Unique index decorator: `where: { deletedAt: null }` (camelCase) (required)
- Unique index migration: `where: { deleted_at: null }` (snake_case) (required)
- Index name must match exactly between decorator and migration
- Include descriptive `msg` field in index decorator for validation errors

**Case Convention:**

- Models/decorators: camelCase (`deletedAt`)
- Migrations/database: snake_case (`deleted_at`)

### Seed File Patterns

**Memory-Efficient Iteration:** When a seed needs to walk every row of a model, prefer `Model.findEach()` over loading everything into memory.

```typescript
// Preferred: streaming iteration over large tables
await FiscalPeriod.findEach(async (fiscalPeriod) => {
  await Centre.findEach(async (centre) => {
    // Create or update data for this (fiscalPeriod, centre) pair
  })
})
```

**Other iteration patterns (besides `findEach()`):**

- **Static in-memory lists:** For small literal arrays you define inside the seed (for example `centresAttributes` in `api/src/db/templates/sample-seed.ts`), iterate the array directly with `for...of`.
- **Small filtered subsets:** When you need a bounded subset from the database and know the result set is small, use `Model.findAll({ where: ... })` and a `for...of` loop.

**Idempotent Pattern:** Check for existing records before creating to ensure seeds can be run multiple times safely.

```typescript
const existingRecord = await Model.findOne({
  where: { uniqueField: value },
})

if (isNil(existingRecord)) {
  await Model.create(attributes)
}
```

### SQL Patterns

**Subquery Wrapping:** Wrap ALL subqueries in parentheses for clarity and operator precedence, regardless of context.

**Sequelize Subquery Pattern:** All subqueries must use the "id: Op.in subquery" pattern to be properly composable in Sequelize.

```typescript
// Correct - explicit subquery wrapping with Op.in pattern
const fundingSubmissionLinesByFundingPeriodIdQuery = sql`
  (
    SELECT
      id
    FROM
      funding_submission_lines
    WHERE
      EXISTS (
        SELECT
          1
        FROM
          funding_periods
        WHERE
          funding_periods.id = :fundingPeriodId
          AND funding_submission_lines.fiscal_year = REPLACE(
            funding_periods.fiscal_year,
            '-' + RIGHT(funding_periods.fiscal_year, 4),
            '/' + RIGHT(funding_periods.fiscal_year, 2)
          )
      )
  )
`

// Usage in scope - must use Op.in with the subquery
return {
  where: {
    id: {
      [Op.in]: fundingSubmissionLinesByFundingPeriodIdQuery,
    },
  },
  replacements: {
    fundingPeriodId,
  },
}

// Incorrect - no wrapping and wrong pattern
const query = sql`
  SELECT id FROM funding_submission_lines WHERE EXISTS (...)
`
```

**Rationale:** Explicit parentheses are required to write valid SQL and prevent operator precedence issues. The "id: Op.in subquery" pattern is required for Sequelize composability.

### Controller Structure

**Pattern:** Use policies, services, serializers, and consistent error handling.

```typescript
// api/src/controllers/employee-benefits-controller.ts
import { Request, Response } from "express"
import { isNil } from "lodash"

import logger from "@/utils/logger"
import { EmployeeBenefit } from "@/models"
import { EmployeeBenefitPolicy } from "@/policies/employee-benefit-policy"
import { CreateService, UpdateService } from "@/services/employee-benefits"
import { IndexSerializer, ShowSerializer } from "@/serializers/employee-benefits"
import BaseController from "@/controllers/base-controller"

export class EmployeeBenefitsController extends BaseController<EmployeeBenefit> {
  async index() {
    try {
      const where = this.buildWhere()
      const scopes = this.buildFilterScopes()
      const order = this.buildOrder()
      const scopedEmployeeBenefits = EmployeeBenefitPolicy.applyScope(scopes, this.currentUser)

      const totalCount = await scopedEmployeeBenefits.count({ where })
      const employeeBenefits = await scopedEmployeeBenefits.findAll({
        where,
        order,
        limit: this.pagination.limit,
        offset: this.pagination.offset,
      })
      const serializedEmployeeBenefits = IndexSerializer.perform(employeeBenefits)
      return this.response.json({
        employeeBenefits: serializedEmployeeBenefits,
        totalCount,
      })
    } catch (error) {
      logger.error(`Error fetching employee benefits: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching employee benefits: ${error}`,
      })
    }
  }

  async show() {
    try {
      const employeeBenefit = await this.loadEmployeeBenefit()
      if (isNil(employeeBenefit)) {
        return this.response.status(404).json({
          message: "Employee benefit not found",
        })
      }

      const policy = this.buildPolicy(employeeBenefit)
      if (!policy.show()) {
        return this.response.status(403).json({
          message: "You are not authorized to view this employee benefit",
        })
      }

      const serializedEmployeeBenefit = ShowSerializer.perform(employeeBenefit)
      return this.response.json({
        employeeBenefit: serializedEmployeeBenefit,
        policy,
      })
    } catch (error) {
      logger.error(`Error fetching employee benefit: ${error}`, { error })
      return this.response.status(400).json({
        message: `Error fetching employee benefit: ${error}`,
      })
    }
  }

  async create() {
    try {
      const policy = this.buildPolicy()
      if (!policy.create()) {
        return this.response.status(403).json({
          message: "You are not authorized to create employee benefits",
        })
      }

      const permittedAttributes = policy.permitAttributesForCreate(this.request.body)
      const employeeBenefit = await CreateService.perform(permittedAttributes)
      const serializedEmployeeBenefit = ShowSerializer.perform(employeeBenefit)
      return this.response.status(201).json({
        employeeBenefit: serializedEmployeeBenefit,
        policy,
      })
    } catch (error) {
      logger.error(`Error creating employee benefit: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error creating employee benefit: ${error}`,
      })
    }
  }

  async update() {
    try {
      const employeeBenefit = await this.loadEmployeeBenefit()
      if (isNil(employeeBenefit)) {
        return this.response.status(404).json({
          message: "Employee benefit not found",
        })
      }

      const policy = this.buildPolicy(employeeBenefit)
      if (!policy.update()) {
        return this.response.status(403).json({
          message: "You are not authorized to update this employee benefit",
        })
      }

      const permittedAttributes = policy.permitAttributes(this.request.body)
      const updatedEmployeeBenefit = await UpdateService.perform(
        employeeBenefit,
        permittedAttributes
      )
      const serializedEmployeeBenefit = ShowSerializer.perform(updatedEmployeeBenefit)
      return this.response.json({
        employeeBenefit: serializedEmployeeBenefit,
        policy,
      })
    } catch (error) {
      logger.error(`Error updating employee benefit: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error updating employee benefit: ${error}`,
      })
    }
  }

  async destroy() {
    try {
      const employeeBenefit = await this.loadEmployeeBenefit()
      if (isNil(employeeBenefit)) {
        return this.response.status(404).json({
          message: "Employee benefit not found",
        })
      }

      const policy = this.buildPolicy(employeeBenefit)
      if (!policy.destroy()) {
        return this.response.status(403).json({
          message: "You are not authorized to delete this employee benefit",
        })
      }

      await employeeBenefit.destroy()
      return this.response.status(204).send()
    } catch (error) {
      logger.error(`Error deleting employee benefit: ${error}`, { error })
      return this.response.status(422).json({
        message: `Error deleting employee benefit: ${error}`,
      })
    }
  }

  private loadEmployeeBenefit() {
    return EmployeeBenefit.findByPk(this.params.employeeBenefitId)
  }

  private buildPolicy(employeeBenefit: EmployeeBenefit = EmployeeBenefit.build()) {
    return new EmployeeBenefitPolicy(this.currentUser, employeeBenefit)
  }

  // For create actions that need to check policy against request body:
  // private buildEmployeeBenefit() {
  //   return EmployeeBenefit.build(this.request.body)
  // }
}

export default EmployeeBenefitsController
```

**Key elements:**

- Try-catch error handling with logging
- Policy-based authorization checks in every method
- Service layer for business logic
- Serializers for response formatting
- Consistent response structure: `{ model, policy }` or `{ models, totalCount }`
- HTTP status codes: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 403 (Forbidden), 404 (Not Found), 422 (Unprocessable Entity)
- Helper methods: `loadModel()` for fetching, `buildPolicy()` for authorization, optionally `buildModel()` for constructing from request body when policy needs to evaluate specific attributes

### Policy Authorization

**Pattern:** Use PolicyFactory with scope and permitted attributes.

```typescript
// Example showing authorization patterns
import { Attributes, FindOptions } from "@sequelize/core"

import { Path } from "@/utils/deep-pick"

import { Payment, User } from "@/models"
import { ALL_RECORDS_SCOPE, PolicyFactory } from "@/policies/base-policy"

export class PaymentPolicy extends PolicyFactory(Payment) {
  show(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.user.centreId === this.record.centreId) return true

    return false
  }

  create(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.user.canCreatePayments && this.user.centreId === this.record.centreId) {
      return true
    }

    return false
  }

  update(): boolean {
    if (this.user.isSystemAdmin) return true
    if (this.user.centreId === this.record.centreId) return true

    return false
  }

  destroy(): boolean {
    if (this.user.isSystemAdmin) return true

    return false
  }

  permittedAttributes(): Path[] {
    return ["amount", "description", "status"]
  }

  permittedAttributesForCreate(): Path[] {
    return ["centreId", "fiscalPeriodId", ...this.permittedAttributes()]
  }

  static policyScope(user: User): FindOptions<Attributes<Payment>> {
    if (user.isSystemAdmin) {
      return ALL_RECORDS_SCOPE
    }

    return {
      where: {
        centreId: user.centreId,
      },
    }
  }
}

export default PaymentPolicy
```

**Key features:**

- **Secure by default**: All methods return `false` by default, permissions must be explicitly granted
- CRUD permissions with role-based and record-level authorization logic
- Access to `this.user` (current user) and `this.record` (model instance)
- Custom getter methods for reusable authorization checks
- Permitted attributes for mass assignment protection (only listed attributes can be modified)
- Separate create attributes (includes foreign keys)
- Policy scope for query filtering (secure by default: define what users CAN see):
  - `ALL_RECORDS_SCOPE` (or `{}`) - No filter, user sees all records
  - `NO_RECORDS_SCOPE` - User sees no records (uses SQL `1 = 0`)
  - `{ where: {...} }` - Custom filter based on user attributes

### Service Layer

**Pattern:** Encapsulate business logic in service classes.

```typescript
// api/src/services/employee-benefits/create-service.ts
import { CreationAttributes } from "@sequelize/core"
import { isNil } from "lodash"

import { EmployeeBenefit } from "@/models"
import BaseService from "@/services/base-service"

export type EmployeeBenefitCreationAttributes = Partial<CreationAttributes<EmployeeBenefit>>

export class CreateService extends BaseService {
  constructor(
    private attributes: EmployeeBenefitCreationAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<EmployeeBenefit> {
    const { centreId, fiscalPeriodId, grossPayrollMonthlyActual, ...optionalAttributes } =
      this.attributes

    if (isNil(centreId)) {
      throw new Error("Centre ID is required")
    }

    if (isNil(fiscalPeriodId)) {
      throw new Error("Fiscal period ID is required")
    }

    const employeeBenefit = await EmployeeBenefit.create({
      ...optionalAttributes,
      centreId,
      fiscalPeriodId,
      grossPayrollMonthlyActual,
    })

    return employeeBenefit.reload({
      include: [
        {
          association: "someAssociation", // Reload with associations if needed for serialization
        },
      ],
    })
  }
}

export default CreateService
```

```typescript
// api/src/services/employee-benefits/update-service.ts
import { Attributes } from "@sequelize/core"

import { EmployeeBenefit } from "@/models"
import BaseService from "@/services/base-service"

export type EmployeeBenefitUpdateAttributes = Partial<Attributes<EmployeeBenefit>>

export class UpdateService extends BaseService {
  constructor(
    private employeeBenefit: EmployeeBenefit,
    private attributes: EmployeeBenefitUpdateAttributes,
    private _currentUser: User
  ) {
    super()
  }

  async perform(): Promise<EmployeeBenefit> {
    await this.employeeBenefit.update(this.attributes)

    // TODO: log current user action

    return this.employeeBenefit
  }
}

export default UpdateService
```

**Key patterns:**

- Extends `BaseService` with constructor-based dependency injection
- Uses Sequelize `CreationAttributes` and `Attributes` types with specific type aliases
- Destructures required vs optional attributes
- Inline validation with clear error messages
- Optionally accepts `_currentUser` for audit logging
- Call static service methods: `CreateService.perform(attributes)` and `UpdateService.perform(record, attributes)`
- Controllers focus on authorization and coordination, not business logic

**Service Principles:**

- Services have single responsibilities - don't bloat create/update services
- Complex business logic should be in dedicated services
- **Minimal data loading**: Only load associations that serializers actually need

**Service naming:**

- Directory: `services/{model-plural}/` (e.g., `services/fiscal-periods/`)
- File: `create-service.ts`, `update-service.ts`, etc.
- Class: `CreateService`, `UpdateService`, etc.
- Always use the standard name, even if the service performs complex operations (e.g., creating multiple related records)
- The service's specific behavior is an implementation detail, not part of its name

Example: A `CreateService` for fiscal periods creates 12 records (one for each month of the fiscal year). The file is still named `create-service.ts` and the class is still `CreateService`, because it's the standard create operation for that resource.

### Serializers

**Pattern:** Control exactly which attributes are exposed to the API.

#### Directory Structure

Each model gets its own serializer directory with an `index.ts` that exports types and serializers with short aliases:

```
serializers/
├── index.ts                          # Main entry point with namespace exports
├── funding-reconciliations/
│   ├── index.ts                      # Directory exports with aliases
│   ├── index-serializer.ts           # List view serializer
│   └── show-serializer.ts            # Detail view serializer
└── funding-reconciliation-adjustments/
    ├── index.ts
    └── reference-serializer.ts       # Lightweight view for inclusion in parents
```

#### Export Pattern

**Directory index.ts** exports both types and serializers with short aliases:

```typescript
// api/src/serializers/funding-reconciliations/index.ts
export { type FundingReconciliationAsIndex as AsIndex, IndexSerializer } from "./index-serializer"
export { type FundingReconciliationAsShow as AsShow, ShowSerializer } from "./show-serializer"
```

**Main serializers/index.ts** uses namespace exports:

```typescript
// api/src/serializers/index.ts
export * as FundingReconciliations from "./funding-reconciliations"
export * as FundingReconciliationAdjustments from "./funding-reconciliation-adjustments"
```

#### Type Naming Convention

- **Full form** (in serializer files): `ModelAsFormat` (e.g., `FundingReconciliationAsIndex`, `FundingReconciliationAsShow`, `FundingReconciliationAdjustmentAsReference`)
- **Short alias** (in directory index.ts): `AsFormat` (e.g., `AsIndex`, `AsShow`, `AsReference`)

Format suffixes:

- `AsIndex` - List/table views with minimal attributes
- `AsShow` - Detail views with full attributes and associations
- `AsReference` - Lightweight views for inclusion in parent serializers

#### Usage Pattern

Import through the main index and access via namespace:

```typescript
import { FundingReconciliations, FundingReconciliationAdjustments } from "@/serializers"

// Serializer usage
const fundingReconciliationSerialized =
  FundingReconciliations.ShowSerializer.perform(fundingReconciliation)
const fundingReconciliationAdjustmentsSerialized =
  FundingReconciliationAdjustments.ReferenceSerializer.perform(fundingReconciliationAdjustments)
```

#### Association Validation

Explicitly check for required associations with descriptive errors:

```typescript
const { adjustments } = this.record
if (isUndefined(adjustments)) {
  throw new Error("Expected adjustments association to be preloaded.")
}
```

#### Serializer Implementation

```typescript
// api/src/serializers/funding-reconciliations/show-serializer.ts
import { isUndefined, pick } from "lodash"

import { FundingReconciliation } from "@/models"
import BaseSerializer from "@/serializers/base-serializer"
import { FundingReconciliationAdjustments } from "@/serializers"

export type FundingReconciliationAsShow = Pick<
  FundingReconciliation,
  | "id"
  | "centreId"
  | "fundingPeriodId"
  | "status"
  | "fundingReceivedTotalAmount"
  | "eligibleExpensesTotalAmount"
  | "payrollAdjustmentsTotalAmount"
  | "finalBalanceAmount"
  | "notes"
  | "finalizedAt"
  | "finalizedById"
  | "createdAt"
  | "updatedAt"
> & {
  adjustments: FundingReconciliationAdjustments.AsReference[]
}

export class ShowSerializer extends BaseSerializer<FundingReconciliation> {
  perform() {
    const { adjustments } = this.record
    if (isUndefined(adjustments)) {
      throw new Error("Expected adjustments association to be preloaded.")
    }

    const adjustmentsSerialized =
      FundingReconciliationAdjustments.ReferenceSerializer.perform(adjustments)
    return {
      ...pick(this.record, [
        "id",
        "centreId",
        "fundingPeriodId",
        "status",
        "fundingReceivedTotalAmount",
        "eligibleExpensesTotalAmount",
        "payrollAdjustmentsTotalAmount",
        "finalBalanceAmount",
        "notes",
        "finalizedAt",
        "finalizedById",
        "createdAt",
        "updatedAt",
      ]),
      adjustments: adjustmentsSerialized,
    }
  }
}

export default ShowSerializer
```

**Key points:**

- Extends `BaseSerializer` which provides static `perform()` for single records or arrays
- Access record via `this.record` (provided by BaseSerializer)
- Use lodash `pick()` to select attributes by name
- Separate serializers for different contexts (Index, Show, Reference)
- Namespace pattern provides better IDE autocomplete and prevents naming conflicts

---

## Testing Conventions

### Test Describe Blocks

**Pattern:** Use nested describe blocks to organize tests by source file → class → method/route.

**For Controllers:**

```typescript
describe("api/src/controllers/users-controller.ts", () => {
  describe("UsersController", () => {
    let currentUser: User

    beforeEach(async () => {
      currentUser = await userFactory.create()
      mockCurrentUser(currentUser)
    })

    describe("#index -> GET /api/users", () => {
      test("returns users array", async () => {
        // test implementation
      })
    })

    describe("#show -> GET /api/users/:userId", () => {
      test("returns a specific user", async () => {
        // test implementation
      })
    })
  })
})
```

**For Models:**

```typescript
describe("api/src/models/funding-period.ts", () => {
  describe("FundingPeriod", () => {
    describe("#fiscalYear -> validation", () => {
      // tests...
    })
  })
})
```

**Rationale:**

- First describe references the source file path for easy navigation from test output
- Second describe groups tests by class/module name
- Third describe identifies the method/action being tested with format `#methodName -> details`

### Test Assertions

**Pattern 1:** One expect per test. Split tests with multiple assertions into separate test cases.

```typescript
// Correct - separate tests for each assertion
describe("POST /api/users", () => {
  test("returns the created user", async () => {
    const response = await request().post("/api/users").send(userData)

    expect(response.body.user).toMatchObject({ email: userData.email })
  })

  test("persists the user to the database", async () => {
    await request().post("/api/users").send(userData)

    expect(await User.findOne({ where: { email: userData.email } })).not.toBeNull()
  })
})

// Incorrect - multiple expects in one test
test("creates a new user", async () => {
  const response = await request().post("/api/users").send(userData)
  expect(response.body.user).toMatchObject({ email: userData.email })
  expect(await User.findOne({ where: { email: userData.email } })).not.toBeNull()
})
```

**Pattern 2:** Keep assertions simple. Avoid loops, complex logic, and nested expects, and always check against concrete values. Avoid `where` clauses inside expectations; each test has a clean database state, so you should assert against the full set of records.

```typescript
// Correct - simple assertion with concrete value
test("when creating employee benefits for a centre, creates employee benefits for all fiscal periods", async () => {
  // Arrange
  const centre = await centreFactory.create()

  // Act
  await BulkCreateService.perform(centre)

  // Assert
  const employeeBenefitsCount = await EmployeeBenefit.count({
    centreId: centre.id,
  })
  expect(employeeBenefitsCount).toEqual(12)
})

// Incorrect - comparing two dynamic values (false positive if both are 0)
test("when creating centre, creates employee benefits for all fiscal periods", async () => {
  const centre = await centreFactory.create()
  await BulkCreateService.perform(centre)

  const employeeBenefits = await EmployeeBenefit.findAll({
    where: { centreId: centre.id },
  })
  const fiscalPeriodsCount = await FiscalPeriod.count()
  expect(employeeBenefits.length).toEqual(fiscalPeriodsCount) // ❌ Passes if both are 0
})

// Incorrect - loop with multiple assertions
test("when creating employee benefits, initializes all costs to zero", async () => {
  const centre = await centreFactory.create()
  await BulkCreateService.perform(centre)

  const employeeBenefits = await EmployeeBenefit.findAll({
    where: { centreId: centre.id },
  })
  for (const employeeBenefit of employeeBenefits) {
    expect(employeeBenefit.actualCost).toEqual("0")
    expect(employeeBenefit.estimatedCost).toEqual("0")
  }
})
```

**Pattern 3:** Use multi-line formatting for object matchers, with one property per line.

```typescript
// Correct - multi-line with one property per line
expect(response.body.user).toMatchObject({
  id: user.id,
  email: user.email,
})

// Incorrect - single line
expect(response.body.user).toMatchObject({ id: user.id, email: user.email })
```

**Pattern 4:** Use destructuring when extracting single properties from objects in map functions.

```typescript
// Correct - destructuring for single property
const fundingSubmissionLineIds = fundingSubmissionLines.map(({ id }) => id)

// Incorrect - full object parameter
const fundingSubmissionLineIds = fundingSubmissionLines.map((line) => line.id)
```

**Pattern 5:** Format arrays in expect statements across multiple lines. Avoid sorting entirely and be explicit about expected order since Sequelize is deterministic.

```typescript
// Correct - multi-line, explicit order
expect(fundingSubmissionLineIds).toEqual([
  fundingSubmissionLine1.id,
  fundingSubmissionLine2.id,
])

// Incorrect - single line with sorting
expect(fundingSubmissionLineIds).toEqual(
  [fundingSubmissionLine1.id, fundingSubmissionLine2.id].sort()
)
```

**Pattern 6:** Use `-1` for non-existent ID test scenarios in all test cases.

```typescript
// Correct
const results = await Model.scope("byFundingPeriodId", -1).findAll()

// Incorrect
const results = await Model.scope("byFundingPeriodId", 99999).findAll()
```

**Rationale:**

- One expect per test makes failures easier to diagnose and tests more focused
- Simple assertions are easier to understand and maintain
- Multi-line formatting is more readable and follows the principle of one thing per line

### Test Structure (AAA Pattern)

**Pattern:** Use explicit `// Arrange`, `// Act`, `// Assert` comments to clearly delineate test sections.

```typescript
test("when there are payments, updates funding reconciliation amounts", async () => {
  // Arrange
  const centre = await centreFactory.create()
  const fundingPeriod = await fundingPeriodFactory.create({
    fiscalYear: "2025-2026",
  })
  const fundingReconciliation = await fundingReconciliationFactory.create({
    centreId: centre.id,
    fundingPeriodId: fundingPeriod.id,
  })

  // Act
  await RefreshService.perform(fundingReconciliation)

  // Assert
  await fundingReconciliation.reload()
  expect(fundingReconciliation.fundingReceivedTotalAmount).toBe("150.0000")
})
```

**Rationale:**

- Comments serve as visual separators making tests easier to scan
- Clearly documents the test's structure and intent
- Consistent structure across all tests in the codebase

---

## Authentication and Authorization

### Secure-by-Default Pattern

**All routes require authentication by default.** Define public routes first, then apply authentication middleware.

```typescript
// Public routes defined first, then authentication middleware applies to all subsequent routes
router.route("/_status").get((_req, res) => {
  res.json({
    RELEASE_TAG,
    GIT_COMMIT_HASH,
  })
})

// Apply authentication to all /api routes
router.use("/api", checkJwt, autheticateAndLoadCurrentUser)

// All routes after this middleware require authentication
router.route("/api/current-user").get(CurrentUserController.show)

// Full CRUD example for a resource
router.route("/api/payments").get(PaymentsController.index).post(PaymentsController.create)
router
  .route("/api/payments/:paymentId")
  .get(PaymentsController.show)
  .patch(PaymentsController.update)
  .delete(PaymentsController.destroy)
```

Never apply per-route authentication. Use "Secure by Default" principle - always.
If a route should have reduced security, explicitly opt-out.

**Benefits:**

- New routes are secure by default
- Prevents accidental exposure of protected data
- Clear intent when making routes public
- Follows principle of least privilege

---

## Summary

These patterns ensure:

- **Consistency** across the codebase
- **Maintainability** with clear separation of concerns
- **Type safety** through TypeScript
- **Security** with authorization checks and input validation
- **Developer experience** with clear conventions

When in doubt, follow these patterns. When extending the codebase, maintain these conventions.

---

## Changelog Management

### Architecture

- Maintain a **single canonical `CHANGELOG.md` file in the origin repository**.
- Track **upstream history starting from `v2024.10.5.1`** using version sections:
  - `## [vYYYY.MM.DD.x] - YYYY-MM-DD`
- Use **`## [Unreleased]` for origin-only work**:
  - Describes changes on `origin/main` **since the latest upstream release tag**.
  - Do not create extra version sections for origin-only tags; move changes into a versioned section only when there is a corresponding upstream release.
- Keep `CHANGELOG.md` in **reverse chronological order** with `Unreleased` at the top.

### Versioning Scheme

- The changelog format is based on **Keep a Changelog** (https://keepachangelog.com/en/1.0.0/).
- Release tags and version headings use a **time-based version format**, not semantic versioning:
  - `vYYYY.MM.DD.i` (for example `v2025.11.25.1`).
  - These tags are generated by the `.github/workflows/docker-publish.yml` workflow using `tag_template: "yyyy.mm.dd.i"`.
- Changelog sections should match these time-based tags so that `## [vYYYY.MM.DD.x] - YYYY-MM-DD` aligns with the GitHub release and Docker image tags.

### Format and Content

- Follow **Keep a Changelog** structure:
  - `## [Unreleased]`
  - `## [version] - date`
  - Section headings:
    - `### Added`
    - `### Changed`
    - `### Deprecated`
    - `### Fixed`
    - `### Removed`
    - `### Security`
- Focus on **user-impacting and product-owner-relevant changes**:
  - Group low-level commits into a few high-level bullets.
  - Use a single bullet such as "Developer improvements to tests, migrations, and logging" for large batches of internal changes.
  - Avoid commit-log style listings and internal-only implementation details.
- Include short **"Why?" explanations** for major technical changes:
  - Framework upgrades (for example Sequelize 7, Node 22).
  - New subsystems (for example funding reconciliations).
  - Schema changes and migrations.
- Use **clear, non-abbreviated language**:
  - Describe features in domain terms (for example "funding reconciliation feature", "user administration improvements").
  - Avoid table or variable abbreviations in entries.

### Origin vs Upstream Responsibilities

- **Upstream releases** define the official version numbers recorded in `CHANGELOG.md`.
- **Origin-only changes** always live under `Unreleased`:
  - Never create a version heading for an origin-only release.
  - Non-upstream work stays in `Unreleased` until it has been deployed as part of an upstream release.
- When an upstream release lands:
  - Move the relevant `Unreleased` bullets into a new version section for that upstream tag.
  - Update the `Unreleased` heading line to reference the new version (`Changes since vYYYY.MM.DD.x that will be included in the next release.`).

### Release Workflow

1. **Before tagging an upstream-aligned release**
   - Review `Unreleased` and group items into user-facing themes.
   - Remove overly detailed technical notes that only matter to developers.
   - Ensure breaking changes, migrations, and security improvements are clearly called out.
2. **At release time**
   - Add a new version section: `## [vYYYY.MM.DD.x] - YYYY-MM-DD`.
   - Move curated `Unreleased` bullets into the new section under the appropriate headings.
   - Optionally add a short "Highlights" subsection with 3–5 key bullets.
   - Reset `Unreleased` to reference the new version in its "Changes since …" line and leave it otherwise empty.

### Per-PR Expectations

- For any pull request that changes **user-visible behavior** or **database schema**:
  - Add at least one bullet to `## [Unreleased]` under the correct heading.
  - Write entries in user-facing language (what changed and why), not internal class or file names.
  - Add a brief "Why?" for new subsystems or migration-relevant changes.
- Pure refactors and test-only changes **may be omitted per PR** and summarized later as a single "developer improvements" bullet during release preparation.

### Automation Hints

- Git commit messages already use **GitHub-style emojis**; these can be used to draft changelog entries:
  - `:sparkles:` → Added
  - `:bug:` / `:beetle:` → Fixed
  - `:recycle:` / `:hammer:` → Changed (refactor or structural change)
  - `:fire:` → Removed
  - `:lock:` → Security
- A helper script can:
  - Scan `git log` since the last upstream tag.
  - Group commits by emoji into provisional sections (`Added`, `Changed`, `Fixed`, and so on).
  - Output a **draft Unreleased block** that is then manually curated to remove noise and rephrase entries as user-focused bullets.

---

## Pull Request Documentation

### Structure

Pull requests follow the standard template defined in [`.github/pull_request_template.md`](./.github/pull_request_template.md).

### Implementation Section

**Pattern:** Use a numbered list describing high-level technical changes organized by layer or concern.

**Good implementation entries:**

```markdown
1. Create database migrations to convert money fields to DECIMAL types:
   - Migrate employee benefits from DECIMAL(10,2) to DECIMAL(15,4)
   - Migrate payments from INTEGER (cents) to DECIMAL(15,4) (dollars)
2. Update model definitions to match migrations:
   - Change DataTypes from FLOAT/INTEGER to DECIMAL
   - Change TypeScript types from `number` to `string`
3. Add Big.js utilities for precise decimal arithmetic:
   - Create sumByDecimal utility in both API and web
   - Update formatMoney to accept Big type
```

**Key principles:**

- Focus on **what changed** at an architectural level, not implementation details
- Group related changes under common themes (migrations, models, utilities, etc.)
- Use sub-bullets for specificity when a change has multiple parts
- Mention new patterns or utilities introduced
- Reference specific technologies or libraries when relevant (Big.js, Sequelize, etc.)
- Order by dependency: migrations → models → services → components
- Avoid file paths unless necessary for clarity

### Testing Instructions

**Pattern:** Provide step-by-step verification that covers the main user-facing changes.

**Standard baseline:**

```markdown
1. Run the test suite via `dev test` (or `dev test_api`)
2. Boot the app via `dev up`
3. Check that the app compiles and you can log in at http://localhost:8080
4. [Feature-specific testing steps]
```

**Feature-specific steps should:**

- Use imperative mood ("Navigate to...", "Verify that...", "Check that...")
- Cover the primary user workflows affected by changes
- Test both happy path and edge cases when relevant
- Reference specific URLs or UI elements to click
- Verify data persistence when applicable
