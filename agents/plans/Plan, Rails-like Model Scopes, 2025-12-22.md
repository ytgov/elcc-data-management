# Plan: Rails-like Model Scope Decorator

## Goal

Add new less verbose scope syntax (while keeping original dynamic call syntax):

```typescript
EmployeeWageTier.withScope({ method: ["byFundingPeriod", fundingPeriodId] }).destroy()
```

Into a Rails-like fluent API:

```typescript
EmployeeWageTier.byFundingPeriod(fundingPeriodId).destroy()
```

## Approach: `@ModelScope` Static Method Decorator

Use a **static method decorator** that:

1. Registers the Sequelize scope automatically
2. Wraps the method to return a scoped model instead of `FindOptions`

This approach produces correct TypeScript types because the method signature is explicitly declared on the model class.

### Implementation

Based on [sequelize/sequelize#17307](https://github.com/sequelize/sequelize/issues/17307), we can use `registerModelOptions` from Sequelize's internal decorator API. This hooks directly into Sequelize's model registration system—no separate `establishScopes()` call needed.

**File: `api/src/models/decorators/model-scope.ts`**

````typescript
import { type Attributes, type FindOptions, type Model, type ModelStatic } from "@sequelize/core"
// eslint-disable-next-line @typescript-eslint/no-require-imports
import { registerModelOptions } from "@sequelize/core/_non-semver-use-at-your-own-risk_/decorators/shared/model.js"

/**
 * Decorator that transforms a static method returning FindOptions into a scope method
 * that returns a scoped ModelStatic.
 *
 * Usage:
 * ```typescript
 * @ModelScope
 * static byFundingPeriod(fundingPeriodId: number): FindOptions<EmployeeWageTier> {
 *   return {
 *     include: [{ association: "fiscalPeriod", where: { fundingPeriodId } }],
 *   }
 * }
 * ```
 *
 * This will:
 * 1. Register a Sequelize scope named "byFundingPeriod" via registerModelOptions
 * 2. Replace the method to return `this.withScope({ method: ["byFundingPeriod", ...args] })`
 */
export function ModelScope<M extends Model>(
  target: ModelStatic<M>,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<(...args: unknown[]) => FindOptions<Attributes<M>>>
): TypedPropertyDescriptor<(...args: unknown[]) => ModelStatic<M>> {
  const originalMethod = descriptor.value
  if (!originalMethod) {
    throw new Error("@ModelScope can only be applied to methods with a body")
  }

  // Register the scope with Sequelize's internal decorator system
  registerModelOptions(target, {
    scopes: {
      [propertyKey]: originalMethod.bind(target),
    },
  })

  // Replace the method to return a scoped model
  return {
    ...descriptor,
    value: function (this: ModelStatic<M>, ...args: unknown[]): ModelStatic<M> {
      return this.withScope({
        method: [propertyKey, ...args],
      })
    },
  } as TypedPropertyDescriptor<(...args: unknown[]) => ModelStatic<M>>
}

export default ModelScope
````

**Note:** This uses Sequelize's internal `_non-semver-use-at-your-own-risk_` API. It's the same mechanism used by `@Attribute`, `@Table`, etc., but may change between minor versions.

### Usage in Models

**Before:**

```typescript
export class EmployeeWageTier extends BaseModel<...> {
  // ... attributes and associations ...

  static establishScopes() {
    this.addScope("byFundingPeriod", (fundingPeriodId: number) => ({
      include: [
        {
          association: "fiscalPeriod",
          where: {
            fundingPeriodId,
          },
        },
      ],
    }))
  }
}
```

**After:**

```typescript
import { type FindOptions, type ModelStatic } from "@sequelize/core"

import { ModelScope } from "@/models/decorators/model-scope"

export class EmployeeWageTier extends BaseModel<...> {
  // ... attributes and associations ...

  @ModelScope
  static byFundingPeriod(fundingPeriodId: number): FindOptions<EmployeeWageTier> {
    return {
      include: [
        {
          association: "fiscalPeriod",
          where: {
            fundingPeriodId,
          },
        },
      ],
    }
  }
}
```

**Runtime behavior:** After decoration, `EmployeeWageTier.byFundingPeriod(id)` returns `ModelStatic<EmployeeWageTier>` (not `FindOptions`).

### Why This Works

1. **Uses Sequelize's internal decorator API**: `registerModelOptions` is the same mechanism used by `@Attribute`, `@Table`, etc.
2. **No separate registration step**: Scopes are registered when the model is initialized with Sequelize
3. **Method-based definition**: Scope logic lives in a real method body—supports complex logic, early returns, etc.
4. **Both APIs work**: Fluent (`Model.byFundingPeriod(id)`) and traditional (`withScope({ method: [...] })`)

### Files to Create

1. `api/src/models/decorators/model-scope.ts` - The decorator implementation
2. `api/src/models/decorators/index.ts` - Export barrel

### Files to Modify

1. `api/src/models/employee-wage-tier.ts` - Convert scope to decorated method
2. `api/src/models/employee-benefit.ts` - Same
3. `api/src/models/wage-enhancement.ts` - Same
4. `api/src/models/building-expense.ts` - Same
5. `api/src/models/payment.ts` - Same
6. `api/src/models/funding-reconciliation.ts` - Same (`byFiscalYearLong`)
7. `api/src/models/funding-region.ts` - Same (`excludingIds`)
8. `api/src/models/building-expense-category.ts` - Same (`excludingIds`)
9. `api/src/models/funding-submission-line.ts` - Same (`byFundingPeriod`)
10. `api/src/models/funding-submission-line-json.ts` - Same (`byFundingPeriod`, `withChildOccupancyRate`)

### Usage in Services

**Before:**

```typescript
await EmployeeWageTier.withScope({ method: ["byFundingPeriod", fundingPeriodId] }).destroy()
```

**After:**

```typescript
await EmployeeWageTier.byFundingPeriod(fundingPeriodId).destroy()
```

### Notes

- `establishScopes()` can be removed from models once all scopes use `@ModelScope` decorator
- The `addSearchScope` helper in `BaseModel` could be converted to use `@ModelScope` pattern later
- Models with multiple scopes will have multiple `@ModelScope` decorated properties
- Uses internal Sequelize API (`_non-semver-use-at-your-own-risk_`) - may need updates between Sequelize versions

---

## Separate Task: Update Destroy Service

Before implementing the above, update `api/src/services/funding-periods/destroy-service.ts` to use the current scope pattern for all deletion methods that go through fiscal periods.
