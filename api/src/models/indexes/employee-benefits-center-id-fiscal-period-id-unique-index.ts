import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const EmployeeBenefitsCenterIdFiscalPeriodIdUniqueIndex = createIndexDecorator(
  "employee-benefits-center-id-fiscal-period-id-unique",
  {
    unique: true,
    name: "employee_benefits_centre_id_fiscal_period_id",
  }
)

export default EmployeeBenefitsCenterIdFiscalPeriodIdUniqueIndex
