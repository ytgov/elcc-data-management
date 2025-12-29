import { isEmpty } from "lodash"
import { type CreationAttributes } from "@sequelize/core"

import { Centre, EmployeeBenefit, FiscalPeriod, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateService extends BaseService {
  constructor(
    private centre: Centre,
    private fundingPeriod: FundingPeriod
  ) {
    super()
  }

  async perform(): Promise<EmployeeBenefit[]> {
    const fiscalPeriods = await FiscalPeriod.findAll({
      where: {
        fundingPeriodId: this.fundingPeriod.id,
      },
    })
    if (isEmpty(fiscalPeriods)) {
      throw new Error("No fiscal periods found for the given funding period")
    }

    const employeeBenefitsAttributes: CreationAttributes<EmployeeBenefit>[] = fiscalPeriods.map(
      (fiscalPeriod) => ({
        centreId: this.centre.id,
        fiscalPeriodId: fiscalPeriod.id,
        grossPayrollMonthlyActual: "0",
        grossPayrollMonthlyEstimated: "0",
        costCapPercentage: EmployeeBenefit.DEFAULT_COST_CAP_PERCENTAGE,
        employeeCostActual: "0",
        employeeCostEstimated: "0",
        employerCostActual: "0",
        employerCostEstimated: "0",
      })
    )

    return EmployeeBenefit.bulkCreate(employeeBenefitsAttributes)
  }
}

export default BulkCreateService
