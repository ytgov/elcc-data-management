import { type CreationAttributes } from "@sequelize/core"

import { Centre, EmployeeBenefit, FiscalPeriod } from "@/models"
import BaseService from "@/services/base-service"
import { FiscalPeriods, FundingPeriods } from "@/services"

export class BulkCreateForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    const fiscalPeriods = await this.ensureFiscalPeriodsForCurrentFundingPeriod()

    let employeeBenefitsAttributes: CreationAttributes<EmployeeBenefit>[] = []
    const BATCH_SIZE = 1000

    for (const fiscalPeriod of fiscalPeriods) {
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
    }

    if (employeeBenefitsAttributes.length > 0) {
      await EmployeeBenefit.bulkCreate(employeeBenefitsAttributes)
    }
  }

  private async ensureFiscalPeriodsForCurrentFundingPeriod(): Promise<FiscalPeriod[]> {
    const fundingPeriod = await FundingPeriods.EnsureCurrentService.perform()
    return FiscalPeriods.BulkEnsureForFundingPeriodService.perform(fundingPeriod)
  }
}

export default BulkCreateForCentreService
