#### Ledger vs Template Model Pattern

- **Template models** hold current configuration and rates.
  - Can be updated over time.
  - Changes only affect new ledger records.
  - Examples: `BuildingExpenseCategory`, `EmployeeWageTier`.

- **Ledger models** record period-specific facts.
  - Store values "as of" a specific fiscal period (for example `fiscalPeriodId`, `subsidyRate`, `squareFootage`).
  - Rate and other period-anchored fields are **copied at creation** and not re-templated later.
  - User edits to transaction fields (such as `estimatedCost`, `actualCost`, `notes`) are allowed for corrections.
  - Examples: `BuildingExpense`, `Payment`, `WageEnhancement`, `EmployeeBenefit`.

**Example shape (simplified):**

```typescript
// Template
export class BuildingExpenseCategory extends BaseModel {
  @Attribute(DataTypes.INTEGER)
  declare fundingRegionId: number

  @Attribute(DataTypes.STRING(100))
  declare categoryName: string

  @Attribute(DataTypes.DECIMAL(5, 4))
  declare subsidyRate: string
}

// Ledger
export class BuildingExpense extends BaseModel {
  @Attribute(DataTypes.INTEGER)
  declare centreId: number

  @Attribute(DataTypes.INTEGER)
  declare fiscalPeriodId: number

  @Attribute(DataTypes.INTEGER)
  declare buildingExpenseCategoryId: number

  @Attribute(DataTypes.DECIMAL(5, 4))
  declare subsidyRate: string  // copied from category at creation

  @Attribute(DataTypes.DECIMAL(10, 2))
  declare squareFootage: string  // copied from centre at creation

  @Attribute(DataTypes.DECIMAL(15, 4))
  declare estimatedCost: string

  @Attribute(DataTypes.DECIMAL(15, 4))
  declare actualCost: string
}

**Key Benefits:**

- **Historical accuracy**: Ledger records preserve rates and values as they existed at transaction time
- **Administrative flexibility**: Template data can be updated without affecting past transactions
- **Audit compliance**: Complete historical record of what rates were used and when
- **Data integrity**: Clear separation between mutable configuration and immutable transactions
- **Reporting accuracy**: Historical reports use the actual rates that were in effect, not current rates

**Rules:**

- Do not re-template or automatically recompute frozen, period-anchored fields on ledger models.
- Template models can be freely updated; ledger models keep the values they were created with.
- When designing new models, be explicit about which fields are copied "as of" a given month or fiscal period.
