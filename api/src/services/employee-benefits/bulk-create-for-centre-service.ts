import { type CreationAttributes } from "@sequelize/core"

import { Centre, EmployeeBenefit, FiscalPeriod } from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    let employeeBenefitsAttributes: CreationAttributes<EmployeeBenefit>[] = []
    const BATCH_SIZE = 1000

    await FiscalPeriod.findEach(async (fiscalPeriod) => {
      employeeBenefitsAttributes.push({
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

      if (employeeBenefitsAttributes.length >= BATCH_SIZE) {
        await EmployeeBenefit.bulkCreate(employeeBenefitsAttributes)
        employeeBenefitsAttributes = []
      }
    })

    if (employeeBenefitsAttributes.length > 0) {
      await EmployeeBenefit.bulkCreate(employeeBenefitsAttributes)
    }
  }
}

export default BulkCreateForCentreService
