import { type CreationAttributes } from "@sequelize/core"

import { Centre, FundingPeriod, FundingReconciliation } from "@/models"
import { FundingReconciliationStatuses } from "@/models/funding-reconciliation"
import BaseService from "@/services/base-service"

export class BulkCreateForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    let fundingReconciliationsAttributes: CreationAttributes<FundingReconciliation>[] = []
    const BATCH_SIZE = 1000

    await FundingPeriod.findEach(async (fundingPeriod) => {
      fundingReconciliationsAttributes.push({
        centreId: this.centre.id,
        fundingPeriodId: fundingPeriod.id,
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

export default BulkCreateForCentreService
