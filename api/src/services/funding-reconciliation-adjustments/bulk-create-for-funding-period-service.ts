import { type CreationAttributes } from "@sequelize/core"

import {
  FiscalPeriod,
  FundingPeriod,
  FundingReconciliation,
  FundingReconciliationAdjustment,
} from "@/models"
import BaseService from "@/services/base-service"

export class BulkCreateForFundingPeriodService extends BaseService {
  constructor(private fundingPeriod: FundingPeriod) {
    super()
  }

  async perform(): Promise<void> {
    const shortFiscalYear = FiscalPeriod.toShortFiscalYearFormat(this.fundingPeriod.fiscalYear)

    const fiscalPeriods = await FiscalPeriod.findAll({
      where: { fiscalYear: shortFiscalYear },
    })

    let adjustmentsAttributes: CreationAttributes<FundingReconciliationAdjustment>[] = []
    const BATCH_SIZE = 1000

    await FundingReconciliation.findEach(
      { where: { fundingPeriodId: this.fundingPeriod.id } },
      async (fundingReconciliation) => {
        for (const fiscalPeriod of fiscalPeriods) {
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
        }
      }
    )

    if (adjustmentsAttributes.length > 0) {
      await FundingReconciliationAdjustment.bulkCreate(adjustmentsAttributes)
    }
  }
}

export default BulkCreateForFundingPeriodService
