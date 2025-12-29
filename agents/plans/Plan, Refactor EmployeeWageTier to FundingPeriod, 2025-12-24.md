# Plan: Refactor EmployeeWageTier from FiscalPeriod to FundingPeriod

**Problem**: EmployeeWageTier incorrectly attached to FiscalPeriod, creating 84+ records per funding period instead of 7.

**Goal**: Attach EmployeeWageTier to FundingPeriod directly, reducing data duplication and simplifying queries.

**Impact**: This will make the Admin UI more sensible and usable for the EmployeeWageTier model.

## Migration Strategy

### Phase 1: Add New Columns & Snapshots

1. **Add fundingPeriodId to EmployeeWageTier**:

```typescript
await queryInterface.addColumn("employee_wage_tiers", "funding_period_id", {
  type: Sequelize.INTEGER,
  allowNull: true,
  references: { model: "funding_periods", key: "id" },
})

// Populate from fiscal periods
await queryInterface.sequelize.query(/* sql */ `
  UPDATE employee_wage_tiers
  SET
    funding_period_id = fiscal_periods.funding_period_id
  FROM
    fiscal_periods
  WHERE
    employee_wage_tiers.fiscal_period_id = fiscal_periods.id
`)

// Make non-null
await queryInterface.changeColumn("employee_wage_tiers", "funding_period_id", {
  type: Sequelize.INTEGER,
  allowNull: false,
})
```

2. **Add snapshots to WageEnhancement** (preserve historical data):

```typescript
// Add snapshot columns
await queryInterface.addColumn("wage_enhancements", "wage_tier_label_snapshot", {
  type: Sequelize.STRING,
  allowNull: true,
})
await queryInterface.addColumn("wage_enhancements", "wage_rate_per_hour_snapshot", {
  type: Sequelize.DECIMAL(10, 2),
  allowNull: true,
})

// Populate from current employee_wage_tiers
await queryInterface.sequelize.query(/* sql */ `
  UPDATE wage_enhancements
  SET
    wage_tier_label_snapshot = employee_wage_tiers.tier_label,
    wage_rate_per_hour_snapshot = employee_wage_tiers.wage_rate_per_hour
  FROM
    employee_wage_tiers
  WHERE
    wage_enhancements.employee_wage_tier_id = employee_wage_tiers.id
`)

// Make non-null
await queryInterface.changeColumn("wage_enhancements", "wage_tier_label_snapshot", {
  allowNull: false,
})
await queryInterface.changeColumn("wage_enhancements", "wage_rate_per_hour_snapshot", {
  allowNull: false,
})
```

3. **Add fiscal_period_id to WageEnhancement** (for direct queries):

```typescript
await queryInterface.addColumn("wage_enhancements", "fiscal_period_id", {
  type: Sequelize.INTEGER,
  allowNull: true,
  references: { model: "fiscal_periods", key: "id" },
})

// Populate from employee_wage_tiers
await queryInterface.sequelize.query(/* sql */ `
  UPDATE wage_enhancements
  SET
    fiscal_period_id = employee_wage_tiers.fiscal_period_id
  FROM
    employee_wage_tiers
  WHERE
    wage_enhancements.employee_wage_tier_id = employee_wage_tiers.id
`)

await queryInterface.changeColumn("wage_enhancements", "fiscal_period_id", { allowNull: false })
```

### Phase 2: Deduplicate Records

```sql
-- Keep first record per funding_period_id + tier_level
DELETE FROM employee_wage_tiers
WHERE
  id NOT IN (
    SELECT DISTINCT
      ON (funding_period_id, tier_level) id
    FROM
      employee_wage_tiers
    ORDER BY
      funding_period_id,
      tier_level,
      id ASC
  )
  -- Add unique constraint
ALTER TABLE employee_wage_tiers
ADD CONSTRAINT unique_funding_period_tier UNIQUE (funding_period_id, tier_level);
```

### Phase 3: Update Models & Services

**EmployeeWageTier Model:**

- Remove `fiscalPeriodId` field
- Add `fundingPeriodId` field
- Update association to `FundingPeriod`

**Services:**

- `BulkEnsureService`: Query directly by `fundingPeriodId`
- `BulkCreateService`: Create 7 records per funding period (not 84)
- `ReplicateEstimatesService`: Use new snapshot columns

### Phase 4: Cleanup

- Remove deprecated `fiscal_period_id` column from EmployeeWageTier
- Update any remaining references
- Add monitoring for old patterns

## Key Changes

### Model Updates

```typescript
// EmployeeWageTier model changes
- @Attribute(DataTypes.INTEGER) @NotNull declare fiscalPeriodId: number
+ @Attribute(DataTypes.INTEGER) @NotNull declare fundingPeriodId: number

// WageEnhancement model additions
+ @Attribute(DataTypes.STRING) @NotNull declare wageTierLabelSnapshot: string
+ @Attribute(DataTypes.DECIMAL(10, 2)) @NotNull declare wageRatePerHourSnapshot: number
+ @Attribute(DataTypes.INTEGER) @NotNull declare fiscalPeriodId: number
```

### Service Updates

- **BulkEnsureService**: Direct query by `fundingPeriodId` (no fiscal period join)
- **BulkCreateService**: Create 7 records per funding period (down from 84)
- **ReplicateEstimatesService**: Include snapshot capture in WageEnhancement creation

### Expected Results

- **Before**: 84 EmployeeWageTier records per funding period
- **After**: 7 EmployeeWageTier records per funding period
- **Reduction**: ~92% fewer records
- **Historical data**: Preserved via WageEnhancement snapshots

## Rollback Strategy

```bash
# Stop services
dev down

# Rollback migrations
dev migrate down -- --to 0

# Restore from backup if needed (local development only)
# Note: Running locally so data backup not critical

# Restart services
dev up --build
```

**Note**: Test rollback procedure in staging before production use.

## Testing Strategy

### Unit Tests

- Model associations (EmployeeWageTier → FundingPeriod)
- Service methods (BulkEnsureService, BulkCreateService)
- WageEnhancement snapshot creation

### Integration Tests

- API endpoints with new relationships
- Database constraints enforcement
- Migration rollback procedures


## Risks & Mitigations

| Risk                           | Mitigation                    |
| ------------------------------ | ----------------------------- |
| Data loss during deduplication | Full backup + staging test    |
| Performance impact             | Run during maintenance window |
| Application bugs               | Phase-by-phase rollout        |

## Success Criteria

- Records reduced from 84+ to 7 per funding period
- All WageEnhancement snapshots populated
- No data integrity violations
- Application performance improved

## Timeline: 9-14 days total

### Long-term (1 month)

- [ ] Remove any remaining temporary compatibility code
- [ ] Update all documentation
- [ ] Team training on new data model
- [ ] Monitor for any unexpected issues

## Detailed Rollback Procedure

### Step 1: Stop Services

```bash
dev down
```

### Step 2: Database Rollback

```bash
# Rollback migrations in reverse order
dev migrate down -- --to 0
```

### Step 3: Restore from Backup (if needed)

```bash
# Restore database backup taken before migration
# (specific commands depend on backup system)
```

### Step 4: Revert Code Changes

```bash
# Revert to previous commit
git checkout <previous-stable-commit>
```

### Step 5: Restart Services

```bash
dev up --build
```

### Step 6: Verification

- [ ] Application starts successfully
- [ ] All API endpoints respond correctly
- [ ] Data integrity verified
- [ ] Performance baseline restored

---

**Note**: This rollback procedure should be tested in a staging environment before being needed in production.
