import { createIndexDecorator } from "@sequelize/core/decorators-legacy"

export const EmployeeBenefitsCenterIdFiscalPeriodIdUniqueIndex = createIndexDecorator(
  "employee-benefits-center-id-fiscal-period-id-unique",
  {
    unique: true,
    name: "employee_benefits_centre_id_fiscal_period_id_unique",
    where: {
      deletedAt: null,
    },
    msg: "An employee benefit already exists for this centre and fiscal period",
  }
)

export default EmployeeBenefitsCenterIdFiscalPeriodIdUniqueIndex
