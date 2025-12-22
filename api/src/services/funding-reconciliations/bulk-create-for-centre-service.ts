import { type CreationAttributes } from "@sequelize/core"

import { Centre, FundingReconciliation } from "@/models"
import { FundingReconciliationStatuses } from "@/models/funding-reconciliation"
import BaseService from "@/services/base-service"
import { FundingPeriods } from "@/services"

export class BulkCreateForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<FundingReconciliation> {
    const fundingPeriod = await this.ensureCurrentFundingPeriod()

    const fundingReconciliationAttributes: CreationAttributes<FundingReconciliation> = {
      centreId: this.centre.id,
      fundingPeriodId: fundingPeriod.id,
      status: FundingReconciliationStatuses.DRAFT,
      fundingReceivedTotalAmount: "0",
      eligibleExpensesTotalAmount: "0",
      payrollAdjustmentsTotalAmount: "0",
      finalBalanceAmount: "0",
    }

    const fundingReconciliation = await FundingReconciliation.create(fundingReconciliationAttributes)
    return fundingReconciliation
  }

  private async ensureCurrentFundingPeriod() {
    return FundingPeriods.EnsureCurrentService.perform()
  }
}

export default BulkCreateForCentreService
