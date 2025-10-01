import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const FiscalPeriodsFiscalYearMonthUniqueIndex = createIndexDecorator(
  "fiscal-periods-fiscal-year-month-unique",
  {
    unique: true,
    name: "fiscal_periods_fiscal_year_month",
  }
)

export default FiscalPeriodsFiscalYearMonthUniqueIndex
