import { type CreationAttributes } from "@sequelize/core"

import { Centre, FundingPeriod, FundingReconciliation } from "@/models"
import { FundingReconciliationStatuses } from "@/models/funding-reconciliation"
import BaseService from "@/services/base-service"

export class BulkCreateForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    let fundingReconciliationsAttributes: CreationAttributes<FundingReconciliation>[] = []
    const BATCH_SIZE = 1000

    await Centre.findEach(async (centre) => {
      fundingReconciliationsAttributes.push({
        centreId: centre.id,
        fundingPeriodId: this.fundingPeriod.id,
        status: FundingReconciliationStatuses.DRAFT,
        fundingReceivedTotalAmount: "0",
        eligibleExpensesTotalAmount: "0",
        payrollAdjustmentsTotalAmount: "0",
        finalBalanceAmount: "0",
      })

      if (fundingReconciliationsAttributes.length >= BATCH_SIZE) {
        await FundingReconciliation.bulkCreate(fundingReconciliationsAttributes)
        fundingReconciliationsAttributes = []
      }
    })

    if (fundingReconciliationsAttributes.length > 0) {
      await FundingReconciliation.bulkCreate(fundingReconciliationsAttributes)
    }
  }
}

export default BulkCreateForFundingPeriodService
