import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const EmployeeWageTiersFiscalPeriodIdTierLevelUniqueIndex = createIndexDecorator(
  "employee-wage-tiers-fiscal-period-id-tier-level-unique",
  {
    unique: true,
    name: "employee_wage_tiers_on_fiscal_period_id_tier_level_unique",
    where: {
      deletedAt: null,
    },
    msg: "An employee wage tier with this level already exists for this fiscal period",
  }
)

export default EmployeeWageTiersFiscalPeriodIdTierLevelUniqueIndex
