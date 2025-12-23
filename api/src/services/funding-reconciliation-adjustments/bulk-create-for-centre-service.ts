import { type CreationAttributes } from "@sequelize/core"

import {
  FiscalPeriod,
  Centre,
  FundingReconciliation,
  FundingReconciliationAdjustment,
} from "@/models"
import BaseService from "@/services/base-service"
import { FundingPeriods, FundingReconciliations } from "@/services"

export class BulkCreateForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<FundingReconciliationAdjustment[]> {
    const fundingReconciliation = await this.ensureFundingReconciliation()
    const fiscalPeriods = await this.ensureFiscalPeriodsForCurrentFundingPeriod()

    const fundingReconciliationAdjustmentsAttributes: CreationAttributes<FundingReconciliationAdjustment>[] =
      fiscalPeriods.map((fiscalPeriod) => ({
        fundingReconciliationId: fundingReconciliation.id,
        fiscalPeriodId: fiscalPeriod.id,
        fundingReceivedPeriodAmount: "0",
        eligibleExpensesPeriodAmount: "0",
        payrollAdjustmentsPeriodAmount: "0",
        cumulativeBalanceAmount: "0",
      }))

    const fundingReconciliationAdjustments = await FundingReconciliationAdjustment.bulkCreate(
      fundingReconciliationAdjustmentsAttributes
    )
    return fundingReconciliationAdjustments
  }

  private async ensureFundingReconciliation(): Promise<FundingReconciliation> {
    return FundingReconciliations.BulkEnsureForCentreService.perform(this.centre)
  }

  private async ensureFiscalPeriodsForCurrentFundingPeriod(): Promise<FiscalPeriod[]> {
    const fundingPeriod = await FundingPeriods.EnsureCurrentService.perform()
    return FundingPeriods.FiscalPeriods.BulkEnsureService.perform(fundingPeriod)
  }
}

export default BulkCreateForCentreService
