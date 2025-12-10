import { type CreationAttributes } from "@sequelize/core"

import {
  FiscalPeriod,
  Centre,
  FundingReconciliation,
  FundingReconciliationAdjustment,
} from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateForCentreService extends BaseService {
  constructor(private centre: Centre) {
    super()
  }

  async perform(): Promise<void> {
    let adjustmentsAttributes: CreationAttributes<FundingReconciliationAdjustment>[] = []
    const BATCH_SIZE = 1000

    await FundingReconciliation.findEach(
      {
        where: {
          centreId: this.centre.id,
        },
      },
      async (fundingReconciliation) => {
        await FiscalPeriod.findEach(async (fiscalPeriod) => {
          adjustmentsAttributes.push({
            fundingReconciliationId: fundingReconciliation.id,
            fiscalPeriodId: fiscalPeriod.id,
            fundingReceivedPeriodAmount: "0",
            eligibleExpensesPeriodAmount: "0",
            payrollAdjustmentsPeriodAmount: "0",
            cumulativeBalanceAmount: "0",
          })

          if (adjustmentsAttributes.length >= BATCH_SIZE) {
            await FundingReconciliationAdjustment.bulkCreate(adjustmentsAttributes)
            adjustmentsAttributes = []
          }
        })
      }
    )

    if (adjustmentsAttributes.length > 0) {
      await FundingReconciliationAdjustment.bulkCreate(adjustmentsAttributes)
    }
  }
}

export default BulkCreateForCentreService
