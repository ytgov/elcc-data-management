import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const FiscalPeriodsFundingPeriodIdFiscalYearMonthUniqueIndex = createIndexDecorator(
  "fiscal-periods-funding-period-id-fiscal-year-month-unique",
  {
    unique: true,
    name: "fiscal_periods_funding_period_id_fiscal_year_month_unique",
    msg: "Fiscal period already exists for this funding period, fiscal year, and month.",
  }
)

export default FiscalPeriodsFundingPeriodIdFiscalYearMonthUniqueIndex
