import { type CreationAttributes } from "@sequelize/core"

import { Centre, EmployeeBenefit, FiscalPeriod, FundingPeriod } from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const { fiscalYear: fundingPeriodFiscalYear } = this.fundingPeriod
    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(fundingPeriodFiscalYear)

    const fiscalPeriods = await FiscalPeriod.findAll({
      where: { fiscalYear: shortFiscalYear },
    })

    let employeeBenefitsAttributes: CreationAttributes<EmployeeBenefit>[] = []
    const BATCH_SIZE = 1000

    await Centre.findEach(async (centre) => {
      for (const fiscalPeriod of fiscalPeriods) {
        employeeBenefitsAttributes.push({
          centreId: centre.id,
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
    })

    if (employeeBenefitsAttributes.length > 0) {
      await EmployeeBenefit.bulkCreate(employeeBenefitsAttributes)
    }
  }
}

export default BulkCreateForFundingPeriodService
