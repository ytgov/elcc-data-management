import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const EmployeeWageTiersFiscalPeriodIdTierLevelUniqueIndex = createIndexDecorator(
  "employee-wage-tiers-fiscal-period-id-tier-level-unique",
  {
    unique: true,
    name: "unique_employee_wage_tiers_on_fiscal_period_id_tier_level",
  }
)

export default EmployeeWageTiersFiscalPeriodIdTierLevelUniqueIndex
